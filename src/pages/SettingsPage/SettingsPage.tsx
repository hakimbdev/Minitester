import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, List, Section, Text, Title } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';

import './SettingsPage.css';

const [block, element] = bem('social-media-page');

export const SettingsPage: FC = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <div className={block()}>
        <div className={element('header')}>
          <Button onClick={() => navigate(-1)}>Back</Button>
          <Title level="2">Social Media</Title>
        </div>
        
        <List>
          <Section header="Follow Us">
            <a 
              href="https://x.com/openmemepad" 
              target="_blank" 
              rel="noopener noreferrer"
              className={element('social-link')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <Text>Follow on Twitter</Text>
            </a>
            
            <a 
              href="https://t.me/openmemepad" 
              target="_blank" 
              rel="noopener noreferrer"
              className={element('social-link')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
              </svg>
              <Text>Join our Telegram</Text>
            </a>
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