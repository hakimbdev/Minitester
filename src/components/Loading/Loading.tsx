import { FC } from 'react';
import { Text } from '@telegram-apps/telegram-ui';
import './Loading.css';

interface LoadingProps {
  text?: string;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Loading: FC<LoadingProps> = ({
  text = 'Loading...',
  showProgress = false,
  size = 'medium'
}) => {
  const sizeMap = {
    small: { spinner: 24, text: 13 },
    medium: { spinner: 40, text: 15 },
    large: { spinner: 56, text: 17 }
  };

  return (
    <div className="loading">
      <div 
        className="loading__spinner"
        style={{ 
          width: sizeMap[size].spinner, 
          height: sizeMap[size].spinner 
        }}
      />
      <Text 
        className="loading__text"
        style={{ fontSize: sizeMap[size].text }}
      >
        {text}
      </Text>
      {showProgress && (
        <div className="loading__progress">
          <div className="loading__progress-bar" />
        </div>
      )}
    </div>
  );
};