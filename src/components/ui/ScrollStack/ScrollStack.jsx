import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

import { SS_CSS } from './ScrollStack.styles';

/* Vendored from the React Bits registry
   (`npx shadcn@latest add @react-bits/ScrollStack-JS-CSS`) and then patched.

   Upstream creates its OWN Lenis instance. This app already runs one, wired
   to GSAP's ticker and ScrollTrigger in App.jsx, so a second one would mean
   two smooth-scrollers fighting over the same window scroll plus a second
   rAF loop running forever. The patch subscribes to the existing instance
   instead, and only falls back to a plain scroll listener if there isn't one.

   Also patched, all marked `BW patch`:
     - `useWindowScroll` no longer leaves the wrapper as a nested scroller
     - the CSS lives in ScrollStack.styles.js, not a .css file

   Re-applying the registry command overwrites this file. */

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  const offsetsRef = useRef({ cards: [], end: 0 });   // BW patch

  /* BW patch: document-relative position from the offsetTop chain.

     This is LAYOUT position, so it is unaffected by the transforms this
     component applies. getBoundingClientRect is not: it reports where the
     element currently PAINTS, which already includes last frame's
     translateY. Feeding that back in as this frame's input makes the pinned
     cards oscillate -- the shake. Upstream's non-window path uses offsetTop
     and is fine; only the window path had the bug. */
  const layoutOffset = useCallback(el => {
    let y = 0;
    let node = el;
    while (node) {
      y += node.offsetTop;
      node = node.offsetParent;
    }
    return y;
  }, []);

  /* Measured once, then only on resize. Card positions do not move during
     scroll, so re-reading them every frame was also forcing a layout per
     card per frame -- and per card SQUARED once blurAmount is set, because
     the blur pass walks every card inside the per-card loop. */
  const measureOffsets = useCallback(() => {
    const cards = cardsRef.current;
    const endEl = scrollerRef.current?.querySelector('.scroll-stack-end');
    offsetsRef.current = {
      cards: cards.map(c => (useWindowScroll ? layoutOffset(c) : c.offsetTop)),
      end: endEl ? (useWindowScroll ? layoutOffset(endEl) : endEl.offsetTop) : 0
    };
  }, [useWindowScroll, layoutOffset]);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElementTop = offsetsRef.current.end;   // BW patch: cached

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = offsetsRef.current.cards[i];   // BW patch: cached
      if (cardTop == null) return;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = offsetsRef.current.cards[j];   // BW patch: cached
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  /* BW patch: returns a teardown function rather than storing a Lenis it
     owns. In window mode it borrows the app's instance and never constructs
     one, so there is still exactly one smooth-scroller and one rAF loop on
     the page. */
  const setupScroll = useCallback(() => {
    if (useWindowScroll) {
      const shared = typeof window !== 'undefined' ? window.__lenis : null;
      if (shared) {
        shared.on('scroll', handleScroll);
        return () => shared.off('scroll', handleScroll);
      }
      // No global instance (or it has not mounted yet): plain listener. The
      // maths only ever reads window.scrollY, so this is a complete fallback.
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const scroller = scrollerRef.current;
    if (!scroller) return () => {};

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector('.scroll-stack-inner'),
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      gestureOrientationHandler: true,
      normalizeWheel: true,
      wheelMultiplier: 1,
      touchInertiaMultiplier: 35,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertia: 0.6
    });

    lenis.on('scroll', handleScroll);

    const raf = time => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // BW patch: scoped to this instance, not the whole document, so two
    // stacks on one page cannot capture each other's cards.
    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      // transform only: blur is off, and promoting for a filter that never
      // changes just costs GPU memory on every card.
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    measureOffsets();          // BW patch: before the first transform
    const teardown = setupScroll();

    updateCardTransforms();

    // Card offsets are measured once here, so anything that changes layout
    // afterwards (fonts landing, images above resolving) has to re-measure.
    const remeasure = () => {
      measureOffsets();
      updateCardTransforms();
    };
    const ro = new ResizeObserver(remeasure);
    ro.observe(scroller);
    window.addEventListener('resize', remeasure);
    // Web fonts landing reflows the cards after the first measurement.
    if (document.fonts?.ready) document.fonts.ready.then(remeasure).catch(() => {});

    return () => {
      teardown?.();
      ro.disconnect();
      window.removeEventListener('resize', remeasure);
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupScroll,
    updateCardTransforms,
    measureOffsets
  ]);

  return (
    <>
      <style>{SS_CSS}</style>
      <div
        className={`scroll-stack-scroller${useWindowScroll ? ' scroll-stack-scroller--window' : ''} ${className}`.trim()}
        ref={scrollerRef}
      >
        <div className="scroll-stack-inner">
          {children}
          {/* Spacer so the last pin can release cleanly */}
          <div className="scroll-stack-end" />
        </div>
      </div>
    </>
  );
};

export default ScrollStack;
