import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Cell,
  List,
  Section,
  Text,
  Title,
} from '@telegram-apps/telegram-ui';
import { useTonWallet, TonConnectButton } from '@tonconnect/ui-react';
import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';

import './MyTokensPage.css';

const [block, element] = bem('my-tokens-page');

interface MyToken {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  amount: string;
  value: number;
  price: number;
  change24h: number;
}

export const MyTokensPage: FC = () => {
  const navigate = useNavigate();
  const wallet = useTonWallet();
  const [myTokens, setMyTokens] = useState<MyToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (wallet) {
      // In a real app, this would be an API call to fetch the user's tokens
      // Mock data for demonstration
      const mockTokens: MyToken[] = [
        {
          id: '1',
          name: 'TonDoge',
          symbol: 'TDOGE',
          iconUrl: 'https://placehold.co/100x100',
          amount: '1,250,000',
          value: 400.0,
          price: 0.00032,
          change24h: 12.5,
        },
        {
          id: '2',
          name: 'MemeRocket',
          symbol: 'MRKT',
          iconUrl: 'https://placehold.co/100x100',
          amount: '3,500,000',
          value: 525.0,
          price: 0.00015,
          change24h: -5.3,
        },
        {
          id: '5',
          name: 'MyTestToken',
          symbol: 'MTT',
          iconUrl: 'https://placehold.co/100x100',
          amount: '100,000,000',
          value: 100.0, 
          price: 0.000001,
          change24h: 0.0,
        },
      ];
      
      // Simulate API call delay
      setTimeout(() => {
        setMyTokens(mockTokens);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [wallet]);

  const getTotalValue = () => {
    return myTokens.reduce((sum, token) => sum + token.value, 0);
  };

  const handleViewToken = (tokenId: string) => {
    navigate(`/token?id=${tokenId}`);
  };

  const handleCreateToken = () => {
    navigate('/create-token');
  };

  if (!wallet) {
    return (
      <Page>
        <div className={block()}>
          <div className={element('header')}>
            <Title level="2">My Tokens</Title>
          </div>
          <div className={element('placeholder')}>
            <Title level="3">Connect Wallet</Title>
            <Text>
              Connect your TON wallet to view your tokens
            </Text>
            <TonConnectButton className={element('connect-button')}/>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className={block()}>
        <div className={element('header')}>
          <Title level="2">My Tokens</Title>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
        
        {isLoading ? (
          <div className={element('loading')}>
            <Text>Loading your tokens...</Text>
          </div>
        ) : (
          <>
            {myTokens.length > 0 ? (
              <>
                <div className={element('summary')}>
                  <Title level="3">Total Value</Title>
                  <div className={element('total-value')}>
                    <Text className={element('value-amount')}>${getTotalValue().toFixed(2)}</Text>
                    <Text className={element('wallet-address')}>
                      {wallet.account?.address ? `${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-6)}` : 'Address not available'}
                    </Text>
                  </div>
                </div>

                <List>
                  <Section header="My Tokens">
                    {myTokens.map(token => (
                      <Cell
                        key={token.id}
                        before={
                          <Avatar src={token.iconUrl} alt={`${token.name} logo`} width={48} height={48} />
                        }
                        subtitle={
                          <div className={element('token-info')}>
                            <Text>{token.symbol}</Text>
                            <Text className={element('token-amount')}>{token.amount} tokens</Text>
                          </div>
                        }
                        after={
                          <div className={element('price-info')}>
                            <Text className={element('value')}>${token.value.toFixed(2)}</Text>
                            <Text className={`${element('change')} ${token.change24h >= 0 ? element('positive') : element('negative')}`}>
                              {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                            </Text>
                          </div>
                        }
                        onClick={() => handleViewToken(token.id)}
                      >
                        <Title level="3">{token.name}</Title>
                      </Cell>
                    ))}
                  </Section>
                </List>
              </>
            ) : (
              <div className={element('empty-state')}>
                <Title level="3">No Tokens Found</Title>
                <Text>
                  You don't have any tokens yet. Buy some tokens or create your own!
                </Text>
              </div>
            )}
            
            <div className={element('actions')}>
              <Button
                className={element('create-button')}
                onClick={handleCreateToken}
              >
                Create New Token
              </Button>
              <Button
                className={element('buy-button')}
                onClick={() => navigate('/')}
              >
                Buy Tokens
              </Button>
            </div>
          </>
        )}
      </div>
    </Page>
  );
}; 