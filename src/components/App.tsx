import { useMemo } from 'react';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { routes } from '@/navigation/routes.tsx';
import { BottomNavigation } from '@/components/BottomNavigation/BottomNavigation';
import { ThemeProvider } from '@/contexts/ThemeContext';

// TON Connect manifest URL - in a real app, this would be your own manifest
const manifestUrl = 'https://raw.githubusercontent.com/ton-connect/demo-dapp-with-react/main/public/tonconnect-manifest.json';

// Create a wrapper component that will use the ThemeContext
const ThemedApp = () => {
  const lp = useMemo(() => retrieveLaunchParams(), []);

  return (
    <AppRoot
      appearance="dark"
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <HashRouter>
        <div style={{ paddingBottom: '60px' }}>
          <Routes>
            {routes.map((route) => <Route key={route.path} {...route} />)}
            <Route path="*" element={<Navigate to="/"/>}/>
          </Routes>
        </div>
        <BottomNavigation />
      </HashRouter>
    </AppRoot>
  );
};

export function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </TonConnectUIProvider>
  );
}
