# Lesson banner art

Drop an image at any path below and it becomes that lesson's banner
automatically — highest priority, ahead of the app's built-in animated
banners. No code change is needed; the mapping already lives in
`src/features/content/lessonLocalBanners.ts` (keyed by lesson id, so a
banner is identical in every UI language).

Animated `.gif` is preferred, but `.webp`, `.jpg`, `.jpeg`, `.png` and
`.avif` all work. **The extension is part of the mapped path**, so a `.jpg`
asset filed under a `.gif` mapping does not resolve and the lesson quietly
falls back — swap an asset for a different format and you must update the
matching entry in `lessonLocalBanners.ts` too.

If a file here is missing or fails to load, the lesson keeps its existing
built-in animated banner (and, as a final safety net, `default-history.gif`).
Recommended size: 840×360 (or any 21:9-ish ratio); the banner renders with
`object-fit: cover`.

`default-history.gif` — generic dark fallback (replace with real art if you like).

## Getting the art in

Art that has been landed is committed. The rest still lives only in Drive.
See what is outstanding at any time:

```sh
npm run banners:missing
```

### The build fetches it for you (recommended)

`npm run build` runs `scripts/prefetch_drive_banners.mjs` first (npm's
`prebuild` hook). Given a credential in the environment it pulls every
mapped banner the repo does not already carry, straight into `public/`,
before Vite copies that into `dist/`. Without a credential it prints the
missing list and does nothing else — **it can never fail a deploy**, because
a missing banner is already a handled case (the lesson falls back to its
built-in animated banner).

To turn it on for Netlify: **Site configuration → Environment variables →
Add a variable**, key `GOOGLE_API_KEY`, value a Google Cloud API key with
the **Google Drive API** enabled. Nothing else changes — no build command
edit, no plugin. The next deploy ships the full set.

**Scope it to every deploy context**, not just Production. A value set only
on Production is invisible to a branch deploy, and the step will report no
credential at all.

`DRIVE_API_KEY`, `DRIVEAPI_KEY` and `GOOGLE_DRIVE_API_KEY` are accepted as
aliases. The spelling is the easiest thing to get wrong and the cost used to
be silence.

### Checking whether it worked

Every build writes `banner-status.json` into the site, so open
**`https://<your-site>/banner-status.json`** — no build log needed:

```jsonc
{
  "ran": true,                       // false = no credential was found
  "credentialVariable": "GOOGLE_API_KEY",  // the NAME only, never the value
  "fetchedThisBuild": 47,
  "present": 104, "total": 104,
  "failures": [ { "file": "...", "reason": "HTTP 403 ..." } ]
}
```

`ran: false` means no credential reached the build — check the name and the
deploy-context scope. `ran: true` with `HTTP 403` failures means the key was
found but rejected: enable the Drive API on it, and confirm the folder is
shared "Anyone with the link → Viewer". `HTTP 400 API key not valid` means
the value itself is wrong. The file is redacted before it is written, so no
credential can appear in it.

An API key only reads files shared **Anyone with the link → Viewer**. As of
this writing:

| Drive folder | Sharing | API key works |
| --- | --- | --- |
| `Eras and Lessons Banner GIFs part 2` (48 files) | Anyone with the link → Viewer | yes |
| `Eras and Lessons Banner GIFs` (56 files) | owner only | no — but all 56 are already committed |

So a plain `GOOGLE_API_KEY` is enough to land everything that is currently
missing. If part 1 ever needs re-fetching, either open its link sharing to
match part 2, or use a token (below).

Set `SKIP_BANNER_FETCH=1` to disable the step for a build.

### Doing it by hand

```sh
# one folder, straight into place
npm run banners:fetch -- --source banners-part-2 --api-key "$GOOGLE_API_KEY"

# a private folder needs an OAuth access token with drive.readonly scope.
# It expires in ~1 hour, which makes it fine here and useless as a build
# variable. Revoke it when the drop is done.
npm run banners:fetch -- --token "$GOOGLE_OAUTH_TOKEN"
```

Or download the Drive folder as a ZIP by hand, unzip it, and run
`node scripts/place_drive_assets.mjs --src <unzipped-dir>`, which renames
each file to the path its lesson expects.

Every file id, byte size and destination is recorded in
`scripts/drive-assets.manifest.json`.

Neither credential is read from or written to the repo, and neither is ever
placed on a command line by the build step — it passes the environment
through, so nothing lands in a process listing or a build log.


## prehistoric/

- `prehistoric/origin-of-man.gif` — Human Origins (prehistoric-01)
- `prehistoric/mastery-of-fire.gif` — The Mastery of Fire (prehistoric-02)
- `prehistoric/neanderthals.gif` — Neanderthals and the Human Family (prehistoric-03)
- `prehistoric/great-human-migration.gif` — The Great Human Journey (prehistoric-04)
- `prehistoric/stone-age-tools.gif` — The Stone Age Toolkit (prehistoric-05)
- `prehistoric/cave-art.gif` — Cave Art and the Symbolic Mind (prehistoric-06)
- `prehistoric/ice-age-world.gif` — The Ice Age World (prehistoric-07)
- `prehistoric/neolithic-revolution.gif` — The Neolithic Revolution (prehistoric-08)
- `prehistoric/first-villages-monuments.gif` — The First Villages and Monuments (prehistoric-09)
- `prehistoric/settling-of-americas.png` — The Peopling of the Americas (prehistoric-10)
- `prehistoric/first-australians.gif` — The First Australians (prehistoric-11)
- `prehistoric/metal-from-stone.gif` — Metal from Stone (prehistoric-12)
- `prehistoric/temples-before-cities.gif` — Temples Before Cities (prehistoric-13)
- `prehistoric/beasts-of-burden.gif` — Beasts of Burden (prehistoric-14)
- `prehistoric/green-sahara.gif` — The Green Sahara (prehistoric-15)
- `prehistoric/before-writing.gif` — Before Writing, the Word (prehistoric-16)
- `prehistoric/otzi-ice-man.webp` — The Iceman's Secrets (prehistoric-17)  _(Drive: part 2)_
- `prehistoric/hidden-half.jpg` — The Hidden Half (prehistoric-18)
- `prehistoric/first-eastern-settlements.jpg` — The First Villages of the East (prehistoric-19)
- `prehistoric/edge-of-history.jpg` — On the Edge of History (prehistoric-20)
- `prehistoric/dinosaur-era.gif` — The Age of Dinosaurs (prehistoric-21)
- `prehistoric/ice-age-survival.gif` — The Ice Ages (prehistoric-22)

## ancient/

- `ancient/first-civilizations.gif` — The First Civilizations (ancient-01)
- `ancient/classical-greece.gif` — Classical Greece (ancient-02)
- `ancient/roman-republic-empire.gif` — The Roman Republic and Empire (ancient-03)
- `ancient/ancient-near-east.gif` — The Ancient East (ancient-04)
- `ancient/ancient-egypt.webp` — Ancient Egypt: Gods, Pharaohs, and the Afterlife (ancient-05)
- `ancient/phoenicians-sea-masters.gif` — The Phoenicians: Masters of the Sea (ancient-06)
- `ancient/ancient-macedonia-alexander.gif` — Ancient Macedonia: Alexander the Great (ancient-07)
- `ancient/hellenistic-world.gif` — The Hellenistic World (ancient-08)
- `ancient/achaemenid-persia.gif` — The Achaemenid Persian Empire (ancient-09)
- `ancient/ancient-india.gif` — Ancient India (ancient-10)
- `ancient/ancient-china.gif` — Ancient China (ancient-11)
- `ancient/people-of-the-book.gif` — The People of the Book (ancient-12)
- `ancient/song-of-troy.gif` — The Song of Troy (ancient-13)
- `ancient/kush-and-aksum.gif` — The Kingdoms of Kush and Aksum (ancient-14)
- `ancient/first-builders-americas.gif` — The First Americans Build (ancient-15)
- `ancient/andean-empires.gif` — Empires of the Andes (ancient-16)
- `ancient/glory-of-rome.jpg` — The Glory of Rome in Verse (ancient-17)
- `ancient/the-celts.webp` — The Celts (ancient-18)
- `ancient/measure-of-the-world.gif` — The Measure of the World (ancient-19)
- `ancient/silk-roads.gif` — The Silk Roads (ancient-20)
- `ancient/africa-before-rome.jpg` — Africa Before Rome (ancient-21)
- `ancient/olmecs-mesoamerica.gif` — The Olmec and Early Mesoamerica (ancient-22)

## byzantine/

- `byzantine/new-rome-constantinople.gif` — New Rome: The Founding of Constantinople (byzantine-01)
- `byzantine/justinian-theodora.jpg` — Justinian and Theodora (byzantine-02)
- `byzantine/empire-under-siege.webp` — The Empire Besieged (byzantine-03)
- `byzantine/iconoclasm.gif` — Iconoclasm: The War over Holy Images (byzantine-04)
- `byzantine/cyril-methodius.png` — Cyril and Methodius: Alphabets for the Slavs (byzantine-05)
- `byzantine/great-schism-1054.jpg` — The Great Schism of 1054 (byzantine-06)
- `byzantine/byzantine-golden-age.gif` — Golden Age and Betrayal (byzantine-07)
- `byzantine/mount-athos.gif` — Mount Athos and the Orthodox Soul (byzantine-08)
- `byzantine/fall-of-constantinople.jpg` — 1453: The Fall of Constantinople (byzantine-09)
- `byzantine/roman-law-justice.png` — The Justice of Rome (byzantine-10)
- `byzantine/scholars-second-rome.webp` — Scholars of the Second Rome (byzantine-11)
- `byzantine/golden-bezant.gif` — The Golden Bezant (byzantine-12)
- `byzantine/life-in-constantinople.gif` — Life in the Queen of Cities (byzantine-13)
- `byzantine/baptism-of-rus.jpg` — The Baptism of the Rus (byzantine-14)
- `byzantine/empresses-of-byzantium.jpg` — The Empresses of Byzantium (byzantine-15)
- `byzantine/last-byzantine-recovery.jpg` — The Last Great Recovery (byzantine-16)
- `byzantine/windows-to-heaven.jpg` — Windows into Heaven (byzantine-17)
- `byzantine/crescent-and-cross.webp` — The Crescent and the Cross (byzantine-18)
- `byzantine/empire-in-exile.gif` — Empire in Exile (byzantine-19)
- `byzantine/empire-that-never-dies.webp` — The Immortal Empire (byzantine-20)
- `byzantine/macedonian-renaissance.webp` — The Macedonian Renaissance (byzantine-21)
- `byzantine/heirs-of-constantinople.jpg` — Heirs of Constantinople (byzantine-22)

## middle-ages/

- `middle-ages/fall-of-rome.jpg` — The Fall of Rome and Early Middle Ages (medieval-01)  _(Drive: part 2)_
- `middle-ages/crusades-islamic-golden-age.gif` — The Crusades and the Islamic Golden Age (medieval-02)
- `middle-ages/black-plague.gif` — The Black Death and Late Medieval Crisis (medieval-03)
- `middle-ages/medieval-economy-guilds.jpg` — Medieval Economy: Trade Guilds and the Rise of Towns (medieval-04)  _(Drive: part 2)_
- `middle-ages/mongol-empire.gif` — The Mongol Empire (medieval-05)
- `middle-ages/feudal-japan-samurai.gif` — Medieval Japan: Samurai, Shoguns and Bushidō (medieval-06)
- `middle-ages/viking-era.gif` — The Viking Age (medieval-07)
- `middle-ages/al-andalus-reconquista.gif` — Al-Andalus and the Reconquista (medieval-08)
- `middle-ages/hundred-years-war.jpg` — The Hundred Years' War (medieval-09)  _(Drive: part 2)_
- `middle-ages/charlemagne.jpg` — Charlemagne (medieval-10)  _(Drive: part 2)_
- `middle-ages/feudal-manor.jpg` — The World of the Manor (medieval-11)  _(Drive: part 2)_
- `middle-ages/age-of-faith.webp` — The Age of Faith (medieval-12)  _(Drive: part 2)_
- `middle-ages/cathedrals-universities.gif` — Cathedrals and Universities (medieval-13)  _(Drive: part 2)_
- `middle-ages/medieval-poets.jpeg` — The Poets of the Middle Ages (medieval-14)  _(Drive: part 2)_
- `middle-ages/gold-of-mali.gif` — The Gold of Mali (medieval-15)  _(Drive: part 2)_
- `middle-ages/after-golden-age.avif` — After the Golden Age (medieval-16)  _(Drive: part 2)_
- `middle-ages/sultans-and-temples.gif` — Sultans and Temples (medieval-17)  _(Drive: part 2)_
- `middle-ages/rise-of-moscow.jpg` — Rus and the Rise of Moscow (medieval-18)  _(Drive: part 2)_
- `middle-ages/song-dynasty.gif` — The Middle Kingdom's Golden Age (medieval-19)  _(Drive: part 2)_
- `middle-ages/women-of-middle-ages.gif` — The Women of the Middle Ages (medieval-20)  _(Drive: part 2)_
- `middle-ages/great-zimbabwe.jpg` — Great Zimbabwe and the Swahili Coast (medieval-21)  _(Drive: part 2)_
- `middle-ages/khmer-empire-angkor.gif` — The Khmer Empire and Angkor (medieval-22)  _(Drive: part 2)_

## early-modern/

- `early-modern/renaissance-discovery.gif` — The Renaissance and Age of Exploration (earlymod-01)
- `early-modern/protestant-reformation.jpg` — The Protestant Reformation (earlymod-02)  _(Drive: part 2)_
- `early-modern/scientific-revolution.gif` — Scientific Revolution and Enlightenment (earlymod-03)
- `early-modern/louis-xiv-versailles.gif` — The Age of Absolutism: Louis XIV and Versailles (earlymod-04)
- `early-modern/transatlantic-slave-trade.gif` — The Transatlantic Slave Trade (earlymod-05)
- `early-modern/suleiman-the-magnificent.gif` — The Ottoman Empire: Suleiman the Magnificent (earlymod-06)
- `early-modern/age-of-revolutions.gif` — The Age of Revolution (earlymod-07)
- `early-modern/mughal-empire.png` — The Mughal Empire (earlymod-08)  _(Drive: part 2)_
- `early-modern/tokugawa-japan.gif` — Tokugawa Japan: The Closed Country (earlymod-09)
- `early-modern/two-worlds-met.jpg` — Two Worlds Collide (earlymod-10)  _(Drive: part 2)_
- `early-modern/age-of-merchants.jpg` — The Golden Age of Merchants (earlymod-11)  _(Drive: part 2)_
- `early-modern/printing-press-unbound.webp` — The Word Unbound (earlymod-12)  _(Drive: part 2)_
- `early-modern/wars-of-religion.jpg` — The Wars of Religion (earlymod-13)  _(Drive: part 2)_
- `early-modern/treasure-fleets.jpg` — The Treasure Fleets (earlymod-14)  _(Drive: part 2)_
- `early-modern/safavid-persia.png` — The Shah's Persia (earlymod-15)  _(Drive: part 2)_
- `early-modern/king-and-parliament.jpg` — The King and Parliament (earlymod-16)  _(Drive: part 2)_
- `early-modern/age-of-splendor.gif` — The Age of Splendor (earlymod-17)  _(Drive: part 2)_
- `early-modern/little-ice-age.gif` — Fear and the Frozen Years (earlymod-18)  _(Drive: part 2)_
- `early-modern/peter-the-great.webp` — Peter the Great (earlymod-19)  _(Drive: part 2)_
- `early-modern/radical-enlightenment.png` — The Radical Enlightenment (earlymod-20)  _(Drive: part 2)_
- `early-modern/songhai-empire.webp` — The Songhai Empire (earlymod-21)  _(Drive: part 2)_
- `early-modern/voyagers-pacific.jpg` — Voyagers of the Pacific (earlymod-22)  _(Drive: part 2)_

## modern/

- `modern/industrial-revolution.gif` — The Industrial Revolution (modern-01)
- `modern/world-wars.gif` — The World Wars (modern-02)
- `modern/cold-war-decolonization.gif` — The Cold War and Decolonization (modern-03)
- `modern/globalization.gif` — Globalization and the Contemporary World (modern-04)
- `modern/scramble-for-africa.gif` — The Age of Imperialism and the Scramble for Africa (modern-05)
- `modern/yugoslav-wars.gif` — The Yugoslav Wars (modern-06)
- `modern/macedonian-struggle.gif` — The Macedonian Struggle (modern-07)
- `modern/russian-revolution.gif` — The Russian Revolution and the Soviet Century (modern-08)  _(Drive: part 2)_
- `modern/gandhi-independence.gif` — Gandhi and Indian Independence (modern-09)  _(Drive: part 2)_
- `modern/modern-revolutions.gif` — The Age of Revolutions (modern-10)  _(Drive: part 2)_
- `modern/birth-of-nations.jpg` — The Birth of Nations (modern-11)  _(Drive: part 2)_
- `modern/modern-literature.gif` — The Novel and the Modern Soul (modern-12)  _(Drive: part 2)_
- `modern/broken-chains.gif` — The Chains Broken (modern-13)  _(Drive: part 2)_
- `modern/rising-sun-japan.webp` — The Rising Sun (modern-14)  _(Drive: part 2)_
- `modern/collapse-and-disaster.gif` — Collapse and Catastrophe (modern-15)  _(Drive: part 2)_
- `modern/age-of-genocide.gif` — The Age of Genocide (modern-16)  _(Drive: part 2)_
- `modern/china-reborn.gif` — China Reborn (modern-17)  _(Drive: part 2)_
- `modern/rights-revolutions.gif` — The Rights Revolutions (modern-18)  _(Drive: part 2)_
- `modern/modern-middle-east.gif` — The Cauldron of the Modern Middle East (modern-19)  _(Drive: part 2)_
- `modern/connected-world.gif` — The Connected World (modern-20)  _(Drive: part 2)_
- `modern/space-age.gif` — The Space Age (modern-21)  _(Drive: part 2)_
- `modern/conquering-diseases.gif` — The Conquest of Disease (modern-22)  _(Drive: part 2)_
- `modern/world-wars-part-2.gif` — The World Wars, Part II (modern-23)  _(Drive: part 2)_
