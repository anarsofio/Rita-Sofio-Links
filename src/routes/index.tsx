import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Handshake, Heart, Mail, Rss, Sparkles } from "lucide-react";
import { ContactDrawer } from "@/components/site/ContactDrawer";
import { SocialIcons } from "@/components/site/SocialIcons";
import { LinkObjectCard, type LinkObjectSize } from "@/components/site/LinkObjectCard";
import profilePhoto from "@/assets/profile-photo.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rita Sofio — All My Links" },
      {
        name: "description",
        content:
          "AI workshops, Tech in Heels newsletter and podcast, partnerships, talks and more — all Rita Sofio links in one place.",
      },
      { property: "og:title", content: "Rita Sofio — All My Links" },
      {
        property: "og:description",
        content: "Workshops, Tech in Heels, partnerships and talks — all in one place.",
      },
    ],
  }),
  component: LinkInBio,
});

/**
 * The link system, in one place. Change an `href`, add or remove an
 * entry, or re-order this list — the composition below lays itself out
 * from `size`/`featured` automatically. No positioning to update by hand.
 */
const LINKS: {
  title: string;
  description: string;
  to?: string;
  hash?: string;
  href?: string;
  external?: boolean;
  Icon: typeof Sparkles;
  featured?: boolean;
  size: LinkObjectSize;
  /** Set to true to hide a card without deleting it. */
  hidden?: boolean;
  /** Opens the "Send a message" drawer instead of following a link. */
  opensContactDrawer?: boolean;
}[] = [
  {
    title: "Join AI Workshop",
    description: "Hands-on, live, and interactive",
    href: "https://ritasofio.vercel.app/workshop",
    Icon: Sparkles,
    featured: true,
    size: "featured",
  },
  {
    title: "Tech in Heels",
    description: "Newsletter & podcast",
    href: "https://ritasofio.vercel.app/tech-in-heels",
    Icon: Rss,
    size: "wide",
  },
  {
    title: "Partnerships & Talks",
    description: "Work with me",
    href: "https://ritasofio.vercel.app/partnerships-and-talks",
    Icon: Handshake,
    size: "wide",
  },
  {
    title: "Wall of Love",
    description: "What people say",
    href: "#", // TODO: destination to be provided
    Icon: Heart,
    size: "square",
    hidden: true,
  },
  {
    title: "Contact Me",
    description: "Let's talk",
    opensContactDrawer: true,
    Icon: Mail,
    size: "square",
  },
];

function LinkInBio() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl px-5 pt-12 pb-14 sm:pt-16">
        <header className="flex flex-col items-center text-center">
          <img
            src={profilePhoto}
            alt="Rita Sofio"
            width={128}
            height={128}
            className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
          />
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Rita Sofio
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">DigitalMindsStudio</p>
          <SocialIcons size="lg" className="mt-6" extra />
        </header>

        <nav aria-label="Main links" className="mt-10">
          <div className="grid grid-cols-2 gap-4 [grid-auto-flow:dense] md:grid-cols-4 md:gap-5">
            {LINKS.filter((link) => !link.hidden).map(
              ({ hidden: _hidden, opensContactDrawer, ...link }, index) => (
                <LinkObjectCard
                  key={link.title}
                  {...link}
                  onClick={opensContactDrawer ? () => setIsContactOpen(true) : undefined}
                  index={index}
                />
              ),
            )}
          </div>
        </nav>

        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            &copy;{new Date().getFullYear()} Rita Sofio
          </p>
        </footer>
      </div>

      <ContactDrawer open={isContactOpen} onOpenChange={setIsContactOpen} />
    </div>
  );
}
