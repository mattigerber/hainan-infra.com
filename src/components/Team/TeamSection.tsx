"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  linkedinUrl?: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "matti",
    name: "Matti Gerber",
    role: "Managing Director Global",
    linkedinUrl: "https://www.linkedin.com/in/matti-gerber/",
  },
  {
    id: "dean",
    name: "Dean Zhang",
    role: "Managing Director China",
    linkedinUrl: "https://www.linkedin.com/in/dean-zhang-张耕源-4819229b/",
  },
  {
    id: "ertugrul",
    name: "Ertugrul Kücükkaya",
    role: "IT Intern",
    linkedinUrl: "https://www.linkedin.com/in/ertugrulkucukkaya/",
  },
];

const LINKEDIN_ICON_PATH = "/socials/LINKEDIN.svg";

export default function TeamSection() {
  const { t, locale } = useI18n();
  const headingAlignmentClass = locale === "ar" ? "text-right" : "text-left";
  const [teamImageMap, setTeamImageMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    const loadTeamImageMap = async () => {
      const fetchCandidates = ["/team/index.json", "/api/team-images"];

      for (const candidate of fetchCandidates) {
        try {
          const response = await fetch(candidate, { cache: "no-store" });
          if (!response.ok) {
            continue;
          }

          const payload = (await response.json()) as { images?: Record<string, string> };
          if (!cancelled && payload.images && typeof payload.images === "object") {
            setTeamImageMap(payload.images);
            return;
          }
        } catch {
          // Try next source.
        }
      }
    };

    void loadTeamImageMap();

    return () => {
      cancelled = true;
    };
  }, []);

  const membersWithResolvedImage = useMemo(
    () => TEAM_MEMBERS.map((member) => ({ ...member, imagePath: teamImageMap[member.id] ?? null })),
    [teamImageMap]
  );

  return (
    <section className="bg-black px-8 pb-16 pt-10 text-white sm:px-6 md:px-10 md:pt-14">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[90rem]">
        <div className={`mb-8 ${headingAlignmentClass}`}>
          <div className="mb-3 text-sm uppercase tracking-[0.22em] text-white/60">
            {t("team.section.label")}
          </div>
          <h2 className="font-playfair text-3xl uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
            {t("team.section.title")}
          </h2>
        </div>

        <div className="grid items-stretch gap-5 md:grid-cols-3 md:gap-6">
          {membersWithResolvedImage.map((member) => (
            <article
              key={member.id}
              className="group flex h-full flex-col border border-white/15 bg-white/[0.03] p-4 sm:p-5"
            >
              <div className="relative h-[20rem] w-full overflow-hidden bg-black/40 sm:h-[22rem] md:h-[24rem] lg:h-[26rem]">
                {member.imagePath ? (
                  <Image
                    src={member.imagePath}
                    alt={member.name}
                    fill
                    className="h-full w-full object-contain object-center"
                    sizes="(max-width: 768px) 92vw, (max-width: 1200px) 31vw, 29vw"
                  />
                ) : (
                  <div className="h-full w-full bg-black/30" aria-hidden="true" />
                )}
              </div>

              <div className="mt-4 flex flex-1 items-start justify-between gap-3">
                <div>
                  <h3 className="font-playfair text-xl text-white md:text-2xl">{member.name}</h3>
                  <p className="mt-1 text-m uppercase tracking-[0.1em] text-white/60">{member.role}</p>
                </div>

                {member.linkedinUrl ? (
                  <Link
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("team.openLinkedIn", { name: member.name })}
                    className="inline-flex h-11 w-11 items-center justify-center text-white/70 transition hover:text-white"
                  >
                    <Image
                      src={LINKEDIN_ICON_PATH}
                      alt="LinkdIn icon takes you to the team member's LinkedIn profile"
                      width={32}
                      height={32}
                      aria-hidden="true"
                      className="h-36 w-36 object-contain brightness-0 invert"
                    />
                  </Link>
                ) : (
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 items-center justify-center text-white/20"
                  >
                    <Image
                      src={LINKEDIN_ICON_PATH}
                      alt="LinkdIn icon takes you to the team member's LinkedIn profile"
                      width={32}
                      height={32}
                      aria-hidden="true"
                      className="h-36 w-36 object-contain brightness-0 invert opacity-30"
                    />
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
