/* ScrollExpand stylesheet, held as a string.

   Kept in JS rather than a .css file for the same reason as
   AccordionGallery: a .css import makes Vite emit a second file per
   chunk, and that broke on the apex domain. See App.jsx for the full
   write-up. Edit here.

   Keep this file free of backticks, backslashes and dollar-brace: the
   whole stylesheet sits inside one template literal. */
export const SE_CSS = `.scroll-expand {
  position: relative;
  width: 100%;
  height: 100%;
}

.scroll-expand--scroller {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior: contain;
}

.scroll-expand--scroller::-webkit-scrollbar {
  display: none;
}

.scroll-expand__track {
  position: relative;
  width: 100%;
}

.scroll-expand__stage {
  position: sticky;
  top: 0;
  width: 100%;
  overflow: hidden;
  --se-title-size: 4rem;
}

.scroll-expand__frame {
  position: absolute;
  inset: 0;
  clip-path: inset(21% 29% 21% 29% round 24px);
  will-change: clip-path;
}

.scroll-expand__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  transform-origin: center;
  user-select: none;
  -webkit-user-drag: none;
}

.scroll-expand__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.1) 45%, rgba(0, 0, 0, 0.35));
  opacity: 0;
}

.scroll-expand__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6%;
  opacity: 0;
  will-change: opacity, transform;
}

.scroll-expand__title {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 6%;
  text-align: center;
  font-size: var(--se-title-size);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #fff;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45);
  pointer-events: none;
  will-change: opacity, transform;
}

.scroll-expand__hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1.25rem;
  text-align: center;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.55);
  pointer-events: none;
  will-change: opacity, transform;
}

/* == BlackWater patch ==================================================
   Upstream animates a single image. This section crossfades a sharp
   portrait into a pre-blurred copy of the same frame as the window opens,
   so the copy that fades in at the end lands on blur instead of on a face.

   Added:
     .scroll-expand__media--blur   the second image, faded in by progress
     .scroll-expand__scrim--light  white scrim, for dark text on a light plate

   Re-apply if the component is reinstalled from the registry: the shadcn
   add command overwrites the upstream half of this file.
   ====================================================================== */

.scroll-expand__media--blur {
  opacity: 0;
  will-change: transform, opacity;
}

/* Upstream's scrim is a black gradient, which is backwards here: the blurred
   plate is near-white, so it needs lifting toward white to carry ink text,
   not darkening. */
.scroll-expand__scrim--light {
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.92),
    rgba(255, 255, 255, 0.55) 45%,
    rgba(255, 255, 255, 0.78)
  );
}

.scroll-expand__hint--dark { color: rgba(20, 20, 20, 0.45); }

@media (prefers-reduced-motion: reduce) {
  .scroll-expand__media { will-change: auto; }
}
`
