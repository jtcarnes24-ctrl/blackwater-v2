/* ScrollStack stylesheet, held as a string.

   Kept in JS rather than a .css file for the same reason as the other
   vendored components: a .css import makes Vite emit a second file per
   chunk, and that broke on the apex domain. See App.jsx.

   Keep this file free of backticks, backslashes and dollar-brace: the
   whole stylesheet sits inside one template literal. */
export const SS_CSS = `.scroll-stack-scroller {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: visible;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: scroll-position;
}

.scroll-stack-inner {
  padding: 20vh 5rem 50rem;
  min-height: 100vh;
}

.scroll-stack-card-wrapper {
  position: relative;
}

.scroll-stack-card {
  transform-origin: top center;
  will-change: transform, filter;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  height: 20rem;
  width: 100%;
  margin: 30px 0;
  padding: 3rem;
  border-radius: 40px;
  box-sizing: border-box;
  /* Improve mobile performance */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  position: relative;
}

.scroll-stack-end {
  width: 100%;
  height: 1px;
}

/* == BlackWater patch ==================================================
   Upstream is built to scroll inside its own container. Here it runs on the
   page's own scroll, on a black section with white cards.

   Added:
     .scroll-stack-scroller--window  neutralises the nested scroller
     .scroll-stack-card--light       the white card face
   Changed: inner padding, card height, and the card shadow.

   Re-apply if the component is reinstalled from the registry: the shadcn
   add command overwrites the upstream half of this file.
   ====================================================================== */

/* In window-scroll mode this element must not be a scroll container of its
   own, or the page gets a second scrollbar and the pinning maths, which is
   measured against the window, drifts. */
.scroll-stack-scroller--window {
  height: auto;
  overflow: visible;
  will-change: auto;
  transform: none;
}

.scroll-stack-scroller--window .scroll-stack-inner {
  padding: 6vh clamp(1.25rem, 5vw, 4rem) 28rem;
  min-height: 0;
  max-width: 78rem;
  margin: 0 auto;
}

.scroll-stack-card--light {
  height: auto;
  min-height: 17rem;
  background: #ffffff;
  color: #141414;
  border-radius: clamp(20px, 2.4vw, 34px);
  padding: clamp(1.75rem, 3.4vw, 3rem);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.9rem;
}

.scroll-stack-card--light .ss-num {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: rgba(20, 20, 20, 0.38);
  margin: 0;
}

.scroll-stack-card--light .ss-title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  letter-spacing: -0.025em;
  line-height: 1.02;
  text-transform: uppercase;
  margin: 0;
}

.scroll-stack-card--light .ss-desc {
  font-size: clamp(0.88rem, 1.05vw, 1rem);
  line-height: 1.65;
  color: rgba(20, 20, 20, 0.62);
  max-width: 60ch;
  margin: 0;
}

@media (max-width: 860px) {
  .scroll-stack-scroller--window .scroll-stack-inner {
    padding: 4vh 1.25rem 20rem;
  }
  .scroll-stack-card--light { min-height: 15rem; }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-stack-card { will-change: auto; }
}
`
