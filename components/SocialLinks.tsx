import { socialLinks } from "@/lib/footer-links";
import LinkedInIcon from "./LinkedInIcon";
import YouTubeIcon from "./YouTubeIcon";

// Social profile logos for the footers. Links live in lib/footer-links.ts.
export default function SocialLinks({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  return (
    <ul className="flex items-center gap-2.5">
      {socialLinks.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${box} rounded-full border border-border flex items-center justify-center text-mid hover:text-ink hover:border-border-strong transition-colors`}
          >
            {link.icon === "youtube" ? <YouTubeIcon /> : <LinkedInIcon />}
            <span className="sr-only">{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
