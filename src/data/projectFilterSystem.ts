export type CoreType = "CORE" | "CORE+" | "CORE++";

const categoryIds = ["core", "expansion", "pipeline"] as const;

export type CategoryId = (typeof categoryIds)[number];

export type ProjectListingStatus = "upcoming" | "active" | "finished";

type IndexProjectStatus = ProjectListingStatus | "unlisted";

export type ProjectMetric = {
  label: string;
  value: string;
};

export type ProjectInfo = {
  label: string;
  value: string;
};

export type ProjectDocument = {
  label: string;
  filePath: string;
};

export type ProjectGalleryItem = {
  kind: "video" | "image";
  title: string;
  src: string;
};

export type ListedProject = {
  id: string;
  listingStatus: ProjectListingStatus;
  name: string;
  country: string;
  fundingRound: string;
  completionDate: string;
  totalFundraising: string;
  ticketSize: string;
  ticketsLeft: number;
  contractAddress: string;
  contractAuthorityChecksum?: string;
  assetSize: string;
  coreType: CoreType;
  sector: string;
  subsector: string;
  metrics: ProjectMetric[];
  details: ProjectInfo[];
  documents: ProjectDocument[];
  gallery: ProjectGalleryItem[];
};

type PartialListedProject = Omit<ListedProject, "documents"> & {
  documents?: ProjectDocument[];
};

type RawProjectRecord = {
  id?: unknown;
  name?: unknown;
  country?: unknown;
  fundingRound?: unknown;
  completionDate?: unknown;
  totalFundraising?: unknown;
  ticketSize?: unknown;
  ticketsLeft?: unknown;
  coreType?: unknown;
  sector?: unknown;
  subsector?: unknown;
  contractAddress?: unknown;
  contractAuthorityChecksum?: unknown;
  assetSize?: unknown;
  metrics?: unknown;
  details?: unknown;
  documents?: unknown;
  gallery?: unknown;
};

type RawIndexEntry = {
  id?: unknown;
  category?: unknown;
  status?: unknown;
  _comment?: unknown;
};

const isCoreType = (value: unknown): value is CoreType =>
  value === "CORE" || value === "CORE+" || value === "CORE++";

export const coreOptions: CoreType[] = ["CORE", "CORE+", "CORE++"];

export type SectorSubcategory = {
  label: string;
};

export type SectorCategory = {
  label: string;
  subcategories: SectorSubcategory[];
};

export const sectorTaxonomy: SectorCategory[] = [
  {
    label: "Transportation & Mobility",
    subcategories: [
      { label: "Toll Road Infrastructure" },
      { label: "Ports" },
      { label: "Airports" },
      { label: "Rail Networks" },
      { label: "EV Charging Networks" },
    ],
  },
  {
    label: "Utilities",
    subcategories: [
      { label: "Water Infrastructure" },
      { label: "Grid Management" },
      { label: "Gas Distribution" },
      { label: "Waste Systems" },
      { label: "Metering Solutions" },
    ],
  },
  {
    label: "Digital & Communication",
    subcategories: [
      { label: "Data Centers" },
      { label: "Fiber Networks" },
      { label: "Tower Infrastructure" },
      { label: "Cloud Campus" },
      { label: "Submarine Cables" },
    ],
  },
  {
    label: "Energy",
    subcategories: [
      { label: "Solar" },
      { label: "Wind" },
      { label: "Nuclear" },
      { label: "Geothermal" },
      { label: "Hydrogen" },
      { label: "Battery Storage" },
      { label: "Coal" },
      { label: "Natural Gas Extraction" },
    ],
  },
  {
    label: "Social Infrastructure",
    subcategories: [
      { label: "Hospitals" },
      { label: "Specialized Clinics" },
      { label: "Elderly Care Facilities" },
      { label: "Public Housing" },
      { label: "Student Housing" },
      { label: "Medical Tourism" },
    ],
  },
  {
    label: "Frontier / Deep-Tech",
    subcategories: [
      { label: "Quantum Computing" },
      { label: "Space Launch" },
      { label: "Spaceports" },
      { label: "Advanced Manufacturing Hubs" },
      { label: "AI Training Centers" },
      { label: "Biotech Campus" },
      { label: "Proton & Heavy-Ion Therapy Centers" },
    ],
  },
  {
    label: "Water, Waste & Environmental",
    subcategories: [
      { label: "Desalination Plants" },
      { label: "Waste-to-Energy Plants" },
      { label: "Recycling Centers" },
      { label: "Waste Water Management" },
      { label: "Recycling" },
      { label: "Landfill" },
    ],
  },
];

export const emptyProjectsByCategory: Record<CategoryId, ListedProject[]> = {
  core: [],
  expansion: [],
  pipeline: [],
};

const isCategoryId = (value: string): value is CategoryId =>
  categoryIds.includes(value as CategoryId);

const isProjectListingStatus = (value: unknown): value is ProjectListingStatus =>
  value === "upcoming" || value === "active" || value === "finished";

const isIndexProjectStatus = (value: unknown): value is IndexProjectStatus =>
  isProjectListingStatus(value) || value === "unlisted";

const normalizeListedProject = (project: PartialListedProject): ListedProject => ({
  ...project,
  documents: Array.isArray(project.documents) ? project.documents : [],
});

const isIndexEntry = (
  value: unknown
): value is { id: string; category: CategoryId; status: IndexProjectStatus } => {
  if (!value || typeof value !== "object") return false;

  const entry = value as RawIndexEntry;

  return (
    typeof entry.id === "string" &&
    typeof entry.category === "string" &&
    isCategoryId(entry.category) &&
    isIndexProjectStatus(entry.status)
  );
};

const isIndexCommentEntry = (value: unknown): value is { _comment: string } => {
  if (!value || typeof value !== "object") return false;

  const entry = value as RawIndexEntry;
  return typeof entry._comment === "string";
};

const isVisibleIndexEntry = (
  entry: { id: string; category: CategoryId; status: IndexProjectStatus }
): entry is { id: string; category: CategoryId; status: ProjectListingStatus } =>
  isProjectListingStatus(entry.status);

const parseProjectFromFolder = (
  record: unknown,
  listingStatus: ProjectListingStatus
): ListedProject => {
  if (!record || typeof record !== "object") {
    throw new Error("Project file has invalid format.");
  }

  const projectRecord = record as RawProjectRecord;

  if (
    typeof projectRecord.id !== "string" ||
    typeof projectRecord.name !== "string" ||
    typeof projectRecord.country !== "string" ||
    typeof projectRecord.fundingRound !== "string" ||
    typeof projectRecord.completionDate !== "string" ||
    typeof projectRecord.totalFundraising !== "string" ||
    typeof projectRecord.ticketSize !== "string" ||
    typeof projectRecord.contractAddress !== "string" ||
    typeof projectRecord.assetSize !== "string" ||
    typeof projectRecord.sector !== "string" ||
    typeof projectRecord.subsector !== "string" ||
    !isCoreType(projectRecord.coreType) ||
    !Array.isArray(projectRecord.metrics) ||
    !Array.isArray(projectRecord.details) ||
    (projectRecord.documents !== undefined && !Array.isArray(projectRecord.documents)) ||
    !Array.isArray(projectRecord.gallery)
  ) {
    throw new Error("Project file is missing required fields.");
  }

  const normalizedTicketsLeft =
    typeof projectRecord.ticketsLeft === "number" && Number.isFinite(projectRecord.ticketsLeft)
      ? projectRecord.ticketsLeft
      : 0;

  const normalizedProject: PartialListedProject = {
    id: projectRecord.id,
    listingStatus,
    name: projectRecord.name,
    country: projectRecord.country,
    fundingRound: projectRecord.fundingRound,
    completionDate: projectRecord.completionDate,
    totalFundraising: projectRecord.totalFundraising,
    ticketSize: projectRecord.ticketSize,
    ticketsLeft: normalizedTicketsLeft,
    contractAddress: projectRecord.contractAddress,
    contractAuthorityChecksum:
      typeof projectRecord.contractAuthorityChecksum === "string"
        ? projectRecord.contractAuthorityChecksum
        : undefined,
    assetSize: projectRecord.assetSize,
    coreType: projectRecord.coreType,
    sector: projectRecord.sector,
    subsector: projectRecord.subsector,
    metrics: projectRecord.metrics as ProjectMetric[],
    details: projectRecord.details as ProjectInfo[],
    documents: (projectRecord.documents as ProjectDocument[] | undefined) ?? [],
    gallery: projectRecord.gallery as ProjectGalleryItem[],
  };

  return normalizeListedProject(normalizedProject);
};

export const loadProjectsFromFolders = async (): Promise<Record<CategoryId, ListedProject[]>> => {
  const projectsByCategory: Record<CategoryId, ListedProject[]> = {
    core: [],
    expansion: [],
    pipeline: [],
  };

  const indexResponse = await fetch("/projects/index.json", { cache: "no-store" });
  if (!indexResponse.ok) {
    throw new Error("Could not read projects index.");
  }

  const indexData: unknown = await indexResponse.json();
  if (!Array.isArray(indexData)) {
    throw new Error("Projects index has invalid format.");
  }

  const indexEntries = indexData.reduce<
    Array<{ id: string; category: CategoryId; status: IndexProjectStatus }>
  >((accumulator, entry) => {
    if (isIndexEntry(entry)) {
      accumulator.push(entry);
      return accumulator;
    }

    if (isIndexCommentEntry(entry)) {
      return accumulator;
    }

    throw new Error("Projects index has invalid format.");
  }, []);

  const visibleEntries = indexEntries.filter(isVisibleIndexEntry);

  const loadedProjects = await Promise.all(
    visibleEntries.map(async (entry) => {
      const projectResponse = await fetch(`/projects/${entry.id}/project.json`, { cache: "no-store" });
      if (!projectResponse.ok) {
        throw new Error(`Could not read project file for ${entry.id}.`);
      }

      const projectData: unknown = await projectResponse.json();
      const parsedProject = parseProjectFromFolder(projectData, entry.status);

      return {
        category: entry.category,
        project: {
          ...parsedProject,
          id: entry.id,
          listingStatus: entry.status,
        },
      };
    })
  );

  loadedProjects.forEach(({ category, project }) => {
    projectsByCategory[category].push(project);
  });

  return projectsByCategory;
};

