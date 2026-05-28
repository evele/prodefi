import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { AccountTypeEnum, AuthProvider, OpenfortProvider, RecoveryMethod } from '@openfort/react'
import { OpenfortWagmiBridge } from '@openfort/react/wagmi'
import { Toaster } from 'sonner'

import { appChainId, canUseOpenfort, enableOpenfortWalletAuth, openfortEthereumFeeSponsorshipId, openfortPublishableKey, openfortShieldPublishableKey } from '../lib/chains'
import { OpenfortAuthCallbackHandler } from './OpenfortAuthCallbackHandler'
import { OpenfortChainSync } from './OpenfortChainSync'
import { OpenfortDebugPanel } from './OpenfortDebugPanel'
import { config } from '../lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const authProviders = enableOpenfortWalletAuth
    ? [AuthProvider.EMAIL_OTP, AuthProvider.WALLET]
    : [AuthProvider.EMAIL_OTP]

  const openfortWalletConfig = canUseOpenfort
    ? {
        shieldPublishableKey: openfortShieldPublishableKey!,
        ethereum: {
          chainId: appChainId,
          ...(openfortEthereumFeeSponsorshipId
            ? {
                ethereumFeeSponsorshipId: {
                  [appChainId]: openfortEthereumFeeSponsorshipId,
                },
                accountType: AccountTypeEnum.DELEGATED_ACCOUNT,
              }
            : {}),
        },
      }
    : null

  const openfortUiConfig = {
    appName: 'ProDefi',
    authProviders,
    language: 'es-ES',
    walletRecovery: {
      defaultMethod: RecoveryMethod.PASSKEY,
      allowedMethods: [RecoveryMethod.PASSKEY, RecoveryMethod.PASSWORD],
    },
    mode: 'dark',
    theme: 'midnight',
    termsOfServiceUrl: 'https://prodefi.online/reglas/',
    privacyPolicyUrl: 'https://prodefi.online/',
  } as any

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        {canUseOpenfort && openfortWalletConfig ? (
          <OpenfortWagmiBridge>
            <OpenfortProvider
              publishableKey={openfortPublishableKey!}
              walletConfig={openfortWalletConfig}
              uiConfig={openfortUiConfig}
              debugMode={import.meta.env.DEV ? {
                openfortReactDebugMode: true,
                shieldDebugMode: true,
                debugRoutes: false,
              } : undefined}
            >
              <OpenfortAuthCallbackHandler />
              <OpenfortChainSync />
              <OpenfortDebugPanel />
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
