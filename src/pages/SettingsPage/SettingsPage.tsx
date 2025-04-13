import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List, Section, Text, Title } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page.tsx';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { bem } from '@/css/bem.ts';

import './SettingsPage.css';

const [block, element] = bem('settings-page');

export const SettingsPage: FC = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <div className={block()}>
        <div className={element('header')}>
          <Button onClick={() => navigate(-1)}>Back</Button>
          <Title level="2">Settings</Title>
        </div>
        
        <List>
          <Section header="Appearance">
            <ThemeToggle />
          </Section>
          
          <Section header="About">
            <Text className={element('about-text')}>
              Open MemePad is a platform for creating, trading, and managing meme tokens on the TON blockchain.
            </Text>
            <Text className={element('version')}>
              Version 1.0.0
            </Text>
          </Section>
        </List>
      </div>
    </Page>
  );
}; 