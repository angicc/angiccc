# Era backdrops

Artwork shown behind each era on the landing-page timeline. Drop files in here
under exactly these names — `src/features/content/eraBackdrops.ts` maps each
era to one of them.

| File                | Era                 | Status without the file |
|---------------------|---------------------|-------------------------|
| `prehistoric.gif`   | Prehistoric Ages    | no artwork              |
| `ancient.gif`       | Ancient World       | falls back to Giphy     |
| `byzantine.gif`     | The Byzantine World | no artwork              |
| `middle-ages.gif`   | Middle Ages         | no artwork              |
| `early-modern.jpg`  | Early Modern        | no artwork              |
| `modern.gif`        | Modern Era          | falls back to Giphy     |

Nothing here is required. An era with no file and no fallback renders the plain
timeline entry it had before, so these can be added one at a time.

Keep them under ~4 MB each. They load on the landing page, which is the first
thing a new visitor waits for, and they are decorative — a darkened, masked
panel behind the era name. Detail that survives that treatment is coarse
detail, so a smaller file loses nothing.

Rendering is skipped entirely for visitors whose system asks for reduced
motion, so animated frames are safe to use here.
