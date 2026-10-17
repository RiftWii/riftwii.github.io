#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 RiftWii contributors
# SPDX-License-Identifier: GPL-3.0-or-later
"""Checks the site folder before it is merged or published.

    check_site.py SITE_DIR

Fails when a page links to a file inside the site that does not exist, when a
file is larger than 5 MB, or when a file's type is not one the site serves.
Links to other sites, mailto: and in-page anchors are not followed.
"""
import html.parser
import pathlib
import sys
import urllib.parse

MAX_BYTES = 5 * 1024 * 1024
SERVED = {
    ".html", ".css", ".js", ".json", ".md", ".txt", ".xml", ".svg", ".png", ".jpg", ".jpeg",
    ".gif", ".webp", ".ico", ".ttf", ".otf", ".woff", ".woff2", ".mp4", ".webm", ".ogg", ".mp3",
}
IGNORED = {".nojekyll", "CNAME"}


class Links(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.found = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("href", "src") and value:
                self.found.append((self.getpos()[0], value))


def local_target(page, ref, root):
    parts = urllib.parse.urlsplit(ref)
    if parts.scheme or parts.netloc or ref.startswith(("#", "mailto:", "javascript:", "data:")):
        return None
    path = urllib.parse.unquote(parts.path)
    if not path:
        return None
    # A leading "/" is the site's root; /themes/ is the themes repository's own site.
    if path.startswith("/"):
        if path.startswith("/themes/") or path == "/themes":
            return None
        target = root / path.lstrip("/")
    else:
        target = page.parent / path
    if target.is_dir() or path.endswith("/"):
        target = target / "index.html"
    return target


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    root = pathlib.Path(sys.argv[1]).resolve()
    if not (root / "index.html").is_file():
        sys.exit(f"{root}/index.html is missing: the site needs a home page.")
    errors = 0
    for file in sorted(p for p in root.rglob("*") if p.is_file()):
        rel = file.relative_to(root)
        if file.name in IGNORED:
            continue
        if file.suffix.lower() not in SERVED:
            print(f"::error file=site/{rel}::{rel}: the site doesn't serve {file.suffix or 'files without an extension'}.")
            errors += 1
        if file.stat().st_size > MAX_BYTES:
            print(f"::error file=site/{rel}::{rel} is {file.stat().st_size // 1024} KB; the limit is 5 MB.")
            errors += 1
        if file.suffix.lower() == ".html":
            parser = Links()
            parser.feed(file.read_text(encoding="utf-8", errors="replace"))
            for line, ref in parser.found:
                target = local_target(file, ref, root)
                if target is None:
                    continue
                try:
                    target.resolve().relative_to(root)
                except ValueError:
                    print(f"::error file=site/{rel},line={line}::{ref} points outside the site.")
                    errors += 1
                    continue
                if not target.exists():
                    print(f"::error file=site/{rel},line={line}::{ref} doesn't exist in the site.")
                    errors += 1
    print(f"{errors} error(s)")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
