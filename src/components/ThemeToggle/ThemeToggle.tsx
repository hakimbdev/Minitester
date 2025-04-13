import React from 'react';
import { Cell, Section } from '@telegram-apps/telegram-ui';
import { useTheme } from '@/contexts/ThemeContext';
import { bem } from '@/css/bem';

import './ThemeToggle.css';

const [block, element] = bem('theme-toggle');

interface ThemeToggleProps {
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabels = true }) => {
  const { isDark } = useTheme();

  return (
    <div className={block()}>
      {showLabels && (
        <div className={element('title')}>
          Current Theme: {isDark ? 'Dark' : 'Light'}
        </div>
      )}
      <Section className={element('radio-group')}>
        <Cell 
          before={
            <div className={element('icon')}>
              {isDark ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 1V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 21V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.7479 21.1181 10.0795 20.7461C8.41113 20.3741 6.88717 19.5345 5.67476 18.3221C4.46236 17.1097 3.62272 15.5857 3.25073 13.9173C2.87874 12.2489 2.9896 10.5089 3.57034 8.90115C4.15108 7.29335 5.17773 5.88421 6.53003 4.83853C7.88234 3.79284 9.50454 3.15401 11.206 3C10.0341 4.34827 9.45785 6.08309 9.59528 7.82527C9.73272 9.56745 10.5747 11.1839 11.9291 12.2924C13.2834 13.4009 15.0326 13.9197 16.7775 13.7142C18.5225 13.5087 20.1125 12.5947 21.18 11.19C21.1842 11.3921 21.1869 11.5941 21.188 11.796L21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          } 
          selected={true}
        >
          {isDark ? 'Dark' : 'Light'} Theme
        </Cell>
      </Section>
    </div>
  );
}; 