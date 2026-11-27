import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, Youtube } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { SpotifyIcon } from "./SpotifyIcon";
import { PLACEHOLDERS, isPlaceholder } from "./site-links";

type Social = {
  key: string;
  label: string;
  Icon: ComponentType<{ size?: number }>;
  href?: string;
  /** Internal route, for links that stay within this site. */
  to?: string;
};

const SOCIALS: Social[] = [
  { key: "instagram", label: "Instagram", Icon: Instagram, href: PLACEHOLDERS.instagram },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin, href: PLACEHOLDERS.linkedin },
  {
    key: "email",
    label: "Email",
    Icon: Mail,
    href: isPlaceholder(PLACEHOLDERS.email) ? PLACEHOLDERS.email : `mailto:${PLACEHOLDERS.email}`,
  },
];

/** Shown only where `extra` is passed — currently just the link-in-bio page. */
const EXTRA_SOCIALS: Social[] = [
  { key: "youtube", label: "YouTube", Icon: Youtube, href: PLACEHOLDERS.youtube },
  { key: "spotify", label: "Spotify", Icon: SpotifyIcon, href: PLACEHOLDERS.spotify },
  // Hidden for now — uncomment to show the Website (globe) icon again.
  // { key: "website", label: "Website", Icon: Globe, href: SITE_URL },
];

export function SocialIcons({
  className,
  size = "md",
  bordered = true,
  extra = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  bordered?: boolean;
  /** Also show YouTube and Spotify icons. */
  extra?: boolean;
}) {
  const box = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const icon = size === "sm" ? 16 : size === "lg" ? 24 : 18;
  const styles = cn(
    "relative flex items-center justify-center rounded-full bg-background text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-champagne-soft hover:text-wine active:translate-y-0 active:scale-90 active:duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine",
    // "sm" renders under the 44px touch-target minimum — pad the tap area invisibly rather than growing the visible icon.
    size === "sm" && "after:absolute after:-inset-1.5 after:content-['']",
    bordered && "border border-ink/12 hover:border-wine",
  );
  const items = extra ? [...SOCIALS, ...EXTRA_SOCIALS] : SOCIALS;

  return (
    <ul className={cn("flex flex-wrap items-center justify-center gap-2.5", className)}>
      {items.map(({ key, label, Icon, href, to }) => {
        const pending = href ? isPlaceholder(href) : false;
        const title = pending ? `${label} — link coming soon` : label;

        return (
          <li key={key}>
            {to ? (
              <Link to={to} aria-label={label} title={label} className={cn(box, styles)}>
                <Icon size={icon} aria-hidden="true" />
              </Link>
            ) : pending ? (
              <button
                type="button"
                disabled
                aria-label={title}
                title={title}
                className={cn(box, styles, "cursor-not-allowed opacity-70")}
              >
                <Icon size={icon} aria-hidden="true" />
              </button>
            ) : (
              <a
                href={href}
                target={href?.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer noopener"
                aria-label={label}
                title={label}
                className={cn(box, styles)}
              >
                <Icon size={icon} aria-hidden="true" />
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
