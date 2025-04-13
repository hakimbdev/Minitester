import React from 'react';

// Breakpoints in pixels
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
} as const;

// Media query utility functions
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile}px)`,
  tablet: `@media (min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px)`,
  laptop: `@media (min-width: ${breakpoints.tablet + 1}px) and (max-width: ${breakpoints.laptop}px)`,
  desktop: `@media (min-width: ${breakpoints.laptop + 1}px)`,
  mobileAndTablet: `@media (max-width: ${breakpoints.tablet}px)`,
  tabletAndUp: `@media (min-width: ${breakpoints.mobile + 1}px)`,
  tabletAndLaptop: `@media (min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.laptop}px)`,
  laptopAndUp: `@media (min-width: ${breakpoints.tablet + 1}px)`,
} as const;

// Helper to detect current screen size
export const getDeviceType = (): 'mobile' | 'tablet' | 'laptop' | 'desktop' => {
  const width = window.innerWidth;
  
  if (width <= breakpoints.mobile) {
    return 'mobile';
  } else if (width <= breakpoints.tablet) {
    return 'tablet';
  } else if (width <= breakpoints.laptop) {
    return 'laptop';
  } else {
    return 'desktop';
  }
};

// Utility hook for responsive design
export const useResponsive = () => {
  const [deviceType, setDeviceType] = React.useState(getDeviceType());
  
  React.useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isLaptop: deviceType === 'laptop',
    isDesktop: deviceType === 'desktop',
    isMobileOrTablet: deviceType === 'mobile' || deviceType === 'tablet',
    isTabletOrLaptop: deviceType === 'tablet' || deviceType === 'laptop',
    isLaptopOrDesktop: deviceType === 'laptop' || deviceType === 'desktop',
  };
}; 