import { FC, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Cell,
  List,
  Progress,
  Section,
  Text,
  Title,
} from '@telegram-apps/telegram-ui';
import { useTonWallet } from '@tonconnect/ui-react';
import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';
import blockchainService from '@/services/blockchainService';

import './TokenDetailPage.css';

// Custom TabsItem interface
interface TabsItem {
  title: string;
  value: string;
}

// Custom Tabs component
const Tabs: FC<{
  items: TabsItem[];
  activeItem: string;
  onChange: (value: string) => void;
}> = ({ items, activeItem, onChange }) => {
  return (
    <div className="custom-tabs">
      <div className="custom-tabs-buttons">
        {items.map((item) => (
          <button
            key={item.value}
            className={`custom-tab-button ${activeItem === item.value ? 'active' : ''}`}
            onClick={() => onChange(item.value)}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};

// Custom Switch component
const Switch: FC<{
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ checked, onChange }) => {
  return (
    <label className="custom-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="custom-switch-slider"></span>
    </label>
  );
};

const [block, element] = bem('token-detail-page');

interface TokenDetail {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: number;
  marketCap: string;
  change24h: number;
  launchStatus: 'upcoming' | 'live' | 'ended';
  progress?: number;
  description: string;
  tokenAddress: string;
  totalSupply: string;
  website: string;
  telegram: string;
  twitter: string;
}

export const TokenDetailPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const wallet = useTonWallet();
  const [token, setToken] = useState<TokenDetail | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [sellAll, setSellAll] = useState<boolean>(false);
  const [ownedTokens, setOwnedTokens] = useState<number>(0);
  const [tonBalance, setTonBalance] = useState<string>('0');

  // Get token ID from URL
  const tokenId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    // In a real app, this would be an API call
    // Mock data for demonstration
    if (tokenId) {
      const mockToken: TokenDetail = {
        id: tokenId,
        name: 'TonDoge',
        symbol: 'TDOGE',
        iconUrl: 'https://placehold.co/100x100',
        price: 0.00032,
        marketCap: '$1.2M',
        change24h: 12.5,
        launchStatus: 'live',
        progress: 75,
        description: 'TonDoge is a community-driven meme token on the TON blockchain. The project aims to bring fun and utility to the TON ecosystem.',
        tokenAddress: 'EQCBszTNaBYaXRtWY_MjqR6Wn-_qvcvRZWYLdZ-6upPP-z3u',
        totalSupply: '100,000,000,000',
        website: 'https://tondoge.example.com',
        telegram: 'https://t.me/tondoge',
        twitter: 'https://twitter.com/tondoge',
      };
      
      setToken(mockToken);
    }
  }, [tokenId]);

  // Load wallet data when wallet and token are available
  useEffect(() => {
    if (wallet && token) {
      loadWalletData();
    }
  }, [wallet, token]);

  const loadWalletData = async () => {
    if (!wallet || !token) return;

    try {
      // In real implementation, these would fetch from blockchain
      setOwnedTokens(Math.floor(Math.random() * 5000000) + 1000000);
      
      // Get TON balance
      const balance = await blockchainService.getTONBalance(wallet.account.address);
      setTonBalance(balance);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal points
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const calculateTokenAmount = () => {
    if (!amount || !token) return '0';
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return '0';
    
    const tokenAmount = amountNum / token.price;
    return tokenAmount.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const calculateTonAmount = () => {
    if (!amount || !token) return '0';
    
    const tokenAmountNum = parseFloat(amount);
    if (isNaN(tokenAmountNum)) return '0';
    
    const tonAmount = tokenAmountNum * token.price;
    return tonAmount.toFixed(6);
  };

  const handleBuy = async () => {
    if (!wallet || !token || !amount) return;
    
    setIsLoading(true);
    
    try {
      // Call the blockchain service to buy tokens
      console.log(`Buying ${calculateTokenAmount()} ${token.symbol} for ${amount} TON`);
      
      // Use blockchain service for the transaction
      if (token.tokenAddress) {
        const result = await blockchainService.buyTokens(
          wallet.account.address,
          token.tokenAddress,
          amount
        );
        
        console.log('Transaction result:', result);
        
        if (result.success) {
          // Update balances after successful purchase
          setOwnedTokens(prev => prev + parseInt(calculateTokenAmount().replace(/,/g, '')));
          
          // Success
          alert(`Successfully purchased ${calculateTokenAmount()} ${token.symbol}!`);
          setAmount('');
          
          // Refresh wallet data
          loadWalletData();
        } else {
          throw new Error('Transaction failed');
        }
      } else {
        throw new Error('Token address is missing');
      }
    } catch (error) {
      console.error('Error buying token:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSell = async () => {
    if (!wallet || !token) return;
    
    setIsLoading(true);
    
    try {
      // If sellAll is true, amount is ignored and all tokens are sold
      const amountToSell = sellAll ? ownedTokens.toString() : amount;
      console.log(`Selling ${sellAll ? 'all' : amountToSell} ${token.symbol} for ${calculateTonAmount()} TON`);
      
      if (!token.tokenAddress) {
        throw new Error('Token address is missing');
      }
      
      // Call blockchain service to sell tokens
      const result = await blockchainService.sellTokens(
        wallet.account.address,
        token.tokenAddress,
        sellAll ? '' : amount,
        sellAll
      );
      
      console.log('Sell transaction result:', result);
      
      if (result.success) {
        // Update balances after successful sale
        if (sellAll) {
          setOwnedTokens(0);
        } else {
          setOwnedTokens(prev => prev - parseInt(amount));
        }
        
        // Success
        alert(`Successfully sold ${sellAll ? 'all' : amountToSell} ${token.symbol}!`);
        setAmount('');
        setSellAll(false);
        
        // Refresh wallet data
        loadWalletData();
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error selling token:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'buy' | 'sell');
    setAmount('');
    setSellAll(false);
  };

  const handleSellAllToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSellAll(e.target.checked);
    if (e.target.checked) {
      setAmount(ownedTokens.toString());
    } else {
      setAmount('');
    }
  };

  if (!token) {
    return (
      <Page>
        <div className={block()}>
          <div className={element('header')}>
            <button onClick={handleBack}>Back</button>
            <Title level="2">Token Detail</Title>
          </div>
          <div className={block('loading')}>
            <Text>Loading...</Text>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className={block()}>
        <div className={element('header')}>
          <button onClick={handleBack}>Back</button>
          <Title level="2">Token Detail</Title>
        </div>
        
        <div className={element('token-header')}>
          <Avatar src={token.iconUrl} alt={`${token.name} logo`} width={64} height={64} />
          <div className={element('header-info')}>
            <Title level="3">{token.name}</Title>
            <Text>{token.symbol}</Text>
          </div>
          <div className={element('price-info')}>
            <Text className={element('price')}>${token.price.toFixed(6)}</Text>
            <Text className={`${element('change')} ${token.change24h >= 0 ? element('positive') : element('negative')}`}>
              {token.change24h >= 0 ? '+' : ''}{token.change24h}%
            </Text>
          </div>
        </div>

        {wallet && (
          <div className={element('wallet-info')}>
            <div className={element('balance-item')}>
              <Text className={element('balance-label')}>Your Balance:</Text>
              <Text className={element('balance-value')}>{ownedTokens.toLocaleString()} {token.symbol}</Text>
            </div>
            <div className={element('balance-item')}>
              <Text className={element('balance-label')}>TON Balance:</Text>
              <Text className={element('balance-value')}>{tonBalance} TON</Text>
            </div>
          </div>
        )}

        {token.progress !== undefined && (
          <div className={element('progress-section')}>
            <Progress value={token.progress} />
            <div className={element('progress-info')}>
              <Text>{token.progress}% Filled</Text>
              <Text className={element('market-cap')}>{token.marketCap}</Text>
            </div>
          </div>
        )}

        <List>
          <Section header="About">
            <Cell multiline>
              <Text>{token.description}</Text>
            </Cell>
          </Section>

          <Section header="Token Info">
            <Cell title="Contract Address" multiline>
              <Text className={element('address')}>{token.tokenAddress}</Text>
            </Cell>
            <Cell title="Total Supply">
              <Text>{token.totalSupply}</Text>
            </Cell>
            <Cell title="Launch Status">
              <Text className={element('status')}>{token.launchStatus.charAt(0).toUpperCase() + token.launchStatus.slice(1)}</Text>
            </Cell>
          </Section>

          <Section header="Links">
            <Cell title="Website">
              <Text className={element('link')}>{token.website}</Text>
            </Cell>
            <Cell title="Telegram">
              <Text className={element('link')}>{token.telegram}</Text>
            </Cell>
            <Cell title="Twitter">
              <Text className={element('link')}>{token.twitter}</Text>
            </Cell>
          </Section>

          {token.launchStatus === 'live' && wallet && (
            <Section header="Trade Token">
              <div className={element('trade-form')}>
                <Tabs
                  items={[
                    { title: 'Buy', value: 'buy' },
                    { title: 'Sell', value: 'sell' },
                  ]}
                  activeItem={activeTab}
                  onChange={handleTabChange}
                />
                
                {activeTab === 'buy' ? (
                  <>
                    <div className={element('input-group')}>
                      <label className={element('input-label')}>Amount (TON)</label>
                      <input
                        type="text"
                        className={element('input')}
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0.0"
                      />
                    </div>
                    
                    <div className={element('token-amount')}>
                      <Text>You will receive: {calculateTokenAmount()} {token.symbol}</Text>
                    </div>
                    
                    <Button
                      className={element('buy-button')}
                      onClick={handleBuy}
                      loading={isLoading}
                      disabled={!amount || parseFloat(amount) <= 0 || !wallet}
                    >
                      Buy Token
                    </Button>
                  </>
                ) : (
                  <>
                    <div className={element('sell-all-toggle')}>
                      <Text>Sell all tokens</Text>
                      <Switch 
                        checked={sellAll}
                        onChange={handleSellAllToggle}
                      />
                    </div>
                    
                    {!sellAll && (
                      <div className={element('input-group')}>
                        <label className={element('input-label')}>Amount ({token.symbol})</label>
                        <input
                          type="text"
                          className={element('input')}
                          value={amount}
                          onChange={handleAmountChange}
                          placeholder="0"
                          disabled={sellAll}
                        />
                      </div>
                    )}
                    
                    <div className={element('token-amount')}>
                      <Text>You will receive: {sellAll ? (ownedTokens * token.price).toFixed(6) : calculateTonAmount()} TON</Text>
                    </div>
                    
                    <Button
                      className={element('sell-button')}
                      onClick={handleSell}
                      loading={isLoading}
                      disabled={(!amount && !sellAll) || (parseFloat(amount) <= 0 && !sellAll) || !wallet || ownedTokens <= 0 || (parseFloat(amount) > ownedTokens)}
                    >
                      Sell Token
                    </Button>
                  </>
                )}
              </div>
            </Section>
          )}

          {token.launchStatus === 'live' && !wallet && (
            <Section header="Trade Token">
              <div className={element('connect-wallet-prompt')}>
                <Text>Connect your wallet to buy or sell tokens</Text>
              </div>
            </Section>
          )}
        </List>
      </div>
    </Page>
  );
}; 