import type { MutableRefObject, RefObject } from "react";

import type { ListedProject } from "@/data/projectFilterSystem";

import type { OnchainProjectSnapshot } from "./projectSection.helpers";
import { saleStatusTextClass } from "./projectSection.helpers";

type ProjectCardStripProps = {
  visibleProjects: ListedProject[];
  selectedProjectId?: string;
  onchainProjectSnapshots: Record<string, OnchainProjectSnapshot>;
  projectBrowserRef: RefObject<HTMLDivElement | null>;
  projectCardRefs: MutableRefObject<Record<string, HTMLButtonElement | null>>;
  onSelectProject: (projectId: string) => void;
  labels: {
    country: string;
    fundingRound: string;
    completionDate: string;
    totalRaise: string;
    ticketSize: string;
    saleStatus: string;
    ticketsSold: string;
    ticketsLeft: string;
  };
};

export default function ProjectCardStrip({
  visibleProjects,
  selectedProjectId,
  onchainProjectSnapshots,
  projectBrowserRef,
  projectCardRefs,
  onSelectProject,
  labels,
}: ProjectCardStripProps) {
  if (visibleProjects.length === 0) {
    return null;
  }

  return (
    <div className="mb-10 overflow-x-auto pb-2">
      <div ref={projectBrowserRef} className="flex min-w-max gap-4">
        {visibleProjects.map((project) => {
          const isActive = project.id === selectedProjectId;
          const projectSnapshot = onchainProjectSnapshots[project.id];
          const cardSaleStatus = projectSnapshot?.saleStatus;
          const cardSaleStatusClass = saleStatusTextClass(cardSaleStatus);
          const ticketsSold = projectSnapshot?.ticketsSold;

          return (
            <button
              key={project.id}
              ref={(element) => {
                projectCardRefs.current[project.id] = element;
              }}
              type="button"
              onClick={() => onSelectProject(project.id)}
              className={`w-[min(84vw,310px)] shrink-0 border p-4 text-left transition sm:p-5 ${
                isActive
                  ? "border-white bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_38%),linear-gradient(135deg,_#1f1f1f,_#0a0a0a)] text-white"
                  : "border-white/20 bg-black text-white"
              }`}
            >
              <h3 className="mb-3 font-playfair text-xl font-bold">{project.name}</h3>
              <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-white/65">
                {project.coreType} • {project.sector} • {project.subsector}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span>{labels.country}</span>
                  <span>{project.country}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>{labels.fundingRound}</span>
                  <span>{project.fundingRound}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>{labels.completionDate}</span>
                  <span>{project.completionDate}</span>
                </div>   
               
                <div className="flex justify-between gap-4">
                  <span>{labels.totalRaise}</span>
                  <span>{project.totalFundraising}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>{labels.ticketSize}</span>
                  <span>{project.ticketSize}</span>
                </div>
                {cardSaleStatus ? (
                  <div className="flex justify-between gap-4">
                    <span>{labels.saleStatus}</span>
                    <span className={cardSaleStatusClass}>{cardSaleStatus}</span>
                  </div>
                ) : null}
                {typeof ticketsSold === "number" ? (
                  <div className="flex justify-between gap-4">
                    <span>{labels.ticketsSold}</span>
                    <span>{ticketsSold}</span>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <span>{labels.ticketsLeft}</span>
                  <span className={cardSaleStatusClass}> {project.ticketsLeft}</span>
                </div>
              
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
