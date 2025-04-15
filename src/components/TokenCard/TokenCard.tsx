import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cell, Avatar, Text } from '@telegram-apps/telegram-ui';
import './TokenCard.css';

interface TokenCardProps {
  tokenId: string;
  name: string;
  symbol: string;
  totalSupply: string;
  creatorAddress: string;
  iconUrl?: string;
  price?: number;
  change24h?: number;
  loading?: boolean;
}

export const TokenCard: FC<TokenCardProps> = ({
  tokenId,
  name,
  symbol,
  totalSupply,
  creatorAddress,
  iconUrl,
  price,
  change24h,
  loading = false
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!loading) {
      navigate(`/token/${tokenId}`);
    }
  };

  if (loading) {
    return (
      <div className="token-card token-card--loading">
        <div className="token-card__content">
          <div className="token-card__main-info">
            <div className="token-card__icon token-card__icon--skeleton" />
            <div className="token-card__text">
              <div className="token-card__name--skeleton" />
              <div className="token-card__symbol--skeleton" />
            </div>
          </div>
          <div className="token-card__details">
            <div className="token-card__info-item">
              <div className="token-card__label--skeleton" />
              <div className="token-card__value--skeleton" />
            </div>
            <div className="token-card__info-item">
              <div className="token-card__label--skeleton" />
              <div className="token-card__value--skeleton" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`token-card ${isHovered ? 'token-card--hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name} token`}
    >
      <div className="token-card__content">
        <div className="token-card__main-info">
          <Avatar 
            src={iconUrl} 
            alt={`${name} logo`}
            className="token-card__icon"
            width={48}
            height={48}
          />
          <div className="token-card__text">
            <h3 className="token-card__name">{name}</h3>
            <span className="token-card__symbol">{symbol}</span>
            {price && (
              <div className="token-card__price">
                <span className="token-card__price-value">${price.toFixed(6)}</span>
                {change24h && (
                  <span className={`token-card__change ${change24h >= 0 ? 'positive' : 'negative'}`}>
                    {change24h >= 0 ? '+' : ''}{change24h}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="token-card__details">
          <div className="token-card__info-item">
            <span className="token-card__label">Supply:</span>
            <span className="token-card__value">{totalSupply}</span>
          </div>
          <div className="token-card__info-item">
            <span className="token-card__label">Creator:</span>
            <span className="token-card__address">
              {creatorAddress.slice(0, 6)}...{creatorAddress.slice(-4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};