'use client';

import { useEffect, useMemo, useState } from 'react';

type HomeMotionProps = {
  children: React.ReactNode;
};

export function HomeMotion({ children }: HomeMotionProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const style = useMemo(
    () =>
      ({
        ['--home-scroll' as string]: `${Math.min(scrollY, 480)}px`,
        ['--hero-shift' as string]: `${Math.min(scrollY * 0.12, 28)}px`,
      }) as React.CSSProperties,
    [scrollY]
  );

  return (
    <div className="home-motion-shell" style={style}>
      {children}
    </div>
  );
}
