# Leena Sharma portfolio

A dependency-free, multi-page personal portfolio based on a hand-drawn notebook layout.

## Pages

- `index.html`: ruled-paper home index
- `about.html`: biography and life notes
- `writings.html`: expandable essays and notebook fragments
- `photography.html`: responsive photo layout with an accessible lightbox

## Preview locally

Run the included PowerShell server:

```powershell
.\local-server.ps1
```

Then open `http://localhost:4173/`.

## Content to connect

The X, Instagram, and LinkedIn links on the home page intentionally show a friendly placeholder message until Leena's profile URLs are supplied.

The three JPGs in `assets/` are generated editorial placeholders. Replace them with Leena's own work while keeping the filenames, or update the paths in `about.html` and `photography.html`.

## Design tokens

The main tokens live at the top of `styles.css`:

- Headings: Times New Roman in indigo
- Body: Courier New typewriter stack in brown
- Background: light paper with horizontal blue rules and a red margin rule
- Shape system: sharp corners throughout

No build step or package install is required.
