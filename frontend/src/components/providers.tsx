import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { AuthProvider, OpenfortProvider, RecoveryMethod } from '@openfort/react'
import { OpenfortWagmiBridge } from '@openfort/react/wagmi'
import { Toaster } from 'sonner'

import { canUseOpenfort, openfortPublishableKey, openfortShieldPublishableKey, appChainId } from '../lib/chains'
import { config } from '../lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const openfortWalletConfig = canUseOpenfort
    ? {
        shieldPublishableKey: openfortShieldPublishableKey!,
        ethereum: { chainId: appChainId },
      }
    : null

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        {canUseOpenfort && openfortWalletConfig ? (
          <OpenfortWagmiBridge>
            <OpenfortProvider
              publishableKey={openfortPublishableKey!}
              walletConfig={openfortWalletConfig}
              uiConfig={{
                appName: 'ProDefi',
                authProviders: [AuthProvider.EMAIL_OTP, AuthProvider.GOOGLE, AuthProvider.WALLET],
                walletRecovery: {
                  defaultMethod: RecoveryMethod.PASSKEY,
                  allowedMethods: [RecoveryMethod.PASSKEY, RecoveryMethod.PASSWORD],
                },
                mode: 'dark',
                theme: 'midnight',
                termsOfServiceUrl: 'https://prodefi.online/reglas/',
                privacyPolicyUrl: 'https://prodefi.online/',
              }}
            >
              <Toaster />
              {children}
            </OpenfortProvider>
          </OpenfortWagmiBridge>
        ) : (
          <RainbowKitProvider>
            <Toaster />
            {children}
          </RainbowKitProvider>
        )}
      </WagmiProvider>
    </QueryClientProvider>
  );
}
