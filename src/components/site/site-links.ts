/** Placeholder URLs are wrapped in [BRACKETS] until the real value is provided. */
export const isPlaceholder = (value: string) => value.trim().startsWith("[");

/** Main DigitalMindsStudio website (where the other pages live). */
export const SITE_URL = "https://digitalmindsstudio.vercel.app";

/** Real destinations for the social icons. */
export const PLACEHOLDERS = {
  email: "ritasofiodigitalmindsstudio@gmail.com",
  instagram: "https://www.instagram.com/ritasofio.digitalminds/",
  linkedin: "https://www.linkedin.com/in/rita-sofio-613925154/",
  youtube: "https://www.youtube.com/@Tech_In_Heels",
  spotify: "https://open.spotify.com/show/0rc7q9n0ZEvEYZXZWkb4JW",
} as const;
