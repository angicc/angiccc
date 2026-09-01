// ─── Era backdrops ────────────────────────────────────────────────────────────
// Decorative artwork sitting behind each era on the landing-page timeline.
//
// Each era prefers a file in `public/assets/eras/`. `remote` is a fallback used
// only while that file is absent, so dropping the file in silently takes over.
//
// Why local-first rather than simply linking the six sources:
//
//  - Two of them were Pinterest and Tenor page URLs. Neither exposes a stable
//    media URL, and both block hotlinking.
//  - Two more are small academic sites (deremilitari.org, crrs.ca). Serving
//    this app's landing-page traffic from their servers is not something they
//    agreed to.
//  - A landing page that renders correctly only while six unrelated third
//    parties keep their URLs alive is not a landing page that renders
//    correctly.
//
// Giphy is the exception: it hosts media expressly for embedding, and the app
// already relies on it in five places (the login, logout and loading screens,
// the philosopher debate, and Clio's portrait). So the two Giphy sources are
// wired up directly and work now; the other four wait on a file.

export interface EraBackdrop {
  /** Preferred: served from `public/`, so it cannot break. */
  local: string;
  /** Used only until `local` exists. Omitted where hotlinking would fail. */
  remote?: string;
}

export const ERA_BACKDROPS: Record<string, EraBackdrop> = {
  prehistoric: {
    local: '/assets/eras/prehistoric.gif',
  },
  ancient: {
    local: '/assets/eras/ancient.gif',
    remote: 'https://media.giphy.com/media/hXv4LngASTk8o/giphy.gif',
  },
  byzantine: {
    local: '/assets/eras/byzantine.gif',
  },
  'middle-ages': {
    local: '/assets/eras/middle-ages.gif',
  },
  'early-modern': {
    local: '/assets/eras/early-modern.jpg',
  },
  modern: {
    local: '/assets/eras/modern.gif',
    remote: 'https://media.giphy.com/media/SvRIOIvQA2fqpZ5b4P/giphy.gif',
  },
};

/** The paths the build-time asset audit should watch. */
export const ERA_BACKDROP_PATHS: Record<string, string> =
  Object.fromEntries(Object.entries(ERA_BACKDROPS).map(([k, v]) => [k, v.local]));
