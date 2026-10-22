import Image from "next/image";
import LinkedInIcon from "@/components/LinkedInIcon";
import { getGuideTeam } from "@/lib/team";

// "Who we are" block on each blog guide. Profiles and per-guide bios live in lib/team.ts,
// so adding a team member there makes a new card appear here automatically.
export default function WhoWeAre({ slug }: { slug: string }) {
  const team = getGuideTeam(slug);
  if (team.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="who-we-are">
      <h2 id="who-we-are" className="font-serif text-[22px] md:text-[26px] text-ink font-normal mb-5">
        Who we are
      </h2>
      <div className="space-y-4">
        {team.map((person) => (
          <div
            key={person.name}
            className="border border-border rounded-[20px] px-6 md:px-10 py-7 md:py-9 flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-8"
          >
            <Image
              src={person.photo}
              alt={`Photo of ${person.name}`}
              width={144}
              height={144}
              className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-[17px] md:text-[18px] font-medium text-ink mb-2">{person.name}</h3>
              <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.7] mb-4">
                {person.bio}
              </p>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] md:text-[15px] font-medium text-accent-dark hover:opacity-80 transition-opacity"
              >
                <LinkedInIcon size={18} />
                View {person.name}&apos;s LinkedIn profile
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
