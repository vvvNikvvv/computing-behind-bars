# Computing Behind Bars

**Live site:** https://vvvnikvvv.github.io/computing-behind-bars

Computing Behind Bars is a public, interactive map of documented computing education programs in U.S. prisons: courses, certificates, and degree pathways, each linked to its sources. Users can filter programs by program type, whether the credential is in a computing field, partner type, state, and verification status. The site also has pages on history, context and research, and our methodology and sources.

It complements the Alliance for Higher Education in Prison's National Directory by adding computing-specific classifications.

## Course staff contact

Nik Virrey, nvirrey@ucsd.edu. This person will reply within 24 hours through Friday of finals week.

## Viewing the site

**Option 1 (easiest):** open the live site link above.

**Option 2 (run it locally):** you need Python 3 (`python3 --version` to check).

```bash
git clone [TODO: repo URL]
cd [TODO: repo folder name]
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a browser. Press `Ctrl+C` in the terminal to stop the server.

> Opening `index.html` directly as a file (double-clicking it) will not load the map, because browsers block reading the data files from `file://` URLs. Use one of the options above.

There is nothing to install or build. The site is plain HTML, CSS, and JavaScript. [Leaflet](https://leafletjs.com) 1.9.4 is included in `vendor/`.

## Project structure

```
index.html          Home
map.html            Interactive map, filters, and table
history.html        Timeline
context.html        Context and research
programs.html       Featured program profiles
sources.html        Methodology, limitations, resource list (from data/sources.csv)
data/programs.csv   Program dataset (one row per program)
data/sources.csv    Resource list
data/us-states.geojson  U.S. state outlines for the base map (U.S. Census Bureau via us-atlas, ISC license)
docs/data-dictionary.md   Column definitions and allowed values
js/site.js          Shared header and footer (maintenance note and AI disclosure live here)
js/map.js           Map, filters, and table
js/csv.js           CSV loader
js/sources.js       Renders the resource list
css/style.css       Styles
vendor/leaflet/     Leaflet map library (BSD-2-Clause)
```

## Adding or updating a program

1. Add a row to `data/programs.csv` following `docs/data-dictionary.md`.
2. Add its source to `data/sources.csv`.
3. Run the site locally and check that the marker appears and the popup is correct.
4. Update `lastUpdated` in `js/site.js`, then commit.

## Deploying to GitHub Pages

Go to the repo's Settings → Pages, set Source to "Deploy from a branch," and choose branch `main` and folder `/ (root)`. The site goes live at `https://USERNAME.github.io/REPO/` within a few minutes.

## Resource list

The full resource list is on the live site at **Sources & Methodology** and in [`data/sources.csv`](data/sources.csv).

## Maintenance

- **Last updated:** [TODO: date]
- **Future updates:** [TODO: will the team keep updating this site? Who?]
- **Contact:** [TODO: name, email]

## AI disclosure

AI tools (Claude, by Anthropic) were used to help write code and edit text for this project. All program data and sources were found and verified by the team. Copies of our AI conversations are in [TODO: location, e.g. `docs/ai-conversations/`].

## Team

Barry
Henry
Pasha
Nik
Zachary

## Before final submission

- [ ] All `example` rows deleted from `data/programs.csv` and `data/sources.csv`
- [ ] No `[TODO` left anywhere: run `grep -rn "TODO" --include=*.html --include=*.js --include=*.md .`
- [ ] At least 10 sources in `data/sources.csv`
- [ ] Contact, maintenance, and AI disclosure filled in, both here and in `js/site.js`
- [ ] A teammate cloned the repo fresh and followed this README word for word
- [ ] Live site checked in a private browser window, including on a phone
- [ ] Instructor and TA invited as collaborators
