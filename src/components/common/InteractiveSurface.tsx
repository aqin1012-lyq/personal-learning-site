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
    const sweep = Math.min(0.88, Math.max(0.12, dx * 0.68 - dy * 0.28 + 0.5)).toFixed(4);
    const glintPitch = Math.min(1, Math.max(-1, dy * -1.65 + dx * 0.24)).toFixed(4);
    const glintYaw = Math.min(1, Math.max(-1, dx * 1.72 + dy * 0.18)).toFixed(4);

    event.currentTarget.style.setProperty('--pointer-x', `${x}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${y}px`);
    event.currentTarget.style.setProperty('--pointer-px', px.toFixed(4));
    event.currentTarget.style.setProperty('--pointer-py', py.toFixed(4));
    event.currentTarget.style.setProperty('--pointer-distance', distance.toFixed(4));
    event.currentTarget.style.setProperty('--pointer-sweep', sweep);
    event.currentTarget.style.setProperty('--pointer-glint-pitch', glintPitch);
    event.currentTarget.style.setProperty('--pointer-glint-yaw', glintYaw);
  }, []);

  const handleLeave = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', `-999px`);
    event.currentTarget.style.setProperty('--pointer-y', `-999px`);
    event.currentTarget.style.setProperty('--pointer-px', `0.5`);
    event.currentTarget.style.setProperty('--pointer-py', `0.5`);
    event.currentTarget.style.setProperty('--pointer-distance', `0`);
    event.currentTarget.style.setProperty('--pointer-sweep', `0.5`);
    event.currentTarget.style.setProperty('--pointer-glint-pitch', `0`);
    event.currentTarget.style.setProperty('--pointer-glint-yaw', `0`);
  }, []);

  const Component = as;

  return (
    <Component className={cn('interactive-surface', className)} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </Component>
  );
}
