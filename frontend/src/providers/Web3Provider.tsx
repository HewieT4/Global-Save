import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { defineChain } from 'viem';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// Define the Monad Testnet custom chain
export const monadTestnet = defineChain({
  id: 10143, 
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad native token', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MonadExplorer', url: 'https://testnet.monadexplorer.com' },
  },
});

const config = getDefaultConfig({
  appName: 'GlobalSave',
  projectId: '3f2bb6824b4f3b7f5cf5e796e6d1b8cc', 
  chains: [monadTestnet],
  ssr: false, 
});

const queryClient = new QueryClient();

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#007AFF',
            borderRadius: 'large',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
