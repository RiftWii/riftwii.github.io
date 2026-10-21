// SPDX-FileCopyrightText: 2026 RiftWii contributors
// SPDX-License-Identifier: GPL-3.0-or-later
//
// Click-to-preview for the site's screenshots: a click (or Enter / Space) on a
// screenshot opens it enlarged in an overlay on the same page. Images in the
// same group (the Features grid, the theme grid, or one tutorial page) can be
// stepped through with the arrow buttons, the arrow keys or a swipe.
// Loaded by every page that has screenshots, together with css/lightbox.css.
(function () {
    "use strict";

    // Which pictures open in the overlay. Logos, icons and avatars are not here.
    const OPENER_SELECTOR = ".grid-image img, img.tutorial-image, .theme-preview img";
    // The element whose pictures form one group; a tutorial page is one group.
    const GROUP_SELECTOR = ".grid-image, .theme-grid";
    // Alt text that says nothing is not shown as a caption.
    const EMPTY_ALT = /^\s*(placeholder( image)?|image|screenshot)?\s*$/i;
    // A picture is shown at most twice its own size, so small ones stay sharp.
    const MAX_UPSCALE = 2;
    const SWIPE_DISTANCE = 50;

    let overlay = null;
    let stage = null;
    let shownImage = null;
    let caption = null;
    let counter = null;
    let closeButton = null;
    let previousButton = null;
    let nextButton = null;

    let groupImages = [];
    let groupIndex = 0;
    let opener = null;
    let touchStart = null;
    let savedPaddingRight = "";

    function isOpen() {
        return overlay !== null && !overlay.hidden;
    }

    function makeButton(className, label, glyph) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "lightbox-button " + className;
        button.setAttribute("aria-label", label);
        button.textContent = glyph;
        return button;
    }

    function build() {
        overlay = document.createElement("div");
        overlay.className = "lightbox";
        overlay.hidden = true;
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "Picture preview");

        stage = document.createElement("figure");
        stage.className = "lightbox-stage";

        shownImage = document.createElement("img");
        shownImage.className = "lightbox-image";
        shownImage.alt = "";
        // Set from the picture's real size once it is known, see show().
        shownImage.addEventListener("load", limitToTwiceNaturalSize);

        caption = document.createElement("figcaption");
        caption.className = "lightbox-caption";

        stage.appendChild(shownImage);
        stage.appendChild(caption);

        counter = document.createElement("div");
        counter.className = "lightbox-counter";
        counter.setAttribute("aria-live", "polite");

        closeButton = makeButton("lightbox-close", "Close preview", "×");
        previousButton = makeButton("lightbox-prev", "Previous picture", "‹");
        nextButton = makeButton("lightbox-next", "Next picture", "›");

        overlay.appendChild(stage);
        overlay.appendChild(counter);
        overlay.appendChild(closeButton);
        overlay.appendChild(previousButton);
        overlay.appendChild(nextButton);
        document.body.appendChild(overlay);

        closeButton.addEventListener("click", close);
        previousButton.addEventListener("click", () => step(-1));
        nextButton.addEventListener("click", () => step(1));

        // A click on the dark area (not on the picture or a button) closes it.
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay || event.target === stage) {
                close();
            }
        });

        overlay.addEventListener("touchstart", (event) => {
            if (event.touches.length !== 1) {
                touchStart = null;
                return;
            }
            touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }, { passive: true });

        overlay.addEventListener("touchend", (event) => {
            if (!touchStart || event.changedTouches.length !== 1) {
                return;
            }
            const dx = event.changedTouches[0].clientX - touchStart.x;
            const dy = event.changedTouches[0].clientY - touchStart.y;
            touchStart = null;
            if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
                step(dx < 0 ? 1 : -1);
            }
        }, { passive: true });
    }

    function limitToTwiceNaturalSize() {
        const width = shownImage.naturalWidth;
        shownImage.style.maxWidth = width ? "min(92vw, " + width * MAX_UPSCALE + "px)" : "";
    }

    function groupOf(image) {
        const root = image.closest(GROUP_SELECTOR) || document;
        return Array.prototype.slice.call(root.querySelectorAll(OPENER_SELECTOR));
    }

    function show(index) {
        groupIndex = index;
        const source = groupImages[index];

        shownImage.style.maxWidth = "";
        shownImage.src = source.currentSrc || source.src;
        // A picture that is already cached may not fire "load" again.
        if (shownImage.complete) {
            limitToTwiceNaturalSize();
        }

        const alt = (source.getAttribute("alt") || "").trim();
        const hasCaption = !EMPTY_ALT.test(alt);
        shownImage.alt = hasCaption ? alt : "";
        caption.textContent = hasCaption ? alt : "";
        caption.hidden = !hasCaption;

        const several = groupImages.length > 1;
        previousButton.hidden = !several;
        nextButton.hidden = !several;
        counter.hidden = !several;
        counter.textContent = (index + 1) + " / " + groupImages.length;
    }

    function step(direction) {
        if (groupImages.length < 2) {
            return;
        }
        const count = groupImages.length;
        show((groupIndex + direction + count) % count);
    }

    function lockScroll() {
        // Hiding the scrollbar would widen the page and make it jump sideways,
        // so its width is kept as padding.
        const root = document.documentElement;
        const scrollbar = window.innerWidth - root.clientWidth;
        savedPaddingRight = root.style.paddingRight;
        if (scrollbar > 0) {
            root.style.paddingRight = scrollbar + "px";
        }
        root.classList.add("lightbox-open");
    }

    function unlockScroll() {
        const root = document.documentElement;
        root.classList.remove("lightbox-open");
        root.style.paddingRight = savedPaddingRight;
    }

    function open(image) {
        if (!overlay) {
            build();
        }
        opener = image;
        groupImages = groupOf(image);
        const index = Math.max(0, groupImages.indexOf(image));

        overlay.hidden = false;
        show(index);
        lockScroll();
        // The class is added a frame later so the fade starts from hidden.
        window.requestAnimationFrame(() => overlay.classList.add("lightbox-visible"));
        closeButton.focus();
    }

    function close() {
        if (!isOpen()) {
            return;
        }
        overlay.classList.remove("lightbox-visible");
        overlay.hidden = true;
        shownImage.removeAttribute("src");
        unlockScroll();
        if (opener && document.contains(opener)) {
            opener.focus();
        }
        opener = null;
    }

    // Tab stays on the overlay's own visible buttons.
    function trapFocus(event) {
        const focusable = [closeButton, previousButton, nextButton].filter((button) => !button.hidden);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!overlay.contains(document.activeElement)) {
            event.preventDefault();
            first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    document.addEventListener("keydown", (event) => {
        if (isOpen()) {
            if (event.key === "Escape") {
                event.preventDefault();
                close();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                step(-1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                step(1);
            } else if (event.key === "Tab") {
                trapFocus(event);
            }
            return;
        }

        const target = event.target;
        if ((event.key === "Enter" || event.key === " ") && target.matches && target.matches(OPENER_SELECTOR)) {
            event.preventDefault();
            open(target);
        }
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (target.matches && target.matches(OPENER_SELECTOR)) {
            event.preventDefault();
            open(target);
        }
    });

    // Makes a picture reachable with the keyboard and announced as a button.
    function prepare(image) {
        if (image.hasAttribute("data-lightbox")) {
            return;
        }
        image.setAttribute("data-lightbox", "");
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        const alt = (image.getAttribute("alt") || "").trim();
        const name = EMPTY_ALT.test(alt) ? "picture" : alt;
        image.setAttribute("aria-label", "Enlarge: " + name);
    }

    function prepareAll(root) {
        if (root.matches && root.matches(OPENER_SELECTOR)) {
            prepare(root);
        }
        if (root.querySelectorAll) {
            root.querySelectorAll(OPENER_SELECTOR).forEach(prepare);
        }
    }

    prepareAll(document);

    // The theme cards are added after the page loads, and again at every search.
    new MutationObserver((records) => {
        records.forEach((record) => {
            record.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    prepareAll(node);
                }
            });
        });
    }).observe(document.body, { childList: true, subtree: true });
})();
