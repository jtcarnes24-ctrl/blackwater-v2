/* The AccordionGallery stylesheet, held as a string.

   Every other component in this project ships its CSS inside a JSX <style>
   block instead of importing a .css file. Importing one here made Vite emit
   a second file for the lazy Services chunk, and that two-file chunk would
   not load on Cloudflare Pages -- the dynamic import rejected and took the
   whole app down, while the identical build served fine locally. Keeping the
   CSS in JS keeps the chunk to one file, like the rest of the app.

   Edit here, not in a .css file. */
export const AG_CSS = `.accordion-gallery {
  --ag-accent: #ffffff;
  --ag-overlay: #060010;
  --ag-text: #ffffff;
  --ag-gap: 10px;
  --ag-radius: 16px;
  --ag-media-size: 320px;

  display: flex;
  flex-direction: row;
  gap: var(--ag-gap);
  width: 100%;
  max-width: 100%;
  perspective: 1400px;
  perspective-origin: 50% 50%;
}

.accordion-gallery--vertical {
  flex-direction: column;
}

.ag-panel {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: var(--ag-radius);
  cursor: pointer;
  display: block;
  text-decoration: none;
  outline: none;
  transform-style: preserve-3d;
  transform-origin: center center;
  background: #0a0713;
  box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.8);
  will-change: flex-grow, transform;
  -webkit-tap-highlight-color: transparent;
}

.ag-panel:focus-visible {
  box-shadow:
    0 0 0 2px var(--ag-accent),
    0 10px 30px -18px rgba(0, 0, 0, 0.8);
}

.ag-panel__frame {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
}

.ag-panel__media {
  --ag-gray: 1;
  --ag-dim: 0.35;
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--ag-media-size);
  height: 100%;
  filter: grayscale(var(--ag-gray));
  will-change: transform, filter;
}

.accordion-gallery--vertical .ag-panel__media {
  width: 100%;
  height: var(--ag-media-size);
}

.ag-panel__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.ag-panel__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, transparent 45%, color-mix(in srgb, var(--ag-overlay) 78%, transparent) 100%),
    color-mix(in srgb, var(--ag-overlay) calc(var(--ag-dim, 0.35) * 100%), transparent);
}

.ag-panel__label {
  position: absolute;
  left: 20px;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: none;
  z-index: 2;
}

.ag-panel__bar {
  flex: 0 0 auto;
  width: 3px;
  height: 26px;
  border-radius: 3px;
  background: var(--ag-accent);
  opacity: 0;
  box-shadow: 0 0 12px color-mix(in srgb, var(--ag-accent) 60%, transparent);
}

.ag-panel__text {
  color: var(--ag-text);
  font-family: inherit;
  font-weight: 600;
  font-size: clamp(1rem, 1.4vw, 1.4rem);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.55);
}

@media (max-width: 520px) {
  .accordion-gallery {
    flex-direction: column;
    perspective: none;
    height: auto !important;
  }
  .ag-panel {
    min-height: 84px;
    transform: none !important;
  }
  .accordion-gallery .ag-panel__media {
    width: 100%;
    height: var(--ag-media-size);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ag-panel,
  .ag-panel__media {
    will-change: auto;
  }
}

/* == BlackWater patch ==================================================
   Upstream renders ONE horizontal label, visible only on the active panel,
   and requires an image per item. Three additions here:

     .ag-panel__vlabel   sideways title, shown while the panel is closed
     .ag-panel__desc     body copy, revealed with the active panel
     .ag-panel--plain    solid panel for items with no image

   All three are driven from the component's own GSAP timeline, so they
   stay in sync with the width animation rather than racing it.
   Re-apply if the component is ever reinstalled from the registry --
   \`npx shadcn@latest add @react-bits/AccordionGallery-JS-CSS\` overwrites
   the upstream half of this file. ====================================== */

.ag-panel__vlabel {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1.2rem;
  writing-mode: vertical-rl;
  transform: rotate(180deg);      /* reads bottom-to-top */
  color: var(--ag-text);
  font-family: inherit;
  font-weight: 700;
  font-size: clamp(0.82rem, 1.02vw, 1.02rem);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
  pointer-events: none;
  z-index: 2;
}

/* Title and description stack, so the label block can no longer be a
   single centred row. */
.ag-panel__label {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  top: clamp(1.3rem, 2.4vw, 1.9rem);
  justify-content: space-between;
}
.ag-panel__labelrow {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.ag-panel__num {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: color-mix(in srgb, var(--ag-text) 45%, transparent);
  opacity: 0;
}

.ag-panel__desc {
  margin: 0.9rem 0 0;
  max-width: 52ch;
  color: color-mix(in srgb, var(--ag-text) 60%, transparent);
  font-size: 0.9rem;
  line-height: 1.65;
  font-weight: 400;
  letter-spacing: 0;
  white-space: normal;
  text-shadow: none;
  opacity: 0;
}

/* Match the site's service type rather than the registry default. */
.ag-panel__text {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: clamp(1.3rem, 2.4vw, 2.3rem);
  letter-spacing: -0.025em;
  text-transform: uppercase;
  line-height: 1;
  text-shadow: none;
}

.ag-panel--plain { background: #141414; }
.ag-panel--plain .ag-panel__overlay { background: none; }

/* ── phones: a plain tap-to-open accordion ──
   Seven sideways slats stop being legible well before upstream's 520px
   breakpoint, so the stack starts at the site's own 860px boundary. */
@media (max-width: 860px) {
  .accordion-gallery {
    flex-direction: column;
    perspective: none;
    height: auto !important;
    gap: 8px;
  }

  /* Content-sized, not flex-sized. GSAP writes flex-grow for the horizontal
     layout and it means nothing once these are stacked in a column. */
  .ag-panel {
    flex: none !important;
    height: auto;
    min-height: 0;
    transform: none !important;
  }

  .ag-panel__vlabel { display: none; }

  /* The label defines the card's height here rather than floating over it. */
  .ag-panel__label {
    position: static;
    padding: 1.15rem 1.25rem;
  }

  /* Every title stays legible. GSAP fades these to 0 on inactive panels
     because the desktop layout hands over to the sideways label -- there is
     no sideways label on mobile, which left six blank black slabs. */
  .ag-panel__num,
  .ag-panel__bar,
  .ag-panel__text {
    opacity: 1 !important;
    transform: none !important;
  }

  .ag-panel__text {
    font-size: 1.05rem;
    white-space: normal;
  }

  /* Tap to open: the description is the only thing that collapses. */
  .ag-panel__desc {
    opacity: 1 !important;
    transform: none !important;
    max-height: 0;
    margin-top: 0;
    overflow: hidden;
    font-size: 0.88rem;
    transition: max-height 0.4s cubic-bezier(0.32, 0.72, 0, 1),
                margin-top 0.4s cubic-bezier(0.32, 0.72, 0, 1);
  }
  .ag-panel--active .ag-panel__desc {
    max-height: 26rem;
    margin-top: 0.85rem;
  }

  /* A caret, so it reads as something you can open. */
  .ag-panel__labelrow {
    position: relative;
    padding-right: 1.75rem;
  }
  .ag-panel__labelrow::after {
    content: '';
    position: absolute;
    right: 0.25rem;
    top: 50%;
    width: 8px;
    height: 8px;
    border-right: 2px solid rgba(255, 255, 255, 0.5);
    border-bottom: 2px solid rgba(255, 255, 255, 0.5);
    transform: translateY(-70%) rotate(45deg);
    transition: transform 0.3s ease;
  }
  .ag-panel--active .ag-panel__labelrow::after {
    transform: translateY(-20%) rotate(-135deg);
  }
}
`
