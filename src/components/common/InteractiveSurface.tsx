'use client';

import { useCallback } from 'react';
import { cn } from '@/lib/utils';

type InteractiveSurfaceProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section';
};

export function InteractiveSurface({ children, className, as = 'div' }: InteractiveSurfaceProps) {
  const handleMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = rect.width ? x / rect.width : 0.5;
    const py = rect.height ? y / rect.height : 0.5;
    const dx = px - 0.5;
    const dy = py - 0.5;
    const distance = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 1.9);
    const sweep = (dx * 0.78 - dy * 0.42 + 0.5).toFixed(4);

    event.currentTarget.style.setProperty('--pointer-x', `${x}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${y}px`);
    event.currentTarget.style.setProperty('--pointer-px', px.toFixed(4));
    event.currentTarget.style.setProperty('--pointer-py', py.toFixed(4));
    event.currentTarget.style.setProperty('--pointer-distance', distance.toFixed(4));
    event.currentTarget.style.setProperty('--pointer-sweep', sweep);
  }, []);

  const handleLeave = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', `-999px`);
    event.currentTarget.style.setProperty('--pointer-y', `-999px`);
    event.currentTarget.style.setProperty('--pointer-px', `0.5`);
    event.currentTarget.style.setProperty('--pointer-py', `0.5`);
    event.currentTarget.style.setProperty('--pointer-distance', `0`);
    event.currentTarget.style.setProperty('--pointer-sweep', `0.5`);
  }, []);

  const Component = as;

  return (
    <Component className={cn('interactive-surface', className)} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </Component>
  );
}
