import type { CoreType } from "@/data/projectFilterSystem";

type OptionCount = { option: string; count: number };

type ProjectFilterControlsProps = {
  selectedCore: CoreType | null;
  selectedSector: string | null;
  selectedSubsector: string | null;
  coreOptionCounts: OptionCount[];
  sectorOptionCounts: OptionCount[];
  subsectorOptionCounts: OptionCount[];
  labels: {
    core: string;
    sector: string;
    subsector: string;
    noOptions: string;
  };
  onSelectCore: (core: CoreType) => void;
  onClearCore: () => void;
  onSelectSector: (sector: string) => void;
  onClearSector: () => void;
  onSelectSubsector: (subsector: string) => void;
  onClearSubsector: () => void;
};

const renderFilterOptions = ({
  label,
  options,
  noOptionsLabel,
  onSelect,
}: {
  label: string;
  options: OptionCount[];
  noOptionsLabel: string;
  onSelect: (option: string) => void;
}) => (
  <div className="flex flex-col gap-2">
    <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-white/60">{label}</span>
    <div className="flex min-h-[40px] items-center gap-2 overflow-x-auto pb-1">
      {options.map(({ option, count }) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className="shrink-0 border border-white/35 bg-black px-3 py-1.5 text-sm text-white transition hover:border-white"
        >
          {option} ({count})
        </button>
      ))}
      {options.length === 0 && <span className="shrink-0 text-xs text-white/45">{noOptionsLabel}</span>}
    </div>
  </div>
);

const renderPinnedFilter = ({
  label,
  value,
  onClear,
}: {
  label: string;
  value: string;
  onClear: () => void;
}) => (
  <div className="flex flex-col gap-2">
    <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-white/60">{label}</span>
    <button
      type="button"
      onClick={onClear}
      className="inline-flex min-h-[40px] w-auto self-start shrink-0 border border-white bg-white px-3 py-1.5 text-sm text-black transition hover:bg-white/90"
    >
      {value} x
    </button>
  </div>
);

export default function ProjectFilterControls({
  selectedCore,
  selectedSector,
  selectedSubsector,
  coreOptionCounts,
  sectorOptionCounts,
  subsectorOptionCounts,
  labels,
  onSelectCore,
  onClearCore,
  onSelectSector,
  onClearSector,
  onSelectSubsector,
  onClearSubsector,
}: ProjectFilterControlsProps) {
  return (
    <div className="mb-6 overflow-x-auto font-[var(--font-eb-garamond)]">
      <div className="flex min-h-[88px] min-w-max items-start gap-3 sm:gap-4">
        {!selectedCore
          ? renderFilterOptions({
              label: labels.core,
              options: coreOptionCounts,
              noOptionsLabel: labels.noOptions,
              onSelect: (option) => onSelectCore(option as CoreType),
            })
          : renderPinnedFilter({
              label: labels.core,
              value: selectedCore,
              onClear: onClearCore,
            })}

        {selectedCore && <span className="px-1 pt-5 text-xl font-semibold leading-none text-white/45">/</span>}

        {selectedCore &&
          (!selectedSector
            ? renderFilterOptions({
                label: labels.sector,
                options: sectorOptionCounts,
                noOptionsLabel: labels.noOptions,
                onSelect: onSelectSector,
              })
            : renderPinnedFilter({
                label: labels.sector,
                value: selectedSector,
                onClear: onClearSector,
              }))}

        {selectedCore && selectedSector && (
          <span className="px-1 pt-5 text-xl font-semibold leading-none text-white/45">/</span>
        )}

        {selectedCore && selectedSector &&
          (!selectedSubsector
            ? renderFilterOptions({
                label: labels.subsector,
                options: subsectorOptionCounts,
                noOptionsLabel: labels.noOptions,
                onSelect: onSelectSubsector,
              })
            : renderPinnedFilter({
                label: labels.subsector,
                value: selectedSubsector,
                onClear: onClearSubsector,
              }))}
      </div>
    </div>
  );
}
