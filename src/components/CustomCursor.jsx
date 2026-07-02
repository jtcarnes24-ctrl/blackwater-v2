import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rafId;
    let x = 0, y = 0;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
    };

    const loop = () => {
      if (ref.current) {
        ref.current.style.left = x + 'px';
        ref.current.style.top = y + 'px';
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    const addHover = () => document.body.classList.add('cursor-hovering');
    const removeHover = () => document.body.classList.remove('cursor-hovering');
    const targets = document.querySelectorAll('a, button');
    targets.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ref} className="cursor-ball hidden md:block" />;
}
