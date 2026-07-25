# Leena Sharma Library

A responsive, dependency-free prototype for a personal library: writing, opinions, media diaries, art, work memories and life chapters. It is deliberately designed **not** to read like a conventional portfolio.

## Open it

Open `index.html` directly in a browser, or serve the folder locally:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Edit the content

Almost all catalogue content lives in `content.js`.

- Add, remove or reorder cards in `libraryData.items`.
- Set `featured: true` on up to four records to place them in “Recently catalogued.”
- Use `starter: true` for draft/demo entries. The interface labels these honestly.
- Replace placeholder social links in `index.html`.
- Replace the `NOW` note and biography directly in `index.html`.

Each item supports:

```js
{
  id: "unique-slug",
  shelf: "writing", // writing | watched | listening | made | chapters
  type: "Essay",
  title: "Title",
  excerpt: "One-sentence summary",
  meta: "5 min read",
  date: "25 July 2026",
  tags: ["culture", "film"],
  visual: "type-red",
  featured: true,
  starter: false,
  image: "assets/optional-cover.svg",
  body: ["Paragraph one.", "Paragraph two."]
}
```

## Replace prototype art

The four SVG covers in `assets/` are original placeholders made for this prototype. Swap them for Leena’s own photographs, scans, stills or artwork while keeping the same filenames, or update their paths in `index.html` and `content.js`.

## Deploy

Because this is a static site, the folder can be deployed without a build step to GitHub Pages, Netlify, Cloudflare Pages or Vercel.

## Recommended next content pass

1. Add the latest 3 real posts: one blog, one LinkedIn post and one Instagram post.
2. Add five recent films and three podcast episodes using the same catalogue-card format.
3. Replace the four project covers with actual stills or personal artwork.
4. Rewrite the starter essays in Leena’s voice.
5. Add a lightweight CMS only after the content rhythm feels right.
