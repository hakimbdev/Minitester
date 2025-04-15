const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = (): boolean => {
  return motionQuery.matches;
};

export const getTransitionStyles = (duration: number = 300): string => {
  return prefersReducedMotion() ? '0ms' : `${duration}ms`;
};

export const getAnimationStyles = (animationName: string, duration: number = 300): string => {
  return prefersReducedMotion() ? 'none' : `${animationName} ${duration}ms var(--transition-base)`;
};