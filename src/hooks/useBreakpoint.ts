import { useEffect, useState } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const widths = {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
  };

  function updateBreakpoint() {
    const width = window.innerWidth;
    setWindowWidth(width);
    setBreakpoint(getBreakpoint(width));
  }

  function getBreakpoint(width: number): Breakpoint {
    if (width < widths.xs) return 'xs';
    else if (width < widths.sm) return 'sm';
    else if (width < widths.md) return 'md';
    else if (width < widths.lg) return 'lg';
    return 'xl';
  }

  const is = (bp: Breakpoint) => bp === breakpoint;

  const isXs = () => is('xs');
  const isSm = () => is('sm');
  const isMd = () => is('md');
  const isLg = () => is('lg');
  const isXl = () => is('xl');

  useEffect(() => {
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    windowWidth,
    is: (bp: string) => breakpoint === bp,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
  };
}
