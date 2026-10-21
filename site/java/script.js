// SPDX-FileCopyrightText: 2026 RiftWii contributors
// SPDX-License-Identifier: GPL-3.0-or-later
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

// A link from another page (the Themes page's "Features", say) arrives as
// index.html#features. The page always starts at the top for its intro, so
// the section is remembered here and scrolled to once the intro is over.
const requestedSectionId = decodeURIComponent(window.location.hash.slice(1));

if (window.location.hash) {
    history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
    );
}

window.scrollTo(0, 0);

window.addEventListener("pageshow", (event) => {
    // A page restored from the back/forward cache stays as it was, already
    // loaded. A fresh load starts at the top for its intro, but not once the
    // intro is over: a skipped intro has already scrolled to its #section.
    if (!event.persisted && !introFinished) {
        window.scrollTo(0, 0);
    }
});

const starsContainer = document.getElementById("stars");

if (starsContainer) {
    const starCount = 90;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("span");
        star.classList.add("star");

        const size = Math.random() * 1.6 + 0.6;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = Math.random() * 4 + 2;
        const delay = Math.random() * 6;

        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.left = left + "%";
        star.style.top = top + "%";
        star.style.animationDuration = duration + "s";
        star.style.animationDelay = "-" + delay + "s";

        starsContainer.appendChild(star);
    }
}

const riftwii = document.querySelector(".riftwii");

if (riftwii) {
    const fullText = riftwii.textContent.trim();
    const leftText = fullText.slice(0, 4);
    const rightText = fullText.slice(4);

    riftwii.textContent = "";

    function makeLetter(letter, index, groupClass) {
        const letterWrapper = document.createElement("span");
        letterWrapper.classList.add("rift-letter", groupClass);

        const displayLetter = letter === " " ? "\u00A0" : letter;

        const glow = document.createElement("span");
        glow.classList.add("letter-glow");
        glow.textContent = displayLetter;

        const face = document.createElement("span");
        face.classList.add("letter-face");
        face.textContent = displayLetter;

        letterWrapper.appendChild(glow);
        letterWrapper.appendChild(face);
        letterWrapper.style.animationDelay = `${index * 0.18}s`;

        return letterWrapper;
    }

    leftText.split("").forEach((letter, index) => {
        riftwii.appendChild(makeLetter(letter, index, "left-group"));
    });

    const riftDivider = document.createElement("span");
    riftDivider.className = "rift-divider";

    const riftImg = document.createElement("img");
    riftImg.className = "rift-image";
    riftImg.src = "resources/img/rift.png";
    riftImg.alt = "Rift divider";

    const emberWrap = document.createElement("span");
    emberWrap.className = "rift-embers";

    for (let i = 0; i < 14; i++) {
        const ember = document.createElement("span");
        ember.className = "ember";
        ember.style.setProperty("--size", `${(Math.random() * 4 + 2).toFixed(2)}px`);
        ember.style.setProperty("--dur", `${(Math.random() * 1.8 + 1.8).toFixed(2)}s`);
        ember.style.setProperty("--delay", `${(-Math.random() * 3).toFixed(2)}s`);
        ember.style.setProperty("--x0", `${(Math.random() * 18 - 9).toFixed(2)}px`);
        ember.style.setProperty("--y0", `${(Math.random() * 40 - 20).toFixed(2)}px`);
        ember.style.setProperty("--x1", `${(Math.random() * 64 - 32).toFixed(2)}px`);
        ember.style.setProperty("--y1", `${(-Math.random() * 90 - 20).toFixed(2)}px`);
        emberWrap.appendChild(ember);
    }

    riftDivider.appendChild(emberWrap);
    riftDivider.appendChild(riftImg);
    riftwii.appendChild(riftDivider);

    rightText.split("").forEach((letter, index) => {
        riftwii.appendChild(makeLetter(letter, index + leftText.length, "right-group"));
    });

    const orbit = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    orbit.setAttribute("viewBox", "0 0 560 220");
    orbit.classList.add("rift-orbit");
    riftwii.appendChild(orbit);

    const traceCount = 3;
    const orbitDuration = 7;
    const spacing = 100 / traceCount;

    function buildDefs() {
        return `
            <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#26d9ff" stop-opacity="0"/>
                    <stop offset="16%" stop-color="#47e8ff" stop-opacity="0.48"/>
                    <stop offset="48%" stop-color="#a7ffff" stop-opacity="0.92"/>
                    <stop offset="82%" stop-color="#45e2ff" stop-opacity="0.54"/>
                    <stop offset="100%" stop-color="#26d9ff" stop-opacity="0"/>
                </linearGradient>

                <linearGradient id="purpleGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#8d35ff" stop-opacity="0"/>
                    <stop offset="20%" stop-color="#b659ff" stop-opacity="0.44"/>
                    <stop offset="52%" stop-color="#f09cff" stop-opacity="0.90"/>
                    <stop offset="84%" stop-color="#aa55ff" stop-opacity="0.52"/>
                    <stop offset="100%" stop-color="#8d35ff" stop-opacity="0"/>
                </linearGradient>

                <filter id="blueOrbitGlow" x="-150%" y="-150%" width="400%" height="400%">
                    <feGaussianBlur stdDeviation="2.5" result="blueBlur"/>
                    <feColorMatrix
                        in="blueBlur"
                        type="matrix"
                        values="
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 1.55 0
                        "
                        result="blueBloom"
                    />
                    <feMerge>
                        <feMergeNode in="blueBloom"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>

                <filter id="purpleOrbitGlow" x="-150%" y="-150%" width="400%" height="400%">
                    <feGaussianBlur stdDeviation="2.4" result="purpleBlur"/>
                    <feColorMatrix
                        in="purpleBlur"
                        type="matrix"
                        values="
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 1.45 0
                        "
                        result="purpleBloom"
                    />
                    <feMerge>
                        <feMergeNode in="purpleBloom"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
        `;
    }

    function makeTrace({ cls, cx, cy, rx, ry, dash, offset }) {
        return `
            <ellipse
                class="${cls}"
                cx="${cx}"
                cy="${cy}"
                rx="${rx}"
                ry="${ry}"
                pathLength="100"
                stroke-dasharray="${dash} ${100 - dash}"
                stroke-dashoffset="${offset}"
                data-base-offset="${offset}"
            />
        `;
    }

    function renderOrbit() {
        let svg = buildDefs();

        for (let i = 0; i < traceCount; i++) {
            const offset = i * spacing;

            svg += makeTrace({
                cls: "orbit-trace orbit-blue-trace",
                cx: 280,
                cy: 110,
                rx: 258,
                ry: 62,
                dash: 18,
                offset
            });

            svg += makeTrace({
                cls: "orbit-trace orbit-purple-trace",
                cx: 280,
                cy: 110,
                rx: 218,
                ry: 48,
                dash: 14,
                offset
            });
        }

        orbit.innerHTML = svg;
    }

    renderOrbit();

    const traces = [...orbit.querySelectorAll(".orbit-trace")];
    const speed = 100 / orbitDuration;

    function animateOrbit(timestamp) {
        const elapsed = timestamp / 1000;

        traces.forEach((trace) => {
            const baseOffset = parseFloat(trace.dataset.baseOffset || "0");
            const currentOffset = (baseOffset + elapsed * speed) % 100;
            trace.setAttribute("stroke-dashoffset", currentOffset);
        });

        requestAnimationFrame(animateOrbit);
    }

    requestAnimationFrame(animateOrbit);
}


const tbar = document.getElementById("tbar");
const tbarToggle = document.getElementById("tbarToggle");
const navLinks = [...document.querySelectorAll(".tbar-links a[data-section]")];
const sections = ["home", "download", "features", "tutorials", "socials", "credits"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

function setActiveSection(sectionId) {
    // The Themes page has no sections (its links go to the home page), and
    // its own link is marked in the HTML, so there is nothing to highlight.
    if (!sections.length) {
        return;
    }

    navLinks.forEach((link) => {
        link.classList.toggle(
            "active",
            link.dataset.section === sectionId
        );
    });
}

if (tbarToggle) {
    tbarToggle.addEventListener("click", () => {
        const collapsed = document.body.classList.toggle("tbar-collapsed");

        tbarToggle.setAttribute(
            "aria-expanded",
            String(!collapsed)
        );

        tbarToggle.setAttribute(
            "aria-label",
            collapsed ? "Show navigation" : "Hide navigation"
        );
    });
}

// Phone and tablet menu (below 900px): the links sit in a panel under a slim
// bar. It closes on a link, on a tap outside, on Escape and when the window
// grows to the desktop layout, where the side bar shows the links itself.
const navMenuButton = document.getElementById("navMenuButton");
const navPanel = document.getElementById("navPanel");
const compactNavQuery = window.matchMedia("(max-width: 900px)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function isNavOpen() {
    return document.body.classList.contains("nav-open");
}

function setNavOpen(open, { returnFocus = false } = {}) {
    document.body.classList.toggle("nav-open", open);

    if (navMenuButton) {
        navMenuButton.setAttribute("aria-expanded", String(open));
    }

    if (open) {
        // An open menu has to be visible, whatever the scroll hid.
        document.body.classList.remove("nav-hidden");
    } else if (returnFocus && navMenuButton) {
        navMenuButton.focus();
    }
}

if (navMenuButton) {
    navMenuButton.addEventListener("click", () => {
        setNavOpen(!isNavOpen());
    });

    document.addEventListener("click", (event) => {
        if (isNavOpen() && !tbar.contains(event.target)) {
            setNavOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isNavOpen()) {
            setNavOpen(false, { returnFocus: true });
        }
    });

    compactNavQuery.addEventListener("change", (event) => {
        if (!event.matches) {
            setNavOpen(false);
            document.body.classList.remove("nav-hidden");
        }
    });
}

// The slim bar slides away while reading down the page and comes back on the
// first scroll up, so it never covers the content for long. Not done for
// reduced motion, or while the menu or a link in the bar has focus.
let lastScrollY = window.scrollY;

function updateNavVisibility() {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    const barHasFocus = tbar && tbar.contains(document.activeElement);

    if (
        !compactNavQuery.matches ||
        reducedMotionQuery.matches ||
        document.body.classList.contains("reduced-motion") ||
        isNavOpen() ||
        barHasFocus ||
        currentY < 80
    ) {
        document.body.classList.remove("nav-hidden");
    } else if (delta > 6) {
        document.body.classList.add("nav-hidden");
    } else if (delta < -6) {
        document.body.classList.remove("nav-hidden");
    }

    if (Math.abs(delta) > 6) {
        lastScrollY = currentY;
    }
}

window.addEventListener("scroll", updateNavVisibility, { passive: true });

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        setNavOpen(false);

        const sectionId = link.dataset.section;
        const section = document.getElementById(sectionId);

        if (!section) {
            return;
        }

        event.preventDefault();
        setActiveSection(sectionId);

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

function updateScrollSpy() {
    if (!sections.length) {
        return;
    }

    if (!document.body.classList.contains("loaded")) {
        setActiveSection("home");
        return;
    }

    const targetY = window.innerHeight * 0.34;
    let closestSection = "home";
    let closestDistance = Infinity;

    sections.forEach((section) => {
        let targetBox;

        if (section.id === "home") {
            targetBox = section.querySelector(".hero-intro");
        } else {
            targetBox = section.querySelector(".content-box");
        }

        if (!targetBox) {
            targetBox = section;
        }

        const rect = targetBox.getBoundingClientRect();
        const boxCenter = rect.top + rect.height / 2;
        const distance = Math.abs(boxCenter - targetY);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section.id;
        }
    });

    setActiveSection(closestSection);
}

window.addEventListener("scroll", updateScrollSpy, {
    passive: true
});

window.addEventListener("resize", updateScrollSpy);

window.scrollTo(0, 0);


const revealBoxes = [...document.querySelectorAll(".reveal-box")];

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && document.body.classList.contains("loaded")) {
                entry.target.classList.add("box-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.14,
        rootMargin: "0px 0px -5% 0px"
    }
);

function startBoxReveals() {
    revealBoxes.forEach((box) => revealObserver.observe(box));

    const heroIntro = document.querySelector(".hero-intro");
    if (heroIntro) {
        requestAnimationFrame(() => {
            heroIntro.classList.add("box-visible");
            revealObserver.unobserve(heroIntro);
        });
    }
}

async function loadLatestRelease() {
    const latestVersion = document.getElementById("latestVersion");
    const latestLink = document.getElementById("latestReleaseLink");

    if (!latestVersion || !latestLink) {
        return;
    }

    try {
        const response = await fetch(
            "https://api.github.com/repos/KakarottoCake/Riftwii/releases/latest",
            {
                headers: {
                    "Accept": "application/vnd.github+json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("GitHub release request failed");
        }

        const release = await response.json();

        latestVersion.textContent =
            release.name || release.tag_name;

        latestLink.href =
            release.html_url;

        latestLink.textContent =
            `Get ${release.tag_name}`;

    } catch (error) {
        latestVersion.textContent =
            "Latest RiftWii release";

        latestLink.href =
            "https://github.com/KakarottoCake/Riftwii/releases/latest";

        latestLink.textContent =
            "Download Latest Release";
    }
}

loadLatestRelease();



const tutorialSearch = document.getElementById("tutorialSearch");
const tutorialList = document.getElementById("tutorialList");
const tutorialToggle = document.getElementById("tutorialToggle");
const tutorialSortButton = document.getElementById("tutorialSortButton");
const tutorialSortLabel = document.getElementById("tutorialSortLabel");
const tutorialSortMenu = document.getElementById("tutorialSortMenu");
const tutorialSortWrap = tutorialSortButton
    ? tutorialSortButton.closest(".tutorial-sort-wrap")
    : null;

const FEATURED_TUTORIALS = [
    "getting-started.html",
    "installing-mods.html"
];

const TUTORIAL_FALLBACK_FILES = [
    "getting-started.html",
    "installing-mods.html",
    "send-a-problem-report.html",
    "updating-riftwii.html",
    "virtual-sd-cards.html",
    "developers.html"
];

const TUTORIAL_COLLAPSED_FILES = [
    "getting-started.html",
    "installing-mods.html",
    "send-a-problem-report.html",
];


let tutorialFiles = [];
let tutorialExpanded = false;
let tutorialSortMode = "az";

function tutorialDisplayName(filename) {
    const key = filename.replace(/\.html?$/i, "").toLowerCase();

    const specialNames = {
        "ctgp-r": "CTGP-R (Advanced)",
        "riifs": "RiiFS (Advanced)",
        "usb-hardware-test": "USB Hardware Test (Advanced)",
        "code-map": "Code Map (Advanced)",
        "headless-launching": "Headless Launching (Advanced)",
        "architecture": "Architecture (Advanced)",
        "developing": "Developing (Advanced)",
        "themes": "Themes",
        "harness": "Dolphin Test Harness (Advanced)",
        "bluetooth": "Bluetooth (Advanced)",
        "developers": "For Developers"
    };

    if (specialNames[key]) {
        return specialNames[key];
    }

    return filename
        .replace(/\.html?$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function tutorialRelativeUrl(filename) {
    return `tutorials/${encodeURIComponent(filename)}`;
}

async function scanTutorialJson() {
    const response = await fetch("tutorials.json?v=20261016-6", {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("tutorials.json unavailable");
    }

    const contents = await response.json();

    if (!Array.isArray(contents)) {
        throw new Error("Unexpected tutorials.json format");
    }

    const files = contents
        .filter((name) => typeof name === "string" && /\.html?$/i.test(name))
        .map((name) => name.trim())
        .filter(Boolean);

    if (!files.length) {
        throw new Error("tutorials.json contains no tutorials");
    }

    return files;
}

function sortTutorials(items) {
    const sorted = [...items];

    switch (tutorialSortMode) {
        case "za":
            return sorted.sort((a, b) =>
                b.displayName.localeCompare(
                    a.displayName,
                    undefined,
                    { numeric: true, sensitivity: "base" }
                )
            );

        case "az":
        default:
            return sorted.sort((a, b) =>
                a.displayName.localeCompare(
                    b.displayName,
                    undefined,
                    { numeric: true, sensitivity: "base" }
                )
            );
    }
}

function getCollapsedTutorials(items) {
    return TUTORIAL_COLLAPSED_FILES
        .map((filename) =>
            items.find((item) => item.filename === filename)
        )
        .filter(Boolean);
}

function makeTutorialItem(tutorial) {
    const link = document.createElement("a");
    link.className = "tutorial-item";
    link.href = tutorialRelativeUrl(tutorial.filename);

    const main = document.createElement("span");
    main.className = "tutorial-item-main";

    const name = document.createElement("span");
    name.className = "tutorial-item-name";
    name.textContent = tutorial.displayName;

    main.appendChild(name);

    const arrow = document.createElement("span");
    arrow.className = "tutorial-item-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "›";

    link.appendChild(main);
    link.appendChild(arrow);

    return link;
}

function renderTutorials({ animate = true } = {}) {
    if (!tutorialList) {
        return;
    }

    const searchValue = tutorialSearch
        ? tutorialSearch.value.trim().toLowerCase()
        : "";

    let filtered = tutorialFiles.filter((tutorial) =>
        tutorial.displayName.toLowerCase().includes(searchValue)
    );

    const searching = searchValue.length > 0;

    if (tutorialExpanded || searching) {
        filtered = sortTutorials(filtered);
    } else {
        filtered = getCollapsedTutorials(filtered);
    }

    const oldHeight = tutorialList.getBoundingClientRect().height;

    const replaceItems = () => {
        tutorialList.innerHTML = "";

        if (!filtered.length) {
            tutorialList.innerHTML =
                '<div class="tutorial-status">No matching tutorials found.</div>';
            return;
        }

        filtered.forEach((tutorial, index) => {
            const item = makeTutorialItem(tutorial);

            if (animate) {
                item.classList.add("tutorial-fading-in");
            }

            tutorialList.appendChild(item);

            if (animate) {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        item.classList.remove("tutorial-fading-in");
                    }, index * 45);
                });
            }
        });
    };

    if (!animate) {
        replaceItems();
        tutorialList.style.maxHeight = "none";
    } else {
        tutorialList.style.maxHeight = `${oldHeight}px`;

        [...tutorialList.children].forEach((item, index) => {
            item.classList.add("tutorial-fading-out");
            item.style.transitionDelay = `${index * 20}ms`;
        });

        setTimeout(() => {
            replaceItems();

            const newHeight = tutorialList.scrollHeight;

            requestAnimationFrame(() => {
                tutorialList.style.maxHeight = `${newHeight}px`;
            });

            setTimeout(() => {
                tutorialList.style.maxHeight = "none";
            }, 540);
        }, 230);
    }

    if (tutorialToggle) {
        const collapsedCount = getCollapsedTutorials(tutorialFiles).length;

        tutorialToggle.hidden =
            searching || tutorialFiles.length <= collapsedCount;

        if (!tutorialToggle.hidden) {
            tutorialToggle.textContent = tutorialExpanded
                ? "Hide ▲"
                : "Show All Tutorials ▼";
        }
    }

    if (tutorialSortWrap) {
        tutorialSortWrap.classList.toggle(
            "tutorial-sort-hidden",
            !tutorialExpanded || searching
        );
    }
}

async function scanTutorials() {
    if (!tutorialList) {
        return;
    }

    tutorialList.innerHTML =
        '<div class="tutorial-status">Loading tutorials...</div>';

    let files = [];

    try {
        files = await scanTutorialJson();
    } catch (error) {
        console.warn(
            "tutorials.json could not be loaded; using the built-in tutorial list.",
            error
        );

        files = [...TUTORIAL_FALLBACK_FILES];
    }

    const uniqueFiles = files.filter(
        (name, index, array) =>
            typeof name === "string" &&
            /\.html?$/i.test(name) &&
            array.indexOf(name) === index
    );

    tutorialFiles = uniqueFiles.map((filename) => ({
        filename,
        displayName: tutorialDisplayName(filename)
    }));

    renderTutorials({ animate: false });
}

function closeTutorialSort() {
    if (!tutorialSortWrap || !tutorialSortButton) {
        return;
    }

    tutorialSortWrap.classList.remove("open");
    tutorialSortButton.setAttribute("aria-expanded", "false");
}

if (tutorialSearch) {
    tutorialSearch.addEventListener("input", () => {
        renderTutorials({ animate: true });
    });
}

if (tutorialToggle) {
    tutorialToggle.addEventListener("click", () => {
        tutorialExpanded = !tutorialExpanded;

        if (!tutorialExpanded) {
            closeTutorialSort();
        }

        renderTutorials({ animate: true });
    });
}

if (tutorialSortButton && tutorialSortWrap) {
    tutorialSortButton.addEventListener("click", () => {
        if (!tutorialExpanded) {
            return;
        }

        const isOpen = tutorialSortWrap.classList.toggle("open");
        tutorialSortButton.setAttribute("aria-expanded", String(isOpen));
    });
}

if (tutorialSortMenu) {
    tutorialSortMenu.addEventListener("click", (event) => {
        const option = event.target.closest("[data-sort]");

        if (!option) {
            return;
        }

        tutorialSortMode = option.dataset.sort;

        const labels = {
            "az": "A–Z",
            "za": "Z–A"
        };

        if (tutorialSortLabel) {
            tutorialSortLabel.textContent =
                labels[tutorialSortMode] || "A–Z";
        }

        tutorialSortMenu
            .querySelectorAll("[data-sort]")
            .forEach((button) => {
                button.classList.toggle(
                    "active",
                    button.dataset.sort === tutorialSortMode
                );
            });

        closeTutorialSort();
        renderTutorials({ animate: true });
    });
}

document.addEventListener("click", (event) => {
    if (
        tutorialSortWrap &&
        !tutorialSortWrap.contains(event.target)
    ) {
        closeTutorialSort();
    }
});

scanTutorials();



// The Features and Credits grids animate their height by pinning it to
// pixels. A grid with a pinned height stretches its rows to fill it, so the
// boxes that stay after a collapse used to grow tall (and scrollHeight, read
// while they were stretched, returned the old height, so the section never
// shrank until it snapped). The grids therefore use align-content: start, and
// the new height is measured with the height set back to auto.
function prefersReducedMotion() {
    return (
        reducedMotionQuery.matches ||
        document.body.classList.contains("reduced-motion")
    );
}

function naturalHeight(element, pinnedHeight) {
    element.style.height = "auto";
    const height = element.getBoundingClientRect().height;
    element.style.height = `${pinnedHeight}px`;

    // Reading the layout makes the pinned height apply before the next change
    // to it, so the transition starts from there.
    element.getBoundingClientRect();

    return height;
}

const featuresGrid = document.getElementById("featuresGrid");
const featuresToggle = document.getElementById("featuresToggle");

let featureSections = [];
let featuresExpanded = false;

function parseFeaturesMarkdown(markdown) {
    const lines = markdown.split(/\r?\n/);
    const sections = [];
    let currentSection = null;

    lines.forEach((rawLine) => {
        const line = rawLine.trim();

        if (!line) {
            return;
        }

        if (line.startsWith("# ")) {
            if (currentSection) {
                sections.push(currentSection);
            }

            currentSection = {
                title: line
                    .slice(2)
                    .trim()
                    .replace(/:$/, ""),
                items: []
            };

            return;
        }

        if (line.startsWith("- ") && currentSection) {
            currentSection.items.push(
                line.slice(2).trim()
            );
        }
    });

    if (currentSection) {
        sections.push(currentSection);
    }

    return sections.filter(
        (section) =>
            section.title &&
            section.items.length > 0
    );
}

function makeFeatureGroup(section) {
    const group = document.createElement("section");
    group.className = "feature-group";

    const heading = document.createElement("h3");
    heading.textContent = section.title;

    const list = document.createElement("ul");

    section.items.forEach((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        list.appendChild(item);
    });

    group.appendChild(heading);
    group.appendChild(list);

    return group;
}

function drawFeatureGroups(sections, animateIn) {
    featuresGrid.innerHTML = "";

    sections.forEach((section, index) => {
        const group = makeFeatureGroup(section);

        if (animateIn) {
            group.classList.add("feature-fade-in");
        }

        featuresGrid.appendChild(group);

        if (animateIn) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    group.classList.remove("feature-fade-in");
                }, index * 45);
            });
        }
    });
}

function renderFeatures(animate = true) {
    if (!featuresGrid) {
        return;
    }

    const visibleSections = featuresExpanded
        ? featureSections
        : featureSections.slice(0, 2);

    if (prefersReducedMotion()) {
        animate = false;
    }

    if (!animate) {
        drawFeatureGroups(visibleSections, false);
        featuresGrid.style.height = "auto";
    } else {
        const oldHeight =
            featuresGrid.getBoundingClientRect().height;

        featuresGrid.style.height =
            `${oldHeight}px`;

        [...featuresGrid.children].forEach(
            (group, index) => {
                group.classList.add("feature-fade-out");
                group.style.transitionDelay =
                    `${index * 18}ms`;
            }
        );

        setTimeout(() => {
            drawFeatureGroups(visibleSections, true);

            const newHeight =
                naturalHeight(featuresGrid, oldHeight);

            requestAnimationFrame(() => {
                featuresGrid.style.height =
                    `${newHeight}px`;
            });

            setTimeout(() => {
                featuresGrid.style.height = "auto";
            }, 560);
        }, 220);
    }

    if (featuresToggle) {
        featuresToggle.hidden =
            featureSections.length <= 2;

        featuresToggle.textContent =
            featuresExpanded
                ? "Show less ▲"
                : `Show more ▼`;
    }
}

async function loadFeaturesMarkdown() {
    if (!featuresGrid) {
        return;
    }

    try {
        const response = await fetch(
            "features.md",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                "features.md could not be loaded"
            );
        }

        const markdown =
            await response.text();

        featureSections =
            parseFeaturesMarkdown(markdown);

        if (!featureSections.length) {
            throw new Error(
                "No feature sections found"
            );
        }

        renderFeatures(false);
    } catch (error) {
        featuresGrid.innerHTML =
            '<div class="features-status">' +
            'Could not load features.md.' +
            '</div>';

        if (featuresToggle) {
            featuresToggle.hidden = true;
        }
    }
}

if (featuresToggle) {
    featuresToggle.addEventListener(
        "click",
        () => {
            featuresExpanded =
                !featuresExpanded;

            renderFeatures(true);
        }
    );
}

loadFeaturesMarkdown();

// The title intro lasts about a second and a half. Any tap, key press, click
// or scroll attempt skips the rest of it, and it is skipped altogether when
// the device asks for reduced motion, so nobody waits to start reading.
const INTRO_MS = 1500;
let introFinished = false;

function finishIntro() {
    if (introFinished) {
        return;
    }

    introFinished = true;
    document.body.classList.add("loaded");
    document.body.classList.remove("page-locked");
    startBoxReveals();
    updateScrollSpy();

    const requestedSection = requestedSectionId
        ? document.getElementById(requestedSectionId)
        : null;

    if (requestedSection) {
        requestedSection.scrollIntoView({ behavior: "instant", block: "start" });
    }
}

// A page that is already "loaded" in its HTML (the Themes page) has no title
// intro to wait for.
const introTimer = setTimeout(
    finishIntro,
    reducedMotionQuery.matches || document.body.classList.contains("loaded") ? 0 : INTRO_MS
);

["pointerdown", "keydown", "wheel", "touchstart"].forEach((eventName) => {
    window.addEventListener(
        eventName,
        () => {
            clearTimeout(introTimer);
            finishIntro();
        },
        { once: true, passive: true }
    );
});



document.addEventListener("mousedown", () => {
    document.body.classList.add("mouse-down");
});

function clearMouseDown() {
    document.body.classList.remove("mouse-down");
}

document.addEventListener("mouseup", clearMouseDown);
document.addEventListener("mouseleave", clearMouseDown);
document.addEventListener("dragend", clearMouseDown);
document.addEventListener("drop", clearMouseDown);
document.addEventListener("pointerup", clearMouseDown);
document.addEventListener("pointercancel", clearMouseDown);
window.addEventListener("blur", clearMouseDown);

document.addEventListener("mouseup", () => {
    document.body.classList.remove("mouse-down");
});

document.addEventListener("mouseleave", () => {
    document.body.classList.remove("mouse-down");
});



const creditsGrid =
    document.getElementById(
        "creditsGrid"
    );

const creditsToggle =
    document.getElementById(
        "creditsToggle"
    );


let creditors = [];

let creditsExpanded = false;


function parseCreditsMarkdown(
    markdown
) {
    const lines =
        markdown.split(/\r?\n/);

    const entries = [];

    let current = null;


    function finishCurrent() {
        if (
            current &&
            current.name
        ) {
            entries.push(
                current
            );
        }

        current = null;
    }


    lines.forEach(
        (rawLine) => {

            const line =
                rawLine.trim();


            if (!line) {
                return;
            }


            if (
                line.startsWith(
                    "# "
                )
            ) {
                finishCurrent();


                current = {
                    name:
                        line
                            .slice(2)
                            .trim(),

                    subtitle: "",

                    image: "",

                    mc: false
                };


                return;
            }


            if (!current) {
                return;
            }


            if (
                line.toLowerCase()
                === "mc"
            ) {
                current.mc = true;

                return;
            }


            
            if (
                /\.(png|jpg|jpeg|webp|gif)$/i
                    .test(line)
            ) {
                current.image =
                    line;

                return;
            }


            
            if (
                !current.subtitle
            ) {
                current.subtitle =
                    line;

                return;
            }
        }
    );


    finishCurrent();


    
    return entries.filter(
        (entry) =>
            entry.name
    );
}


function createCreditCard(
    creditor
) {
    const card =
        document.createElement(
            "div"
        );

    card.className =
        "credit-card";


    
    if (creditor.image) {

        const avatar =
            document.createElement(
                "div"
            );

        avatar.className =
            "credit-avatar";


        const image =
            document.createElement(
                "img"
            );

        image.src =
            `resources/img/contributors/${creditor.image}`;

        image.alt =
            `${creditor.name} profile picture`;


        avatar.appendChild(
            image
        );


        card.appendChild(
            avatar
        );

    } else {

        
        card.classList.add(
            "credit-card-no-image"
        );
    }


    const info =
        document.createElement(
            "div"
        );

    info.className =
        "credit-info";


    const name =
        document.createElement(
            "h3"
        );

    name.className =
        "credit-name";

    name.textContent =
        creditor.name;


    info.appendChild(
        name
    );


    
    if (creditor.subtitle) {

        const subtitle =
            document.createElement(
                "p"
            );

        subtitle.className =
            "credit-subtitle";

        subtitle.textContent =
            creditor.subtitle;


        info.appendChild(
            subtitle
        );
    }


    card.appendChild(
        info
    );


    return card;
}


function renderCredits(
    animate = true
) {
    if (!creditsGrid) {
        return;
    }


    
    const visibleCredits =
        creditsExpanded
            ? creditors
            : creditors.filter(
                creditor =>
                    creditor.mc
            );


    if (prefersReducedMotion()) {
        animate = false;
    }

    const oldHeight =
        creditsGrid
            .getBoundingClientRect()
            .height;


    const draw = () => {

        creditsGrid.innerHTML =
            "";


        if (
            !visibleCredits.length
        ) {
            creditsGrid.innerHTML =
                '<div class="credits-status">' +
                'No featured contributors.' +
                '</div>';

            return;
        }


        visibleCredits.forEach(
            (
                creditor,
                index
            ) => {

                const card =
                    createCreditCard(
                        creditor
                    );


                if (animate) {
                    card.classList.add(
                        "credit-entering"
                    );
                }


                creditsGrid.appendChild(
                    card
                );


                if (animate) {

                    requestAnimationFrame(
                        () => {

                            setTimeout(
                                () => {

                                    card.classList.remove(
                                        "credit-entering"
                                    );

                                },
                                index * 45
                            );

                        }
                    );
                }
            }
        );
    };


    if (!animate) {

        draw();

        creditsGrid.style.height =
            "auto";

    } else {

        creditsGrid.style.height =
            `${oldHeight}px`;


        [
            ...creditsGrid.children
        ].forEach(
            (
                card,
                index
            ) => {

                card.classList.add(
                    "credit-leaving"
                );


                card.style
                    .transitionDelay =
                        `${index * 18}ms`;

            }
        );


        setTimeout(
            () => {

                draw();


                const newHeight =
                    naturalHeight(
                        creditsGrid,
                        oldHeight
                    );


                requestAnimationFrame(
                    () => {

                        creditsGrid.style.height =
                            `${newHeight}px`;

                    }
                );


                setTimeout(
                    () => {

                        creditsGrid.style.height =
                            "auto";

                    },
                    560
                );

            },
            220
        );
    }


    if (creditsToggle) {

        
        const hiddenCount =
            creditors.filter(
                creditor =>
                    !creditor.mc
            ).length;


        creditsToggle.hidden =
            hiddenCount === 0;


        creditsToggle.textContent =
            creditsExpanded
                ? "Show less ▲"
                : `Show more ▼`;
    }
}


async function loadCreditsMarkdown() {

    if (!creditsGrid) {
        return;
    }


    try {

        const response =
            await fetch(
                "credits.md",
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {
            throw new Error(
                "credits.md could not be loaded"
            );
        }


        const markdown =
            await response.text();


        creditors =
            parseCreditsMarkdown(
                markdown
            );


        if (
            !creditors.length
        ) {
            throw new Error(
                "No credits found"
            );
        }


        renderCredits(
            false
        );

    } catch (error) {

        creditsGrid.innerHTML =
            '<div class="credits-status">' +
            'Could not load credits.md.' +
            '</div>';


        if (creditsToggle) {
            creditsToggle.hidden =
                true;
        }
    }
}


if (creditsToggle) {

    creditsToggle.addEventListener(
        "click",
        () => {

            creditsExpanded =
                !creditsExpanded;


            renderCredits(
                true
            );
        }
    );
}


loadCreditsMarkdown();

const motionToggle = document.getElementById("motionToggle");

function updateMotionToggle() {
    if (!motionToggle) {
        return;
    }

    const reduced =
        document.body.classList.contains("reduced-motion");

    motionToggle.textContent = reduced
        ? "Animations: Off"
        : "Animations: On";

    motionToggle.setAttribute(
        "aria-pressed",
        reduced ? "true" : "false"
    );
}

function setReducedMotion(enabled) {
    document.body.classList.toggle(
        "reduced-motion",
        enabled
    );

    updateMotionToggle();
}

// Start with animations off when the device asks for less motion; the button
// in the menu can still turn them on.
document.body.classList.toggle("reduced-motion", reducedMotionQuery.matches);
updateMotionToggle();

if (motionToggle) {
    motionToggle.addEventListener("click", () => {
        const reduced =
            document.body.classList.contains("reduced-motion");

        setReducedMotion(!reduced);
    });
}


// The Themes page: fills the theme list from themes.json. The themes live in
// their own repository (RiftWii/themes), which GitHub serves under this same
// address, at /themes/, so the list and every picture and zip in it are
// same-origin. Every value from the file is put in with textContent or
// checked URLs, never as HTML.
(function () {
    "use strict";

    const list = document.getElementById("themeList");
    const count = document.getElementById("count");
    const search = document.getElementById("themeSearch");

    if (!list || !count || !search) {
        return;
    }

    // Opened from this computer (a local copy of the site, to work on the
    // page), /themes/ is looked for next to the page instead.
    const localPreview = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
    const themesJsonUrl = localPreview
        ? location.origin + "/themes/themes.json"
        : "https://riftwii.github.io/themes/themes.json";

    let themes = [];

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    // Only links into this site are used, so a bad entry can't point
    // a download or an image somewhere else.
    function ownUrl(value) {
        try {
            const url = new URL(value, themesJsonUrl);
            return url.origin === location.origin ? url.href : null;
        } catch (e) {
            return null;
        }
    }

    function formatSize(bytes) {
        if (!(bytes >= 0)) return "";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    function licenseLabel(id) {
        const names = { "CC0-1.0": "CC0", "CC-BY-4.0": "CC BY 4.0", "CC-BY-SA-4.0": "CC BY-SA 4.0" };
        return names[id] || id || "";
    }

    function card(theme) {
        const article = el("article", "theme-card");

        const preview = el("div", "theme-preview");
        const previewUrl = theme.preview ? ownUrl(theme.preview) : null;
        if (previewUrl) {
            const img = el("img");
            img.src = previewUrl;
            img.alt = "Preview of " + (theme.name || theme.folder);
            img.loading = "lazy";
            preview.appendChild(img);
        } else {
            preview.appendChild(el("span", "theme-no-preview", "No preview yet"));
        }
        article.appendChild(preview);

        const body = el("div", "theme-card-body");
        body.appendChild(el("h3", null, theme.name || theme.folder));
        if (theme.author) body.appendChild(el("p", "theme-by", "by " + theme.author));

        const tags = el("div", "theme-tags");
        if (theme.license) tags.appendChild(el("span", "theme-tag", licenseLabel(theme.license)));
        if (theme.has_music) tags.appendChild(el("span", "theme-tag", "Music"));
        if (theme.size) tags.appendChild(el("span", "theme-tag", formatSize(theme.size)));
        body.appendChild(tags);

        const zipUrl = ownUrl(theme.zip);
        if (zipUrl) {
            const download = el("a", "download-button theme-download", "Download");
            download.href = zipUrl;
            download.setAttribute("download", "");
            body.appendChild(download);
        }
        if (theme.sha256) {
            // Tucked away: only people checking a download by hand want it.
            const details = el("details", "theme-hash");
            details.appendChild(el("summary", null, "Checksum"));
            details.appendChild(el("p", null, "SHA-256 " + theme.sha256));
            body.appendChild(details);
        }

        article.appendChild(body);
        return article;
    }

    function emptyState() {
        const box = el("div", "theme-empty");
        box.appendChild(el("h3", null, "No themes yet"));
        box.appendChild(el("p", null, "This collection has only just opened. Make the first theme, and it will appear here as soon as it's merged."));
        const make = el("a", "download-button", "Make the first theme");
        make.href = "#make";
        box.appendChild(make);
        return box;
    }

    function render() {
        const query = search.value.trim().toLowerCase();
        const shown = themes.filter((theme) => {
            if (!query) return true;
            return ((theme.name || "") + " " + (theme.author || "") + " " + (theme.folder || ""))
                .toLowerCase().includes(query);
        });

        list.textContent = "";
        if (themes.length === 0) {
            count.textContent = "Themes appear here as soon as they're added.";
            list.appendChild(emptyState());
            return;
        }
        count.textContent = themes.length === 1 ? "1 theme to choose from." : themes.length + " themes to choose from.";
        if (shown.length === 0) {
            list.appendChild(el("p", "theme-status", "No theme matches \u201c" + search.value.trim() + "\u201d."));
            return;
        }
        const grid = el("div", "theme-grid");
        shown.forEach((theme) => grid.appendChild(card(theme)));
        list.appendChild(grid);
    }

    fetch(themesJsonUrl, { cache: "no-cache" })
        .then((response) => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then((index) => {
            themes = Array.isArray(index.themes) ? index.themes.slice() : [];
            themes.sort((a, b) =>
                (a.name || a.folder || "").localeCompare(b.name || b.folder || "")
            );
            search.hidden = themes.length < 2;
            render();
        })
        .catch(() => {
            count.textContent = "";
            list.textContent = "";
            const message = el("p", "theme-status", "The theme list didn't load. ");
            const link = el("a", null, "Open themes.json");
            link.href = themesJsonUrl;
            message.appendChild(link);
            list.appendChild(message);
        });

    search.addEventListener("input", render);
})();
