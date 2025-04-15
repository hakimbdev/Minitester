import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useTonWallet, TonConnectButton } from '@tonconnect/ui-react';
import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';
import blockchainService from '@/services/blockchainService';

import { memepadLogo } from '@/assets/images';
import './MemePadPage.css';

const [block, element] = bem('meme-pad-page');

interface Token {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: number;
  marketCap: string;
  change24h: number;
  launchStatus: 'upcoming' | 'live' | 'recentlyAdded';
  progress?: number;
  owned?: number;
  tokenAddress?: string;
}

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

export const MemePadPage: FC = () => {
  const navigate = useNavigate();
  const wallet = useTonWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recentlyAdded'>('live');
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  
  // Buy modal state
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState<string>('');
  
  // Sell modal state
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [sellAmount, setSellAmount] = useState<string>('');
  const [sellAll, setSellAll] = useState<boolean>(false);

  useEffect(() => {
    // Mock data - replace with API call to blockchainService
    const loadTokens = async () => {
      try {
        const fetchedTokens = await blockchainService.getAllTokens();
        
        // If user has a wallet connected, fetch their token balances
        if (wallet) {
          const ownedTokens = await blockchainService.getTokensByOwner(wallet.account.address);
          // Merge owned token balances with fetched tokens
          const mergedTokens = fetchedTokens.map(token => {
            const ownedToken = ownedTokens.find(t => t.id === token.id);
            return {
              ...token,
              owned: ownedToken?.balance || 0
            };
          });
          setTokens(mergedTokens);
        } else {
          setTokens(fetchedTokens);
        }
      } catch (error) {
        console.error('Error loading tokens:', error);
      }
    };

    loadTokens();
  }, [wallet]); // Re-run when wallet changes

  const filteredTokens = tokens.filter(token => 
    (token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     token.symbol.toLowerCase().includes(searchQuery.toLowerCase())) &&
    token.launchStatus === activeTab
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (tab: 'live' | 'upcoming' | 'recentlyAdded') => {
    setActiveTab(tab);
  };

  const openBuyModal = (tokenId: string) => {
    // Check if wallet is connected before buying
    if (!wallet) {
      alert('Please connect your wallet to buy tokens');
      return;
    }

    const token = tokens.find(t => t.id === tokenId);
    
    if (!token) {
      alert('Token not found');
      return;
    }

    setSelectedToken(token);
    setBuyAmount('');
    setShowBuyModal(true);
  };

  const closeBuyModal = () => {
    setShowBuyModal(false);
    setSelectedToken(null);
    setBuyAmount('');
  };

  const handleBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal points
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setBuyAmount(value);
  };

  const calculateTokensForTON = () => {
    if (!buyAmount || !selectedToken) return '0';
    
    const amountNum = parseFloat(buyAmount);
    if (isNaN(amountNum)) return '0';
    
    const tokenAmount = amountNum / selectedToken.price;
    return tokenAmount.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const handleBuyToken = async () => {
    if (!wallet || !selectedToken || !buyAmount) {
      return;
    }

    try {
      setTransactionInProgress(true);
      
      if (!selectedToken.tokenAddress) {
        throw new Error('Token address is missing');
      }
      
      // Log the transaction attempt
      console.log(`Buying tokens: ${calculateTokensForTON()} ${selectedToken.symbol} for ${buyAmount} TON`);
      
      // Call the blockchain service
      const result = await blockchainService.buyTokens(
        wallet.account.address,
        selectedToken.tokenAddress,
        buyAmount
      );
      
      console.log('Buy transaction result:', result);
      
      if (result.success) {
        // Update token state to reflect ownership
        const tokensBought = Math.floor(parseFloat(buyAmount) / selectedToken.price);
        
        setTokens(prevTokens => 
          prevTokens.map(t => 
            t.id === selectedToken.id 
              ? { 
                  ...t, 
                  owned: (t.owned || 0) + tokensBought
                } 
              : t
          )
        );
        
        alert(`Successfully bought ${calculateTokensForTON()} ${selectedToken.symbol} tokens!`);
        closeBuyModal();
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error buying token:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setTransactionInProgress(false);
    }
  };

  const openSellModal = (tokenId: string) => {
    // Check if wallet is connected before selling
    if (!wallet) {
      alert('Please connect your wallet to sell tokens');
      return;
    }

    const token = tokens.find(t => t.id === tokenId);
    
    if (!token || !token.owned || token.owned <= 0) {
      alert('You don\'t own any of these tokens to sell');
      return;
    }

    setSelectedToken(token);
    setSellAmount('');
    setSellAll(false);
    setShowSellModal(true);
  };

  const closeSellModal = () => {
    setShowSellModal(false);
    setSelectedToken(null);
    setSellAmount('');
    setSellAll(false);
  };

  const handleSellAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setSellAmount(value);
  };

  const handleSellAllToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSellAll(e.target.checked);
    if (e.target.checked && selectedToken) {
      setSellAmount(selectedToken.owned?.toString() || '0');
    } else {
      setSellAmount('');
    }
  };

  const calculateTonAmount = () => {
    if (!sellAmount || !selectedToken) return '0';
    
    const amountNum = parseFloat(sellAmount);
    if (isNaN(amountNum)) return '0';
    
    const tonAmount = amountNum * selectedToken.price;
    return tonAmount.toFixed(6);
  };

  const handleSellToken = async () => {
    if (!wallet || !selectedToken || (!sellAmount && !sellAll)) {
      return;
    }

    if (!sellAll && parseInt(sellAmount) > (selectedToken.owned || 0)) {
      alert('You cannot sell more tokens than you own');
      return;
    }

    try {
      setTransactionInProgress(true);
      
      if (!selectedToken.tokenAddress) {
        throw new Error('Token address is missing');
      }
      
      const amountToSell = sellAll ? (selectedToken.owned || 0).toString() : sellAmount;
      console.log(`Selling ${sellAll ? 'all' : amountToSell} ${selectedToken.symbol} tokens`);
      
      // Call blockchain service to sell tokens
      const result = await blockchainService.sellTokens(
        wallet.account.address,
        selectedToken.tokenAddress,
        sellAll ? '' : sellAmount,
        sellAll
      );
      
      console.log('Sell transaction result:', result);
      
      if (result.success) {
        // Update token state to reflect reduced ownership
        setTokens(prevTokens => 
          prevTokens.map(token => 
            token.id === selectedToken.id 
              ? { 
                  ...token, 
                  owned: sellAll 
                    ? 0 
                    : Math.max(0, (token.owned || 0) - parseInt(sellAmount))
                } 
              : token
          )
        );
        
        alert(`Successfully sold ${sellAll ? 'all' : amountToSell} ${selectedToken.symbol} tokens!`);
        closeSellModal();
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error selling token:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleTokenDetails = (tokenId: string) => {
    console.log(`View details for token with ID: ${tokenId}`);
    navigate(`/token?id=${tokenId}`);
  };

  return (
    <Page>
      <div className={block()}>
        <div className={element('header')}>
          <div className={element('brand')}>
            <img src={memepadLogo} alt="Open MemePad Logo" className={element('logo')} />
            <div className={element('brand-text')}>
              <Title level="2">Open MemePad</Title>
              <Text className={element('slogan')}>
                Powering Token Launches on TON Blockchain!
              </Text>
            </div>
          </div>
        </div>
        
        <div className={element('tabs')}>
          <button 
            className={`${element('tab')} ${activeTab === 'live' ? element('tab-active') : ''}`} 
            onClick={() => handleTabChange('live')}
          >
            Live
          </button>
          <button 
            className={`${element('tab')} ${activeTab === 'upcoming' ? element('tab-active') : ''}`} 
            onClick={() => handleTabChange('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`${element('tab')} ${activeTab === 'recentlyAdded' ? element('tab-active') : ''}`} 
            onClick={() => handleTabChange('recentlyAdded')}
          >
            Recently Added
          </button>
        </div>

        <div className={element('search')}>
          <div className={element('search-container')}>
            <input
              type="text"
              className={element('search-input')}
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name or symbol"
            />
            <div className={element('search-icon')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 14L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <List>
          {filteredTokens.length > 0 ? (
            filteredTokens.map(token => (
              <Section key={token.id} className={element('token-card')}>
                <Cell
                  before={
                    <Avatar src={token.iconUrl} alt={`${token.name} logo`} width={48} height={48} />
                  }
                  subtitle={
                    <div className={element('token-info')}>
                      <Text>{token.symbol}</Text>
                      {token.owned && token.owned > 0 && (
                        <Text className={element('owned-amount')}>You own: {token.owned.toLocaleString()}</Text>
                      )}
                    </div>
                  }
                  after={
                    <div className={element('price-info')}>
                      <Text className={element('price')}>${token.price.toFixed(5)}</Text>
                      <Text className={`${element('change')} ${token.change24h >= 0 ? element('positive') : element('negative')}`}>
                        {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                      </Text>
                    </div>
                  }
                  onClick={() => handleTokenDetails(token.id)}
                >
                  <Title level="3">{token.name}</Title>
                </Cell>
                {token.progress !== undefined && token.progress < 100 && (
                  <div className={element('progress-container')}>
                    <Progress value={token.progress} />
                    <Text className={element('progress-text')}>{token.progress}% Filled</Text>
                  </div>
                )}
                <div className={element('action-buttons')}>
                  <Button 
                    className={element('buy-button')}
                    onClick={() => openBuyModal(token.id)}
                    loading={transactionInProgress}
                    disabled={transactionInProgress}
                  >
                    Buy
                  </Button>
                  {token.owned && token.owned > 0 ? (
                    <Button 
                      className={element('sell-button')}
                      onClick={() => openSellModal(token.id)}
                      loading={transactionInProgress}
                      disabled={transactionInProgress}
                    >
                      Sell
                    </Button>
                  ) : (
                    <Button 
                      className={element('details-button')}
                      onClick={() => handleTokenDetails(token.id)}
                    >
                      Details
                    </Button>
                  )}
                </div>
              </Section>
            ))
          ) : (
            <div className={element('empty-state')}>
              <Text>No tokens found</Text>
            </div>
          )}
        </List>

        {/* Buy Modal */}
        {showBuyModal && selectedToken && (
          <div className={element('modal-overlay')}>
            <div className={element('modal')}>
              <div className={element('modal-header')}>
                <Title level="3">Buy {selectedToken.name}</Title>
                <button 
                  className={element('modal-close')} 
                  onClick={closeBuyModal}
                  disabled={transactionInProgress}
                >
                  ✕
                </button>
              </div>
              
              <div className={element('modal-content')}>
                <div className={element('token-price')}>
                  <Text>Price: ${selectedToken.price.toFixed(6)} per token</Text>
                </div>
                
                <div className={element('input-group')}>
                  <label className={element('input-label')}>Amount to spend (TON)</label>
                  <input
                    type="text"
                    className={element('input')}
                    value={buyAmount}
                    onChange={handleBuyAmountChange}
                    placeholder="0.0"
                    disabled={transactionInProgress}
                  />
                </div>
                
                <div className={element('token-amount')}>
                  <Text>You will receive: {calculateTokensForTON()} {selectedToken.symbol}</Text>
                </div>
                
                <div className={element('modal-actions')}>
                  <Button
                    className={element('cancel-button')}
                    onClick={closeBuyModal}
                    disabled={transactionInProgress}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={element('confirm-buy-button')}
                    onClick={handleBuyToken}
                    loading={transactionInProgress}
                    disabled={
                      transactionInProgress || 
                      !buyAmount || 
                      parseFloat(buyAmount) <= 0
                    }
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sell Modal */}
        {showSellModal && selectedToken && (
          <div className={element('modal-overlay')}>
            <div className={element('modal')}>
              <div className={element('modal-header')}>
                <Title level="3">Sell {selectedToken.name}</Title>
                <button 
                  className={element('modal-close')} 
                  onClick={closeSellModal}
                  disabled={transactionInProgress}
                >
                  ✕
                </button>
              </div>
              
              <div className={element('modal-content')}>
                <div className={element('token-balance')}>
                  <Text>Your balance: {selectedToken.owned?.toLocaleString()} {selectedToken.symbol}</Text>
                </div>
                
                <div className={element('sell-all-toggle')}>
                  <Text>Sell all tokens</Text>
                  <Switch 
                    checked={sellAll}
                    onChange={handleSellAllToggle}
                  />
                </div>
                
                {!sellAll && (
                  <div className={element('input-group')}>
                    <label className={element('input-label')}>Amount to sell</label>
                    <input
                      type="text"
                      className={element('input')}
                      value={sellAmount}
                      onChange={handleSellAmountChange}
                      placeholder="0"
                      disabled={sellAll || transactionInProgress}
                    />
                  </div>
                )}
                
                <div className={element('token-amount')}>
                  <Text>You will receive: {sellAll && selectedToken.owned 
                    ? (selectedToken.owned * selectedToken.price).toFixed(6) 
                    : calculateTonAmount()} TON</Text>
                </div>
                
                <div className={element('modal-actions')}>
                  <Button
                    className={element('cancel-button')}
                    onClick={closeSellModal}
                    disabled={transactionInProgress}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={element('confirm-sell-button')}
                    onClick={handleSellToken}
                    loading={transactionInProgress}
                    disabled={
                      transactionInProgress || 
                      (!sellAll && (!sellAmount || parseInt(sellAmount) <= 0 || parseInt(sellAmount) > (selectedToken.owned || 0)))
                    }
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};