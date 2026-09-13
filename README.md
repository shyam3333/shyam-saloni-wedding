# Shyam & Saloni — Wedding Invitation Website

A single-page, mobile-first wedding invitation site: animated wax-seal
cover, countdown timer, a tap-to-advance photo carousel, venue map, four
ceremony cards (each with a real photo background), and a footer with
RSVP/host/family details.

Everything is edited from one file — see [Editing content](#editing-content)
below.

## Project structure

```
shadiCard/
├─ index.html              All page sections/markup
├─ css/style.css           All styling, colors, animations
├─ js/config.js            ← EDIT THIS for all text/dates/venue/etc.
├─ js/script.js            Behaviour (countdown, reveal animations, carousel, audio)
├─ assets/audio/           Put music.mp3 here (see its README.md)
├─ assets/images/gallery/  Photos for the "Our Beautiful Moments" carousel
├─ assets/images/ceremonies/  Background photos for the ceremony cards
└─ README.md               This file
```

## Run it locally

You need a tiny local web server (not just double-clicking the HTML file),
because the Google Maps embed needs to load over `http://` rather than
`file://`. Pick ONE of these (both work, use whichever you have):

**Option A — Node (already installed on this machine):**
```bash
npx serve .
```
Then open the URL it prints (usually `http://localhost:3000`).

**Option B — Python (already installed on this machine):**
```bash
python -m http.server 5500
```
Then open `http://localhost:5500` in your browser.

Stop either server with `Ctrl+C` in the terminal when you're done.

### Checking it on your phone

While the local server is running, find your computer's local IP address
(e.g. `192.168.1.23`) and open `http://192.168.1.23:5500` (or `:3000` for
the Node option) on your phone, as long as both devices are on the same
Wi-Fi network. That's the easiest way to test the real mobile feel before
deploying anywhere.

## Editing content

Open **`js/config.js`** — every piece of text (names, family names, dates,
venue, ceremony schedule, footer/RSVP details) lives there as a single
object with comments explaining each field. Change the values between the
quotes, save, and refresh the browser.

A few specific things to know:

1. **Wedding date / countdown** — `weddingDate` must stay in the
   `"YYYY-MM-DDTHH:MM:SS"` format; everything else is free text.
2. **Venue map** — the map and "Get Directions" button are generated from
   `venue.mapQuery` (precise `"lat,lng"`) and `venue.directionsUrl` (the
   exact Google Maps place link), falling back to `venue.address` if those
   aren't set.
3. **Ceremony cards** — each entry in `ceremonies` can either show a photo
   background (`bgImage` set — like all four currently do) with the details
   overlaid on top, or fall back to a decorative gradient + animated icon
   if `bgImage` is left out. For a photo card:
   - `darkText: true` if the photo's open space is light/pale (so the text
     needs dark ink); leave it off for a dark/night photo (white text).
   - `textTop: "X%"` positions the text block that far down the card —
     tune this per photo so it lands in the photo's empty space.
   - `schedule: [{ label, time }, ...]` shows a list of sub-events instead
     of a single `time` line (used by Pheras and Barat & Reception).
4. **Photos** — "Our Beautiful Moments" is a tap-to-advance photo carousel
   driven by `gallery` (each item is `{ caption, img }`, in display order).
   Drop image files in `assets/images/gallery/` and point `img` at them.
   Ceremony background photos live in `assets/images/ceremonies/` the same
   way. HEIC photos (common on iPhone) need converting to JPG/PNG first,
   since most browsers can't display HEIC directly.
5. **Footer** — `footer` has four blocks: `rsvp` (names + mobile numbers),
   `awaitingEyes` (a list of names), `compliments` (freeform lines, not
   necessarily a name list), and `invitation` (the hosting couple's name,
   address lines, and mobile numbers).
6. **Background music** — see `assets/audio/README.md` for where to get a
   free, legal track and what to name the file.

## Design notes

- Built mobile-first: on a phone it fills the screen edge-to-edge; on a
  desktop/tablet browser it renders as a centered "invitation card", so it
  looks intentional on any screen size.
- Decorative motifs (Ganesh line-art, floral corners, ceremony avatar
  icons) are original SVG/CSS, not traced from any reference — this keeps
  everything free of licensing concerns.
- No build step, no dependencies to install — just the local server for
  testing. It can be deployed as-is to any static host (Netlify, Vercel,
  GitHub Pages, etc.) whenever you're ready to share the link.

## Next steps once you're happy with it

- Say the word and I can help deploy it to a free hosting service so you
  get a shareable link.
