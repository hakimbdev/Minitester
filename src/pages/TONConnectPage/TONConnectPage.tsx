import { openLink } from '@telegram-apps/sdk-react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import {
  Avatar,
  Cell,
  List,
  Navigation,
  Placeholder,
  Section,
  Text,
  Title,
  Spinner,
  Button,
  Divider
} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { DisplayData } from '@/components/DisplayData/DisplayData.tsx';
import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';

import './TONConnectPage.css';

const [, e] = bem('ton-connect-page');

export const TONConnectPage: FC = () => {
  const wallet = useTonWallet();

  if (wallet === undefined) {
    return (
      <Page>
        <div className={e('loading')}>
          <Spinner size="large" />
          <Text className={e('loading-text')}>Initializing wallet connection...</Text>
        </div>
      </Page>
    );
  }

  if (!wallet) {
    return (
      <Page>
        <Placeholder
          className={e('placeholder')}
          header="Connect Your TON Wallet"
          icon="💎"
          description={
            <>
              <Text className={e('description')}>
                Connect your wallet to access advanced features and manage your TON assets
              </Text>
              <TonConnectButton className={e('button')}/>
            </>
          }
        />
      </Page>
    );
  }

  const { account: { address } } = wallet;
  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <Page>
      <List>
        {'imageUrl' in wallet && (
          <>
            <Section header="Wallet Information">
              <Cell
                className={e('wallet-cell')}
                before={
                  <Avatar src={wallet.imageUrl} alt={`${wallet.name} logo`} width={60} height={60}/>
                }
                after={
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      openLink(wallet.aboutUrl);
                    }}
                  >
                    About
                  </Button>
                }
                subtitle={wallet.appName}
              >
                <Title level="3">{wallet.name}</Title>
              </Cell>
            </Section>

            <Divider />

            <Section header="Connection Status">
              <TonConnectButton className={e('button-connected')}/>
            </Section>
          </>
        )}
        
        <Section header="Account Details">
          <DisplayData
            rows={[
              { 
                title: 'Address',
                value: (
                  <div className={e('address-container')}>
                    <Text className={e('address')}>{shortenedAddress}</Text>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => navigator.clipboard.writeText(address)}
                    >
                      Copy
                    </Button>
                  </div>
                )
              },
            ]}
          />
        </Section>
      </List>
    </Page>
  );
};
