import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  List,
  Section,
  Placeholder,
} from '@telegram-apps/telegram-ui';
import { useTonWallet, TonConnectButton } from '@tonconnect/ui-react';
import { Page } from '@/components/Page.tsx';
import { TokenCard } from '@/components/TokenCard/TokenCard';
import { bem } from '@/css/bem.ts';

import './MyTokensPage.css';

const [block, element] = bem('my-tokens-page');

interface Token {
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  creatorAddress: string;
}

export const MyTokensPage: FC = () => {
  const navigate = useNavigate();
  const wallet = useTonWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      if (wallet?.account.address) {
        try {
          // In a real app, this would be an API call to fetch the user's created tokens
          // For now using mock data
          const mockTokens = [
            {
              id: '1',
              name: 'Example Token',
              symbol: 'EXT',
              totalSupply: '1000000',
              creatorAddress: wallet.account.address,
            }
          ];
          setTokens(mockTokens);
        } catch (error) {
          console.error('Error fetching tokens:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTokens();
  }, [wallet]);

  const handleCreateToken = () => {
    navigate('/create-token');
  };

  if (!wallet) {
    return (
      <Page>
        <Placeholder
          header="Connect Wallet"
          description="Please connect your wallet to view your tokens"
        >
          <TonConnectButton />
        </Placeholder>
      </Page>
    );
  }

  return (
    <Page>
      <div className={block()}>
        <Section header="My Created Tokens">
          {isLoading ? (
            <div className={element('loading')}>Loading...</div>
          ) : tokens.length > 0 ? (
            <List>
              {tokens.map((token) => (
                <TokenCard
                  key={token.id}
                  tokenId={token.id}
                  name={token.name}
                  symbol={token.symbol}
                  totalSupply={token.totalSupply}
                  creatorAddress={token.creatorAddress}
                />
              ))}
            </List>
          ) : (
            <Placeholder
              className={element('empty-state')}
              header="No Tokens Found"
              description="You haven't created any tokens yet"
            />
          )}
        </Section>
        
        <div className={element('actions')}>
          <Button
            className={element('create-button')}
            onClick={handleCreateToken}
          >
            Create New Token
          </Button>
        </div>
      </div>
    </Page>
  );
};