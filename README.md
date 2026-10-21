# riftwii.github.io

RiftWii's website: the home page, the Themes page (`site/themes.html`), tutorials and credits, served by GitHub Pages at **https://riftwii.github.io/**. The community themes live in their own repository, [RiftWii/themes](https://github.com/RiftWii/themes), and are served under the same address at https://riftwii.github.io/themes/ (just `themes.json`, previews and zips; the page people browse is this site's https://riftwii.github.io/themes.html, which reads `themes.json` from there).

The code is in [KakarottoCake/Riftwii](https://github.com/KakarottoCake/Riftwii).

## How it works

- Everything the site serves is in `site/`, as plain HTML, CSS, JavaScript and images. Nothing is built or generated.
- **check** runs on every pull request, using `scripts/check_site.py`. It fails when:
  - a page links to a file in `site/` that doesn't exist;
  - a file is over 5 MB;
  - a file has a type the site doesn't serve.
- **publish** runs on every push to `main`. It runs the same check, then deploys `site/` to Pages.

## Working on it

Open `site/index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server -d site 8000
```

Then open http://localhost:8000/. The Themes page reads `/themes/themes.json` from the same server when opened on localhost, so to see cards locally put a copy of the published `themes.json` (with its previews and zips) in a folder and serve it at `/themes/`. Run the check before you push:

```bash
python3 scripts/check_site.py site
```

Changes go to `main` through a pull request, and `check` has to pass.
