<!--
Sitemap:
- [Redirecting...](/index): Openfort documentation home page. Get started with embedded wallets, global wallets, backend wallets, and blockchain infrastructure for your web and mobile.
- [Redirecting...](/docs/): Openfort developer documentation hub. Learn how to integrate embedded wallets, global wallets, backend wallets, and blockchain infrastructure into your applications.
- [Configuration](/docs/configuration/): Configure API keys, authentication providers, gas sponsorship, webhooks, and security settings for your Openfort application. Central hub for all project.
- [Welcome to Openfort](/docs/overview/): Choose the right Openfort product for your needs. Compare Embedded Wallets, Global Wallets, Backend Wallets, and Onetap to find the best wallet infrastructure.
- [Recipes](/docs/recipes/): Explore Openfort integration recipes with popular DeFi protocols and blockchain applications. Find ready-to-use sample apps for Solana, USDC, Hyperliquid, and more.
- [Entity addresses](/docs/configuration/addresses): Contract addresses for Openfort deployed smart contracts across supported networks. Find account factory, paymaster, and proxy addresses for EVM and Solana chains.
- [API keys](/docs/configuration/api-keys): Manage Openfort API keys for authentication including secret and publishable keys in test and live modes. Secure your integration with proper key management.
- [Supported blockchains](/docs/configuration/chains): Openfort supports multiple blockchain ecosystems with tiered functionality including signature abstraction, wallet management, and gas sponsorship.
- [Configure allowed domains](/docs/configuration/configure-origins): Secure your Openfort publishable key by restricting which web domains can use it in production. Configure allowed origins to prevent unauthorized key usage on.
- [Default assets](/docs/configuration/default-assets): Reference for default token assets returned by wallet_getAssets across Openfort-supported blockchains. View ERC-20 tokens and native assets configured per network.
- [Ecosystem dashboard configuration](/docs/configuration/ecosystem): Configure your Openfort ecosystem brand settings including name, logo, colors, custom domain, and legal policies. Personalize the global wallet experience for users.
- [Using a third-party auth provider](/docs/configuration/external-auth): Integrate Openfort with third-party authentication providers that support JWT-based authentication for embedded wallet creation.
- [Pay gas fees with ERC20 tokens](/docs/configuration/gas-erc20): Configure ERC-20 token gas payment for your Openfort application. Set up fee sponsorship where users pay transaction fees using ERC-20 tokens with dynamic pricing.
- [Gas sponsorship](/docs/configuration/gas-sponsorship): Set up and manage gas sponsorship policies for your Openfort application. Configure fee sponsorship rules to cover transaction costs and improve user onboarding.
- [Provider migration](/docs/configuration/migration): Migrate users between authentication providers using Openfort's built-in migration tool. Transfer user accounts and wallets seamlessly when switching auth systems.
- [Configure allowed native apps](/docs/configuration/native-apps): Secure your Openfort embedded wallets by restricting which native mobile and desktop apps can use your publishable key. Configure app-level access restrictions.
- [Events](/docs/configuration/notifications): Configure notifications to receive real-time events from your Openfort account or on-chain activity via email or webhooks.
- [Policies](/docs/configuration/policies/): Control Openfort operations with rule-based authorization policies. Define which transactions, signings, and actions your application can perform on behalf of users.
- [How billing works](/docs/configuration/project-billing): Understand Openfort's project-based billing system, credit balances, and payment options. Manage gas sponsorship costs and monitor usage across your projects.
- [Embedded wallet recovery methods](/docs/configuration/recovery-methods/): Compare Openfort wallet recovery options: automatic, password, and passkey methods. Choose the best recovery strategy for your embedded wallet application and users.
- [Social login](/docs/configuration/social-login): Configure social login providers for your Openfort application. Learn about supported OAuth providers including Google, Apple, Discord, Twitter, and more options.
- [Manage teams](/docs/configuration/team): Configure team member roles and permissions across your Openfort projects. Invite collaborators, assign admin or developer roles, and manage project-level access.
- [Test accounts](/docs/configuration/test-accounts): Use test accounts for automated testing, local development, and App Store review without real email or SMS delivery.
- [Updated authentication](/docs/configuration/updated-authentication): Understand the differences between v1 and v2 authentication endpoints and which version your project uses based on its creation date.
- [User Sessions](/docs/configuration/user-sessions): Manage user sessions with secure session tokens in your Openfort application. Configure token lifetimes, automatic refresh, and session persistence for embedded.
- [Ethereum wallet authentication](/docs/configuration/wallet-auth/): Configure Sign-In With Ethereum (SIWE) for EVM-compatible wallet authentication using MetaMask, Rainbow, or WalletConnect.
- [Webhooks](/docs/configuration/webhooks): Configure HTTPS webhooks to receive real-time notifications about Openfort events. Monitor transactions, account changes, and wallet operations in your application.
- [Building with AI](/docs/overview/building-with-ai): Openfort documentation is built with AI-first principles, providing llms.txt files, Markdown rendering, and MCP server access for AI assistants.
- [Openfort CLI](/docs/overview/building-with-cli): Install and use the Openfort CLI to manage wallets, policies, gas sponsorship, transactions, and more from your terminal.
- [Why Openfort](/docs/overview/why-openfort): Learn how Openfort solves wallet infrastructure challenges like vendor lock-in, approval bottlenecks, and transaction lifecycle management.
- [Global Wallet](/docs/products/cross-app-wallet/): Learn how to integrate, customize, and deploy Openfort global wallets using the Ecosystem SDK for onboarding, authentication, and payments.
- [Embedded Wallets](/docs/products/embedded-wallet/): Build seamless wallet experiences with Openfort embedded wallets. Integrate self-custodial wallets with authentication, key management, and multi-chain.
- [Infrastructure](/docs/products/infrastructure/): Enterprise-grade Account Abstraction infrastructure including a high-performance ERC-4337 bundler and fee sponsorship paymaster for gas sponsorship on Ethereum and Solana.
- [Backend wallets](/docs/products/server/): Scale on-chain operations with developer-controlled wallets designed for automation, security, and high-throughput backend services.
- [Integrate with EIP-7702](/docs/recipes/7702): Build a Next.js app with Openfort embedded wallets using EIP-7702 authorization. Sample app demonstrating account delegation and gasless transactions with smart.
- [Yield on Aave](/docs/recipes/aave): Full-stack DeFi application demonstrating lending and borrowing operations using Openfort embedded wallets with the Aave protocol.
- [Wallet permissions](/docs/recipes/agent-permissions): Delegated transaction execution with time-limited agent permissions. A backend agent autonomously executes DCA token swaps on behalf of users using Openfort embedded wallets and Calibur smart accounts on Base Sepolia.
- [Trade on Hyperliquid](/docs/recipes/hyperliquid/): Build trading applications on Hyperliquid using Openfort backend wallets with the @nktkas/hyperliquid SDK for perpetuals, spot, and HyperEVM.
- [Swap on LI.FI](/docs/recipes/lifi): Next.js application demonstrating cross-chain swaps using Openfort's embedded wallet infrastructure paired with LiFi's routing engine.
- [Yield on Morpho](/docs/recipes/morpho): Full-stack application integrating Openfort embedded wallets with Morpho Blue USDC vault on Base for optimized yield generation.
- [Solana integration](/docs/recipes/solana): Build a Solana web application with Openfort embedded wallets. Sample app demonstrating SOL transfers, gasless transactions via Kora, and wallet management on Solana.
- [USDC transfer](/docs/recipes/usdc): Build a React Native Expo app for USDC token transfers with Openfort embedded wallets. Sample app demonstrating stablecoin payments and wallet infrastructure on Ethereum Sepolia.
- [x402 payment protocol](/docs/recipes/x402): Modular React application demonstrating HTTP-based USDC micropayments using Openfort embedded and backend wallets with gasless transactions via Coinbase's x402 payment protocol.
- [Postman API Suite](/docs/reference/postman): Import the Openfort Postman collection to test API endpoints interactively. Explore authentication, wallet, and transaction APIs with pre-configured request.
- [Self-hosted key management](/docs/configuration/advanced/self-host): Host your own embedded wallet key management infrastructure using OpenSigner for complete control over key custody, data handling, and compliance requirements.
- [Custom auth token](/docs/configuration/custom-auth/auth-token): Set up custom token-based authentication with Openfort using your own auth provider. Configure custom auth tokens and dashboard settings for embedded wallets.
- [Custom OIDC auth](/docs/configuration/custom-auth/oidc-token): Set up OIDC-compatible authentication with Openfort using providers like Auth0, Cognito, or Okta. Configure OpenID Connect tokens for embedded wallet creation.
- [AccelByte auth](/docs/configuration/external-auth/accelbyte): Authenticate users with AccelByte and create Openfort embedded wallets. Integrate AccelByte IAM as an external authentication provider for your gaming application.
- [Better-Auth](/docs/configuration/external-auth/better-auth): Authenticate users with Better-Auth and create Openfort embedded wallets. Integrate Better-Auth as an external authentication provider for your wallet application.
- [Firebase auth](/docs/configuration/external-auth/firebase): Authenticate users with Firebase and create Openfort embedded wallets. Integrate Firebase Auth as an external authentication provider for your wallet application.
- [LootLocker auth](/docs/configuration/external-auth/lootlocker): Authenticate users with LootLocker and create Openfort embedded wallets. Integrate LootLocker as an external authentication provider for your gaming application.
- [PlayFab auth](/docs/configuration/external-auth/playfab): Authenticate users with PlayFab and create Openfort embedded wallets. Integrate Microsoft PlayFab as an external authentication provider for your game application.
- [Supabase auth](/docs/configuration/external-auth/supabase): Authenticate users with Supabase and create Openfort embedded wallets. Integrate Supabase Auth as an external authentication provider for your wallet application.
- [Custom SMTP](/docs/configuration/password/custom-smtp): Configure a custom SMTP server for sending authentication emails in Openfort Auth. Use your own email provider for password resets and email verification messages.
- [Password-based auth](/docs/configuration/password/security): Configure password security settings in Openfort Auth. Enable leaked password protection, set minimum strength requirements, and enforce security best practices.
- [Ethereum policy rules](/docs/configuration/policies/ethereum-rules): Complete reference for Ethereum policy rules in Openfort. Configure EVM operation types, criteria, amount limits, and contract restrictions for authorization.
- [Policy rules reference](/docs/configuration/policies/rules-reference): Complete reference for Openfort policy structure, evaluation logic, and pre-flight testing. Understand how authorization rules are matched and executed for.
- [Solana policy rules](/docs/configuration/policies/solana-rules): Complete reference for Solana policy rules in Openfort. Configure Solana operation types, criteria, and program restrictions for fee sponsorship authorization.
- [Apple login](/docs/configuration/social-login/auth-apple): Configure Sign in with Apple for web and native iOS, macOS, and tvOS applications using Openfort Auth. Set up Apple OAuth credentials for social authentication.
- [Discord Login](/docs/configuration/social-login/auth-discord): Configure Discord OAuth login for your Openfort project. Set up a Discord application, add API credentials, and enable Discord social authentication for your users.
- [Facebook Login](/docs/configuration/social-login/auth-facebook): Configure Facebook Login for your Openfort project. Set up a Facebook application, add API credentials, and enable Facebook social authentication for your users.
- [Google login](/docs/configuration/social-login/auth-google): Configure Google Sign-In for web, Android, and Chrome extension apps with Openfort Auth. Set up OAuth credentials and enable Google social login for your users.
- [LINE Login](/docs/configuration/social-login/auth-line): Configure LINE Login for your Openfort project. Set up a LINE application, add API credentials in your dashboard, and enable LINE social authentication for users.
- [X (Twitter) Login](/docs/configuration/social-login/auth-twitter): Configure Twitter/X OAuth login for your Openfort project. Set up a Twitter application, add API credentials, and enable Twitter social authentication for users.
- [Give an AI agent a wallet](/docs/overview/guides/ai-agent-wallets): Create and manage wallets for AI agents using server-side signing and API keys for autonomous on-chain actions.
- [Build a mobile neobank](/docs/overview/guides/mobile-neobank): Use Openfort with React Native to build a mobile app where users hold and transfer stablecoins using embedded wallets.
- [Send a gasless transaction](/docs/overview/guides/send-gasless-transactions): Use the Openfort CLI to authenticate, generate keys, create a backend wallet, set up gas sponsorship, and send a gasless transaction.
- [Create a stablecoin payroll system](/docs/overview/guides/stablecoin-payroll): Use Node.js and backend wallets with batch transactions to disburse stablecoins to multiple users.
- [RPC methods overview](/docs/products/cross-app-wallet/rpc/): Complete reference for supported RPC methods in Openfort global wallets. Covers authentication, transactions, signing, permissions, and batch call capabilities.
- [Account Types](/docs/products/embedded-wallet/account-types): Openfort documentation for Account Types. Learn how to integrate embedded wallet features including authentication, transactions, and key management.
- [Authentication Methods](/docs/products/embedded-wallet/authentication): Overview of all supported authentication methods for Openfort embedded wallets, including response types and when to use each method.
- [Overview JavaScript](/docs/products/embedded-wallet/javascript/): Learn about the Openfort JavaScript SDK for secure authentication, embedded wallets, and powerful UX in your game or app.
- [Migrating to Openfort](/docs/products/embedded-wallet/migration/): Comprehensive guide for migrating your embedded wallet provider to Openfort. Step-by-step instructions for switching from Privy, Dynamic, Turnkey, or Web3Auth.
- [Getting Started with Openfort React Native](/docs/products/embedded-wallet/react-native/): Learn how to integrate the Openfort React Native SDK for seamless wallet and authentication experiences in your mobile app.
- [Quickstart React](/docs/products/embedded-wallet/react/): Get started with Openfort embedded wallets in React. Set up a new project using the Openfort CLI, configure authentication, and create your first embedded wallet.
- [Getting Started with Openfort Swift](/docs/products/embedded-wallet/swift/): Openfort documentation for Getting Started with Swift. Explore guides, API references, and tutorials for integrating wallet infrastructure into your applications.
- [Overview Unity (Embedded Wallet)](/docs/products/embedded-wallet/unity/): Get started with the Openfort Unity SDK for secure player authentication, embedded wallets, and seamless blockchain integration in your cross-platform Unity games.
- [Wallet Lifecycle](/docs/products/embedded-wallet/wallet-lifecycle): Openfort documentation for Wallet Lifecycle. Learn how to integrate embedded wallet features including authentication, transactions, and key management.
- [4337 Bundler](/docs/products/infrastructure/bundler/): Openfort Bundler overview for ERC-4337 account abstraction. Learn about the high-performance bundler service that processes user operations across EVM blockchains.
- [Paymaster — Fee Sponsorship for Ethereum and Solana](/docs/products/infrastructure/paymaster/): Enable fee sponsorship and gas sponsorship for your users with the Openfort Paymaster. Sponsor transaction fees across Ethereum chains and Solana for seamless, gasless experiences.
- [Backend wallet accounts](/docs/products/server/accounts): Create, list, retrieve, import, and export backend wallet accounts for Ethereum and Solana using the Openfort Node SDK.
- [API authentication](/docs/products/server/authentication): Authenticate requests to Openfort backend wallet endpoints using JWT tokens signed with your wallet secret. Secure server-to-server wallet operations with HMAC.
- [Backend wallet policies](/docs/products/server/policies): Control which signing operations your Openfort backend wallets can perform using rule-based authorization policies. Define transaction rules, limits, and.
- [Backend wallet security](/docs/products/server/security): Learn about the security architecture of Openfort's backend wallets, including TEE-based key protection, encryption, and authentication.
- [Getting started](/docs/products/server/setup): Set up Openfort backend wallets on your server. Configure SDK credentials, initialize the client, and secure your environment for server-side wallet operations.
- [Backend wallet usage](/docs/products/server/usage): Use Openfort backend wallets for server-side account management, transaction signing, and blockchain interactions. Execute operations programmatically from your.
- [Viem integration](/docs/products/server/viem-integration): Use viem types and utilities with Openfort backend wallets for type-safe Ethereum signing operations. Integrate server-side wallets with the viem library ecosystem.
- [Wallet secret rotation](/docs/products/server/wallet-secret-rotation): Rotate your Openfort backend wallet secrets to maintain security or recover from a compromise. Follow best practices for zero-downtime secret key rotation.
- [Agent wallets](/docs/recipes/hyperliquid/agent-wallets): Delegate trading to agent wallets on Hyperliquid with time-limited permissions using Openfort backend wallets. Enable automated trading with secure key management.
- [Builder codes](/docs/recipes/hyperliquid/builder-codes): Earn revenue from Hyperliquid trades using builder codes with Openfort backend wallets. Attribute trading fees and implement builder code referral programs in DeFi.
- [Client-side SDKs](/docs/recipes/hyperliquid/client-side): Integrate Hyperliquid trading in React and React Native apps using Openfort embedded wallets with wagmi. Build client-side DeFi trading interfaces for Hyperliquid.
- [HyperEVM](/docs/recipes/hyperliquid/hyperevm): Deploy contracts and send transactions on HyperEVM using Openfort backend wallets with viem for the Hyperliquid EVM chain.
- [Policies](/docs/recipes/hyperliquid/policies): Restrict Hyperliquid signing actions using Openfort's policy engine to deny withdrawals, transfers, and control agent approvals.
- [Subaccounts](/docs/recipes/hyperliquid/subaccounts): Isolate trading positions and risk using Hyperliquid vault subaccounts with Openfort backend wallets. Implement subaccount management for DeFi trading applications.
- [Executing trades](/docs/recipes/hyperliquid/trading): Place market, limit, stop-loss, and TWAP orders on Hyperliquid with leverage and margin configuration using Openfort backend wallets.
- [eth_accounts](/docs/products/cross-app-wallet/rpc/eth_accounts): Retrieve connected account addresses using the eth_accounts RPC method with Openfort global wallets. Access user wallet addresses for your decentralized application.
- [eth_requestAccounts](/docs/products/cross-app-wallet/rpc/eth_requestAccounts): Request wallet connection using the eth_requestAccounts RPC method with Openfort global wallets. Connect your application to user wallet accounts for interactions.
- [eth_sendTransaction](/docs/products/cross-app-wallet/rpc/eth_sendTransaction): Broadcast transactions using the eth_sendTransaction RPC method with Openfort global wallets. Send native transfers and contract calls through the wallet interface.
- [eth_signTypedData_v4](/docs/products/cross-app-wallet/rpc/eth_signTypedData_v4): Sign EIP-712 typed data using the eth_signTypedData_v4 RPC method with Openfort global wallets. Implement structured data signing for DeFi and smart contracts.
- [personal_sign](/docs/products/cross-app-wallet/rpc/personal_sign): Sign EIP-191 personal messages using the personal_sign RPC method with Openfort global wallets. Implement message signing for authentication and verification.
- [wallet_getCallsStatus](/docs/products/cross-app-wallet/rpc/wallet_getCallsStatus): Check the status of batched calls using the wallet_getCallsStatus RPC method with Openfort global wallets. Monitor transaction bundle execution and confirmations.
- [wallet_getCapabilities](/docs/products/cross-app-wallet/rpc/wallet_getCapabilities): Query supported wallet capabilities using the wallet_getCapabilities RPC method with Openfort global wallets. Discover features like batch calls and sponsorship.
- [wallet_grantPermissions](/docs/products/cross-app-wallet/rpc/wallet_grantPermissions): Grants permissions for an Application to perform actions on behalf of the account using the wallet_grantPermissions RPC method.
- [wallet_revokePermissions](/docs/products/cross-app-wallet/rpc/wallet_revokePermissions): Revoke wallet permissions using the wallet_revokePermissions RPC method with Openfort global wallets. Manage and control app access to wallet capabilities.
- [wallet_sendCalls](/docs/products/cross-app-wallet/rpc/wallet_sendCalls): Send batched transaction bundles using the wallet_sendCalls RPC method with Openfort global wallets. Execute multiple operations in a single user confirmation.
- [Ecosystem wallet signers](/docs/products/cross-app-wallet/setup/signers/): Choose the right key management signer for your Openfort global wallet. Compare Social Login and Passkey signer options for the Ecosystem SDK configuration.
- [Why global wallets?](/docs/products/cross-app-wallet/setup/why): Understand the benefits of Openfort global wallets over traditional embedded wallets and how the Ecosystem SDK enables seamless cross-app experiences.
- [Batch transactions](/docs/products/cross-app-wallet/usage/batch-transactions): Send multiple transactions in a single call using Openfort global wallets with EIP-5792. Batch operations for better UX and reduced user confirmations.
- [Quickstart with Sign in button](/docs/products/cross-app-wallet/usage/create-wallet-button): Add a branded wallet sign-in button to any React app using the Openfort Ecosystem SDK. Implement cross-app wallet onboarding with minimal code and configuration.
- [Sponsor transactions](/docs/products/cross-app-wallet/usage/gas-policies): Sponsor user transactions using fee policies with the Openfort Ecosystem SDK. Configure gas sponsorship for your global wallet to cover user transaction costs.
- [Integrating with wallet libraries](/docs/products/cross-app-wallet/usage/libraries/): Use wallet libraries like RainbowKit and ConnectKit with Openfort global wallets. Implement polished wallet connection UIs with pre-built components and connectors.
- [Quickstart with React Native](/docs/products/cross-app-wallet/usage/react-native): Add Openfort global wallet support to your React Native app using the Mobile Wallet Protocol Client. Enable cross-app wallet connectivity for mobile applications.
- [Signature Verification (Global Wallet)](/docs/products/cross-app-wallet/usage/signatures): Verify smart contract wallet signatures using wagmi with Openfort global wallets. Handle ERC-1271 signature validation for account abstraction wallets correctly.
- [Global wallet in Unity](/docs/products/cross-app-wallet/usage/unity): Integrate Openfort global wallet into your Unity game using the Mobile Wallet Protocol. Connect players to a shared ecosystem wallet across mobile platforms.
- [Unity Android](/docs/products/cross-app-wallet/usage/unity-android): Integrate Openfort global wallet in Unity for Android using the Mobile Wallet Protocol. Enable cross-app wallet connectivity for Android game builds.
- [Unity WebGL](/docs/products/cross-app-wallet/usage/unity-webgl): Add Openfort global wallet support to your Unity WebGL builds. Integrate cross-app wallet functionality for browser-based games using the Ecosystem SDK connector.
- [Wagmi setup for global wallets](/docs/products/cross-app-wallet/usage/web-app-wagmi): Integrate Openfort global wallet into your Wagmi-based web app using the Mobile Wallet Protocol. Connect users to the ecosystem wallet with Rapidfire ID support.
- [Embedded Wallet Authentication (JavaScript)](/docs/products/embedded-wallet/javascript/auth): Integrate third-party authentication providers like Firebase and Supabase with Openfort embedded wallets using the JavaScript SDK for secure user authentication.
- [Error Handling](/docs/products/embedded-wallet/javascript/errors): Handle errors from the Openfort JavaScript SDK with typed error classes and error codes. Implement robust error handling for authentication and wallet operations.
- [Events](/docs/products/embedded-wallet/javascript/events): Monitor authentication and wallet events with the Openfort JavaScript SDK event system. Subscribe to state changes, errors, and lifecycle events in your app.
- [Quickstart](/docs/products/embedded-wallet/javascript/quickstart): Get started quickly with the Openfort JavaScript SDK. Step-by-step guide to set up authentication, create embedded wallets, and send your first transaction.
- [Smart Wallets (JS)](/docs/products/embedded-wallet/javascript/smart-wallet/): Get started with Openfort smart wallets in JavaScript. Learn how to create, configure, and interact with smart contract wallets using the Openfort JS SDK.
- [JavaScript SDK Troubleshooting](/docs/products/embedded-wallet/javascript/troubleshooting): Troubleshoot common Openfort JavaScript SDK issues including build errors, bundler configurations, and framework-specific integration problems with solutions.
- [JavaScript SDK usage](/docs/products/embedded-wallet/javascript/use-openfort): Configure and initialize the Openfort JavaScript SDK for embedded wallets. Learn how to set up the SDK client and manage wallet state in your web application.
- [JavaScript wallet implementation](/docs/products/embedded-wallet/javascript/wallets): Integrate Openfort embedded wallets with popular Web3 libraries including Wagmi, Viem, and Ethers.js. Use standard wallet interfaces in your JavaScript application.
- [Migrate from Dynamic](/docs/products/embedded-wallet/migration/dynamic): Step-by-step guide to migrate from Dynamic to Openfort embedded wallets. Transfer user accounts, authentication flows, and wallet infrastructure with minimal.
- [Migrate from Privy](/docs/products/embedded-wallet/migration/privy): Step-by-step guide to migrate from Privy to Openfort embedded wallets. Transfer user accounts, authentication flows, and wallet infrastructure with minimal.
- [Migrate from Turnkey](/docs/products/embedded-wallet/migration/turnkey): Step-by-step guide to migrate from Turnkey to Openfort embedded wallets. Transfer user accounts, authentication flows, and wallet infrastructure with minimal.
- [Migrate from Web3Auth](/docs/products/embedded-wallet/migration/web3auth): Step-by-step guide to migrate from Web3Auth to Openfort embedded wallets. Transfer user accounts, authentication flows, and wallet infrastructure with minimal.
- [Authentication Methods](/docs/products/embedded-wallet/react-native/auth): Overview of supported authentication flows in Openfort React Native. Compare email, social login, guest, wallet, and third-party auth options for mobile wallets.
- [Components](/docs/products/embedded-wallet/react-native/components/): Openfort React Native UI components for authentication and state management. Use pre-built components like AuthBoundary for streamlined mobile wallet development.
- [Hooks](/docs/products/embedded-wallet/react-native/hooks/): Complete reference for Openfort React Native hooks. Browse all hooks for authentication, wallet management, and user state in your mobile embedded wallet.
- [Wallet Configuration (React Native)](/docs/products/embedded-wallet/react-native/wallet/): Configure smart wallets for React Native apps with Openfort. Set up recovery methods, wallet lifecycle management, and transaction capabilities for mobile.
- [Authentication Methods](/docs/products/embedded-wallet/react/auth/): Overview of all supported authentication flows in Openfort React. Compare email, social login, guest, wallet, and third-party auth options for embedded wallets.
- [Error handling](/docs/products/embedded-wallet/react/errors): Catch and handle SDK errors with OpenfortError and OpenfortErrorType.
- [Events](/docs/products/embedded-wallet/react/events): Monitor Openfort SDK events in React for authentication and wallet state changes. Subscribe to lifecycle events, errors, and status updates in your React.
- [Hooks](/docs/products/embedded-wallet/react/hooks/): Complete reference for Openfort React hooks. Browse all available hooks for authentication, wallet management, transaction signing, and UI control in your React app.
- [Openfort UI Customization](/docs/products/embedded-wallet/react/ui/): Customize pre-built Openfort React UI components for wallet actions and authentication flows. Use ready-made components for login, wallet management, and.
- [Wallet configuration](/docs/products/embedded-wallet/react/wallet/): Configure wallet creation, connection, and management with Openfort React hooks. Set up recovery methods, wallet types, and the complete wallet lifecycle flow.
- [Content Security Policy (CSP)](/docs/products/embedded-wallet/security/csp): Configure Content Security Policy headers for Openfort embedded wallets. Set up CSP directives to secure your web application while enabling wallet functionality.
- [On-device execution](/docs/products/embedded-wallet/security/on-device): Openfort's on-device execution environment provides secure, fast wallet operations with browser-isolated key management.
- [User authentication security](/docs/products/embedded-wallet/security/user-authentication): Learn how Openfort secures user authentication with token-based sessions, automatic refresh, and tamper detection. Understand the security model for embedded.
- [User session and authorization](/docs/products/embedded-wallet/server/access-token): Obtain and verify user session tokens for secure server-side authorization with Openfort. Validate authentication tokens and manage access control in your backend.
- [Automatic recovery session](/docs/products/embedded-wallet/server/automatic-recovery-session): Implement automatic wallet recovery sessions with Openfort's secure backend integration. Enable server-side recovery flows for embedded wallets without user.
- [Pregenerating an embedded wallet](/docs/products/embedded-wallet/server/pregenerate-wallets): Pregenerate non-custodial Openfort wallets for users before they sign up. Reserve wallet addresses server-side so they are ready when users complete authentication.
- [Unity Quickstart](/docs/products/embedded-wallet/unity/quickstart): Get started with the Openfort Unity SDK. Step-by-step guide to integrate authentication, create embedded wallets, and enable blockchain features in your game.
- [Using smart wallets (Unity)](/docs/products/embedded-wallet/unity/smart-wallet/): Interact with smart wallets in Unity games using the Openfort SDK. Access blockchain functionality with automatically created smart contract wallets for players.
- [Unity SDK Troubleshooting](/docs/products/embedded-wallet/unity/troubleshooting): Troubleshoot Openfort Unity SDK issues including platform compatibility, build errors, and runtime problems. Find solutions for common development challenges.
- [WebGL Setup (Unity)](/docs/products/embedded-wallet/unity/webgl): Configure Openfort Unity SDK for WebGL builds with iframe-based secure key management. Handle cross-origin restrictions and wallet operations in browser games.
- [Bundler Endpoints](/docs/products/infrastructure/bundler/endpoints/): API reference for Openfort Bundler endpoints. Send user operations, estimate gas, and manage ERC-4337 account abstraction bundles with the Openfort bundler service.
- [Bundler Errors](/docs/products/infrastructure/bundler/errors): Error codes and troubleshooting for the Openfort Bundler service. Diagnose and resolve common user operation failures, gas estimation errors, and submission issues.
- [Ethereum Paymaster — Gas Sponsorship](/docs/products/infrastructure/paymaster/ethereum/): Openfort EVM Paymaster overview for gas fee sponsorship. Learn how to sponsor transaction fees for users on Ethereum and EVM-compatible blockchains with policies.
- [Solana Paymaster — Fee Sponsorship on Solana](/docs/products/infrastructure/paymaster/solana/): Enable fee sponsorship on Solana with the Openfort Paymaster. Sponsor transaction fees and deliver gasless, sponsored transactions for your Solana users.
- [Send gasless transactions (EVM)](/docs/products/server/evm/gasless-transactions): Send gasless transactions with Openfort backend wallets on EVM chains. Automatic EIP-7702 delegation, transaction signing, and submission in a single call.
- [Viem integration](/docs/products/server/evm/viem-integration): Use viem types and utilities with Openfort backend wallets for type-safe Ethereum signing operations. Integrate server-side wallets with the viem library ecosystem.
- [Send gasless transactions (Solana)](/docs/products/server/solana/gasless-transactions): Send gasless transactions with Openfort backend wallets on Solana. Transfer SOL, SPL tokens, or submit raw instructions without requiring the wallet to hold SOL for fees.
- [Branding your global wallet](/docs/products/cross-app-wallet/setup/react/branding): Customize the appearance and branding of your Openfort global wallet using the Ecosystem SDK. Configure colors, logos, and themes to match your brand identity.
- [Ecosystem dashboard configuration](/docs/products/cross-app-wallet/setup/react/dashboard): Configure your Openfort global wallet branding, custom domain, and legal settings through the dashboard. Set up your ecosystem wallet's identity and appearance.
- [Build your global wallet](/docs/products/cross-app-wallet/setup/react/quickstart): Get started with the Openfort Ecosystem SDK in React. Step-by-step guide to set up and launch your own custom global wallet with authentication and transactions.
- [Wallet design and routing](/docs/products/cross-app-wallet/setup/react/wallet-ui): Design and customize your Openfort global wallet UI using the Ecosystem SDK in React. Configure routing, layouts, and components for a branded wallet experience.
- [Openfort social login signer](/docs/products/cross-app-wallet/setup/signers/openfort): Set up and use the Openfort non-custodial signer with social login for secure authentication and global wallet experiences.
- [Passkey (WebAuthn) signer](/docs/products/cross-app-wallet/setup/signers/passkey): Set up the Passkey WebAuthn signer for your Openfort global wallet. Enable secure biometric authentication with self-custodial key management in your ecosystem.
- [Integrating with ConnectKit](/docs/products/cross-app-wallet/usage/libraries/connectkit): Integrate your Openfort global wallet with ConnectKit for a polished wallet connection experience. Add ecosystem wallet support to your ConnectKit-powered dApp.
- [Integrating with RainbowKit](/docs/products/cross-app-wallet/usage/libraries/rainbowkit): Integrate your Openfort global wallet with RainbowKit for a beautiful wallet connection UI. Add ecosystem wallet support to your RainbowKit-powered application.
- [Third-party auth providers](/docs/products/embedded-wallet/javascript/auth/external-auth): Integrate Openfort embedded wallets with JWT-based auth providers like Firebase, Supabase, and Better-Auth using the JavaScript SDK for seamless authentication.
- [External Wallet Login](/docs/products/embedded-wallet/javascript/auth/external-wallet): Connect external wallets via SIWE with the Openfort JavaScript SDK. Enable Sign-In with Ethereum for users who prefer authenticating with their existing wallet.
- [Guest Users](/docs/products/embedded-wallet/javascript/auth/guest): Allow users to immediately start using your application without registration through guest accounts with embedded wallets.
- [Social Login (OAuth)](/docs/products/embedded-wallet/javascript/auth/oauth-login): Implement social login with OAuth providers using the Openfort JavaScript SDK. Add Google, Apple, Discord, and other social sign-in flows to your wallet app.
- [Email and Password](/docs/products/embedded-wallet/javascript/auth/password): Implement secure password-based authentication with the Openfort JavaScript SDK. Set up email and password sign-up and login flows for your embedded wallet app.
- [Phone Login (SMS)](/docs/products/embedded-wallet/javascript/auth/phone-login): Implement phone number authentication with SMS OTP using the Openfort JavaScript SDK. Add passwordless phone login for a seamless embedded wallet experience.
- [Export Private Key](/docs/products/embedded-wallet/javascript/signer/export-key): Export embedded wallet private keys using the Openfort JavaScript SDK. Allow users to back up their keys or import them into external wallets like MetaMask.
- [Wallet Creation and Recovery (JS)](/docs/products/embedded-wallet/javascript/signer/recovery): Configure wallet recovery methods with the Openfort JavaScript SDK. Set up automatic, password, or passkey recovery to protect user embedded wallet access.
- [Update Recovery Method](/docs/products/embedded-wallet/javascript/signer/update-recovery): Upgrade or switch recovery methods for Openfort embedded wallets using the JavaScript SDK. Migrate between password, passkey, and automatic recovery options.
- [funding](/docs/products/embedded-wallet/javascript/smart-wallet/funding): Fund your Openfort embedded wallet using the JavaScript SDK. Learn how to integrate on-ramp solutions to simplify adding funds to smart wallet accounts.
- [Handling chains (JS)](/docs/products/embedded-wallet/javascript/smart-wallet/handling-networks): Handle network switching and chain management with Openfort smart wallets in JavaScript. Learn how to configure multi-chain support for embedded wallets.
- [Integrating with Wallet Libraries (JS)](/docs/products/embedded-wallet/javascript/smart-wallet/libraries): Integrate Openfort JavaScript SDK with popular Web3 libraries like Wagmi, Viem, and Ethers.js. Connect embedded wallets to your preferred development tools.
- [Using Smart Wallets (JavaScript)](/docs/products/embedded-wallet/javascript/smart-wallet/send): Send transactions with Openfort smart wallets in JavaScript. Learn how to execute transfers, contract calls, and sponsored transactions with code examples.
- [Using Your Own Authentication](/docs/products/embedded-wallet/react-native/auth/third-party): Integrate Openfort React Native with external auth providers like Firebase, Supabase, and Auth0. Connect your existing auth system to mobile embedded wallets.
- [AuthBoundary](/docs/products/embedded-wallet/react-native/components/auth-boundary): Use the Openfort AuthBoundary component to declaratively render content based on user authentication state in React Native. Simplify auth-aware UI rendering in.
- [useEmailAuth](/docs/products/embedded-wallet/react-native/hooks/useEmailAuth): Openfort React Native hook for email and password authentication. Implement secure sign-up and login flows with useEmailAuth in your mobile wallet app.
- [useEmailAuthOtp](/docs/products/embedded-wallet/react-native/hooks/useEmailAuthOtp): Openfort React Native hook for OTP-based email authentication and passwordless login. Implement seamless email verification with useEmailAuthOtp in mobile.
- [useEmbeddedEthereumWallet](/docs/products/embedded-wallet/react-native/hooks/useEmbeddedEthereumWallet): Openfort React Native hook for managing embedded Ethereum wallets with a state machine interface. Build EVM wallet features in your mobile application.
- [useEmbeddedSolanaWallet](/docs/products/embedded-wallet/react-native/hooks/useEmbeddedSolanaWallet): Openfort React Native hook for managing embedded Solana wallets with a state machine interface. Build Solana wallet features in your mobile application.
- [useGuestAuth](/docs/products/embedded-wallet/react-native/hooks/useGuestAuth): Openfort React Native hook for creating guest accounts with instant onboarding. Use useGuestAuth to let mobile users try your app without registration.
- [useOAuth](/docs/products/embedded-wallet/react-native/hooks/useOAuth): Openfort React Native hook for OAuth authentication with social providers like Google and Apple. Add social login to your mobile embedded wallet app.
- [useOpenfort](/docs/products/embedded-wallet/react-native/hooks/useOpenfort): Openfort React Native hook for accessing SDK initialization state and errors. Use useOpenfort to manage the Openfort client lifecycle in your mobile app.
- [useOpenfortClient](/docs/products/embedded-wallet/react-native/hooks/useOpenfortClient): Openfort React Native hook for accessing the underlying Openfort client for advanced operations. Use useOpenfortClient for low-level SDK interactions.
- [usePasskeyPrfSupport](/docs/products/embedded-wallet/react-native/hooks/usePasskeyPrfSupport): Check if the device supports passkey-based wallet recovery with the PRF extension (Android 14+, iOS 18+).
- [usePhoneAuthOtp](/docs/products/embedded-wallet/react-native/hooks/usePhoneAuthOtp): Openfort React Native hook for OTP-based phone authentication and passwordless login. Add SMS verification with usePhoneAuthOtp to your mobile wallet app.
- [useSignOut](/docs/products/embedded-wallet/react-native/hooks/useSignOut): Openfort React Native hook for signing out users and clearing authentication state. Use useSignOut to manage session cleanup in your mobile wallet app.
- [useUser](/docs/products/embedded-wallet/react-native/hooks/useUser): Openfort React Native hook for accessing the authenticated user and account information. Use useUser to display user profiles and manage state in mobile apps.
- [useWalletAuth](/docs/products/embedded-wallet/react-native/hooks/useWalletAuth): Openfort React Native hook for wallet authentication using SIWE (Sign-In with Ethereum). Enable Web3-native login with useWalletAuth in your mobile app.
- [Quickstart — Automatic recovery (React Native)](/docs/products/embedded-wallet/react-native/quickstart/automatic): Build a complete Openfort React Native app with automatic wallet recovery. Step-by-step tutorial for seamless authentication and embedded wallets on mobile devices.
- [Quickstart — Passkey recovery (React Native)](/docs/products/embedded-wallet/react-native/quickstart/passkey): Build a complete Openfort React Native app with passkey wallet recovery. Step-by-step tutorial for authentication and biometric-secured embedded wallets on mobile.
- [Quickstart — Password recovery (React Native)](/docs/products/embedded-wallet/react-native/quickstart/password): Build a complete Openfort React Native app with password wallet recovery. Step-by-step tutorial for authentication and password-secured embedded wallets on mobile.
- [Wallet actions](/docs/products/embedded-wallet/react-native/wallet/actions): Execute embedded wallet transactions and configure gas sponsorship in React Native apps with Openfort. Send transactions and sign messages on mobile platforms.
- [Get a wallet](/docs/products/embedded-wallet/react-native/wallet/active-wallet): Manage and switch the active wallet using Openfort's embedded wallet hooks in React Native. Handle multiple wallet accounts on mobile and control the active one.
- [Manage wallets](/docs/products/embedded-wallet/react-native/wallet/connect): Guide users through wallet creation and connection with Openfort React Native hooks. Implement the complete mobile wallet setup flow with recovery method selection.
- [Using Your Own Authentication](/docs/products/embedded-wallet/react/auth/third-party): Integrate Openfort React with external auth providers like Firebase, Supabase, and Auth0. Connect your existing authentication system to Openfort embedded wallets.
- [use7702Authorization](/docs/products/embedded-wallet/react/hooks/use7702Authorization): Openfort React hook for signing EIP-7702 authorizations for smart account features. Enable account abstraction with use7702Authorization in your app.
- [useAuthCallback](/docs/products/embedded-wallet/react/hooks/useAuthCallback): Openfort React hook for handling OAuth and email verification callback redirects. Use useAuthCallback to complete the authentication flow securely.
- [useConnectWithSiwe](/docs/products/embedded-wallet/react/hooks/useConnectWithSiwe): Openfort React hook for connecting and authenticating with SIWE after wallet connection. Use useConnectWithSiwe for seamless Web3 authentication flows.
- [useEmailAuth](/docs/products/embedded-wallet/react/hooks/useEmailAuth): Openfort React hook for email and password authentication flows. Implement secure sign-up and login with useEmailAuth in your embedded wallet app.
- [useEmailOtpAuth](/docs/products/embedded-wallet/react/hooks/useEmailOtpAuth): Openfort React hook for email OTP one-time password authentication. Implement passwordless email login with useEmailOtpAuth for a seamless experience.
- [useEthereumEmbeddedWallet](/docs/products/embedded-wallet/react/hooks/useEthereumEmbeddedWallet): Ethereum embedded wallet — address, chainId, provider, isConnected, plus create, list, setActive, export key. Your useAccount + useWalletClient + wallet management in one hook.
- [useEthereumWalletAssets](/docs/products/embedded-wallet/react/hooks/useEthereumWalletAssets): Openfort React hook for fetching wallet token balances across supported chains. Learn how to use useWalletAssets to display ERC-20 and native assets.
- [useGrantPermissions](/docs/products/embedded-wallet/react/hooks/useGrantPermissions): Openfort React hook for granting session key permissions using EIP-7715. Use useGrantPermissions to enable scoped, popupless wallet interactions.
- [useGuestAuth](/docs/products/embedded-wallet/react/hooks/useGuestAuth): Openfort React hook for creating guest accounts with instant onboarding. Use useGuestAuth to let users try your app without upfront authentication.
- [useOAuth](/docs/products/embedded-wallet/react/hooks/useOAuth): Openfort React hook for OAuth authentication with social providers like Google, Apple, and Discord. Integrate social login with useOAuth in your app.
- [useOpenfort](/docs/products/embedded-wallet/react/hooks/useOpenfort): Openfort React hook for accessing the core SDK context and client instance. Use useOpenfort to initialize and interact with Openfort in your React app.
- [usePhoneOtpAuth](/docs/products/embedded-wallet/react/hooks/usePhoneOtpAuth): Openfort React hook for phone OTP authentication via SMS. Implement passwordless phone login with usePhoneOtpAuth in your embedded wallet application.
- [useRevokePermissions](/docs/products/embedded-wallet/react/hooks/useRevokePermissions): Openfort React hook for revoking session key permissions. Use useRevokePermissions to manage and revoke EIP-7715 session keys in your application.
- [useSignOut](/docs/products/embedded-wallet/react/hooks/useSignOut): Openfort React hook for signing out users and clearing authentication state. Use useSignOut to securely end user sessions in your embedded wallet app.
- [useSolanaEmbeddedWallet](/docs/products/embedded-wallet/react/hooks/useSolanaEmbeddedWallet): Solana embedded wallet create, list, setActive, export key.
- [useUI](/docs/products/embedded-wallet/react/hooks/useUI): Openfort React hook for controlling the wallet modal programmatically. Use useUI to open, close, and manage the Openfort modal UI in your application.
- [useUser](/docs/products/embedded-wallet/react/hooks/useUser): Openfort React hook for accessing the current authenticated user and account details. Use useUser to display user profiles and manage account state.
- [useWalletAuth](/docs/products/embedded-wallet/react/hooks/useWalletAuth): Openfort React hook for wallet authentication using SIWE (Sign-In with Ethereum). Enable Web3-native login with useWalletAuth for embedded wallets.
- [Quickstart — Passkey recovery (React)](/docs/products/embedded-wallet/react/quickstart/passkey): Build the Openfort React quickstart with passkey wallet recovery. Follow this tutorial to set up authentication and biometric-secured embedded wallets step by step.
- [Quickstart — Password recovery (React)](/docs/products/embedded-wallet/react/quickstart/password): Build the Openfort React quickstart with password wallet recovery. Follow this tutorial to set up authentication and password-secured embedded wallets step by step.
- [Openfort UI Configuration](/docs/products/embedded-wallet/react/ui/configuration): Configure Openfort React UI components for your application. Set up authentication providers, wallet options, and styling parameters for the pre-built UI elements.
- [Customization](/docs/products/embedded-wallet/react/ui/customization): Customize the look and feel of Openfort React UI components to match your brand. Configure themes, colors, typography, and styling for authentication and wallet UIs.
- [Wallet actions](/docs/products/embedded-wallet/react/wallet/actions): Send transactions, sign messages, and switch chains with Openfort embedded wallets in React. Complete guide to wallet actions including gas sponsorship.
- [Active wallet](/docs/products/embedded-wallet/react/wallet/active-wallet): View, list, and switch the active wallet with useEthereumEmbeddedWallet and useSolanaEmbeddedWallet.
- [Wallet asset inventory](/docs/products/embedded-wallet/react/wallet/assets): Query and display wallet assets including native tokens and ERC-20 tokens for Ethereum embedded wallets. For Solana, use the embedded wallet provider for balance.
- [Creating a new embedded wallet](/docs/products/embedded-wallet/react/wallet/create): Guide users through wallet creation and management with Openfort React hooks and UI components. Create embedded wallets with useEthereumEmbeddedWallet and useSolanaEmbeddedWallet hooks.
- [Disconnect Wallet](/docs/products/embedded-wallet/react/wallet/disconnect): Disconnect wallets from your React app with Openfort. Implement secure session cleanup, state reset, and smooth UI transitions when users disconnect their wallets.
- [Email And Password (iOS)](/docs/products/embedded-wallet/swift/auth/email): Implement email and password authentication in your iOS app using the Openfort Swift SDK. Enable secure sign-up and login flows with the OFSDK email auth methods.
- [External Wallet Authentication (iOS)](/docs/products/embedded-wallet/swift/auth/external-wallet): Connect external wallets in your iOS app using the Openfort Swift SDK. Enable users to authenticate via existing Ethereum wallets with SIWE integration.
- [Guest Mode (iOS)](/docs/products/embedded-wallet/swift/auth/guest): Implement guest authentication in your iOS app using the Openfort Swift SDK. Let users start without registration and upgrade their accounts later seamlessly.
- [Logout users (iOS)](/docs/products/embedded-wallet/swift/auth/logout): Implement user logout functionality in your iOS app using the Openfort Swift SDK. Securely clear sessions and authentication tokens with the OFSDK logout method.
- [Login with OAuth provider (iOS)](/docs/products/embedded-wallet/swift/auth/oauth): Implement OAuth social login in your iOS app using the Openfort Swift SDK. Support Google, Apple, Discord, and other OAuth providers for seamless authentication.
- [Reset Password (iOS)](/docs/products/embedded-wallet/swift/auth/reset-password): Implement password reset flows in your iOS app using the Openfort Swift SDK. Guide users through secure email-based password recovery with OFSDK methods.
- [Native Sign in with Apple (iOS)](/docs/products/embedded-wallet/swift/auth/sign-in-with-apple): Integrate native Sign in with Apple in your iOS app using the Openfort Swift SDK. Leverage Apple's authentication for seamless embedded wallet onboarding.
- [Third-party authentication (iOS)](/docs/products/embedded-wallet/swift/auth/third-party): Integrate third-party authentication providers in your iOS app using the Openfort Swift SDK. Connect Firebase, Supabase, or custom JWT providers with Openfort.
- [User Session (iOS)](/docs/products/embedded-wallet/swift/auth/user-session): Manage user sessions in your iOS app using the Openfort Swift SDK. Handle login state, session persistence, and automatic token refresh for embedded wallets.
- [Getting the EIP-1193 provider (iOS)](/docs/products/embedded-wallet/swift/wallet/ethereum-provider): Get the EIP-1193 Ethereum provider in your iOS app using the Openfort Swift SDK. Connect embedded wallets to Web3 libraries with a standard provider interface.
- [Export private key (iOS)](/docs/products/embedded-wallet/swift/wallet/export-key): Export embedded wallet private keys in your iOS app using the Openfort Swift SDK. Allow users to back up or migrate their keys to external wallet clients.
- [Create embedded wallets (iOS)](/docs/products/embedded-wallet/swift/wallet/recovery): Configure wallet recovery methods in your iOS app using the Openfort Swift SDK. Set up password, passkey, or automatic recovery for smart wallet key management.
- [Send a transaction (iOS)](/docs/products/embedded-wallet/swift/wallet/send): Send blockchain transactions in your iOS app using the Openfort Swift SDK. Execute native transfers and contract calls with embedded wallets and gas sponsorship.
- [Sign message (iOS)](/docs/products/embedded-wallet/swift/wallet/sign-message): Sign personal messages in your iOS app using the Openfort Swift SDK. Implement EIP-191 message signing for authentication and verification in embedded wallets.
- [Sign a transaction (iOS)](/docs/products/embedded-wallet/swift/wallet/sign-transaction): Sign transactions in your iOS app using the Openfort Swift SDK. Prepare and sign blockchain transactions for embedded wallets before broadcasting them.
- [Sign Typed Data (iOS)](/docs/products/embedded-wallet/swift/wallet/sign-typed): Sign EIP-712 typed data in your iOS app using the Openfort Swift SDK. Implement structured data signing for DeFi interactions and smart contract approvals.
- [Embedded Wallet State (iOS)](/docs/products/embedded-wallet/swift/wallet/state): Check embedded wallet state in your iOS app using the Openfort Swift SDK. Monitor wallet initialization, readiness, and recovery status with state management APIs.
- [Switch chains (iOS)](/docs/products/embedded-wallet/swift/wallet/switch-chains): Switch blockchain networks in your iOS app using the Openfort Swift SDK. Learn how to change chains dynamically for embedded wallet multi-chain support.
- [Email and Password (Unity)](/docs/products/embedded-wallet/unity/auth/email): Implement traditional email and password authentication for Unity games. For passwordless authentication, see Email OTP & SMS OTP.
- [External Wallet Authentication (Unity)](/docs/products/embedded-wallet/unity/auth/external-wallet): Connect external wallets via SIWE in Unity games using the Openfort SDK. Support players who prefer authenticating with their existing Ethereum wallet clients.
- [Guest Mode (Unity)](/docs/products/embedded-wallet/unity/auth/guest): Implement guest authentication in Unity games using the Openfort SDK. Allow players to start instantly and upgrade their guest accounts later with full wallets.
- [Email OTP & SMS OTP (Unity)](/docs/products/embedded-wallet/unity/auth/otp): Implement passwordless OTP authentication via email or SMS in Unity games using the Openfort SDK. Enable quick, secure login without passwords for players.
- [Third-party authentication (Unity)](/docs/products/embedded-wallet/unity/auth/third-party): Integrate JWT-based auth providers like Firebase, Supabase, and Better-Auth in Unity games using the Openfort SDK for secure player authentication flows.
- [User Session Management (Unity)](/docs/products/embedded-wallet/unity/auth/user-sessions): Manage player sessions in Unity games with the Openfort SDK. Handle token management, session persistence, automatic refresh, and secure logout for players.
- [Create and recover wallets in Unity](/docs/products/embedded-wallet/unity/signer/recovery): Set up wallet recovery methods in Unity games using the Openfort SDK. Configure automatic or password recovery options for player embedded wallets.
- [Sign messages (Unity)](/docs/products/embedded-wallet/unity/signer/sign-messages): Implement message signing in Unity games using the Openfort SDK. Allow players to sign personal messages and typed data with their embedded wallet securely.
- [Manage embedded wallet state (Unity)](/docs/products/embedded-wallet/unity/signer/state): Configure and manage Openfort embedded wallet states in Unity. Monitor wallet initialization, recovery status, and readiness with the Unity SDK state machine.
- [Using Smart Wallet (Unity)](/docs/products/embedded-wallet/unity/smart-wallet/send): Send blockchain transactions in Unity games using Openfort smart wallets. Execute transfers, contract interactions, and gas-sponsored transactions for players.
- [Paymaster Endpoints](/docs/products/infrastructure/paymaster/ethereum/endpoints): API reference for Openfort EVM Paymaster endpoints. Sponsor gas fees, estimate costs, and configure fee policies for Ethereum and EVM-compatible chain transactions.
- [Paymaster Errors](/docs/products/infrastructure/paymaster/ethereum/errors): Error codes and troubleshooting for the Openfort EVM Paymaster. Diagnose gas sponsorship failures, policy errors, and validation issues on Ethereum and EVM chains.
- [Solana Paymaster endpoints](/docs/products/infrastructure/paymaster/solana/endpoints): API reference for Openfort Solana Paymaster methods including transaction signing, fee estimation, and configuration. Sponsor Solana transaction fees for your users.
- [Solana fee sponsorship errors](/docs/products/infrastructure/paymaster/solana/errors): Error codes and troubleshooting for Openfort Solana Paymaster. Diagnose fee sponsorship failures, policy validation errors, and infrastructure issues on Solana.
- [Linking & unlinking accounts](/docs/products/embedded-wallet/javascript/auth/user-management/linking): Link and unlink user identities with the Openfort JavaScript SDK. Manage multiple auth methods including social accounts, wallets, and email for embedded wallets.
- [Session Keys (JavaScript)](/docs/products/embedded-wallet/javascript/smart-wallet/advanced/session-keys): Implement session keys for secure, scoped, and popupless transactions with Openfort smart wallets in JavaScript. Enable gasless background transactions.
- [Relay.link integration](/docs/products/embedded-wallet/javascript/smart-wallet/guides/bridge): Bridge tokens across chains in your app using the Openfort JavaScript SDK and Relay.link. Enable seamless cross-chain asset transfers for embedded wallets.
- [Export a wallet](/docs/products/embedded-wallet/react-native/wallet/actions/export-key): Export embedded wallet private keys in React Native with Openfort. Allow mobile users to back up their wallet keys or import them into external wallet clients.
- [Sign message (Solana)](/docs/products/embedded-wallet/react-native/wallet/actions/sign-message-solana): Sign Solana messages with Openfort embedded wallets in React Native. Implement Solana message signing for authentication and verification in your mobile application.
- [Sign EIP-7702 authorization](/docs/products/embedded-wallet/react/wallet/actions/eip-7702-authorization): Sign EIP-7702 authorization to enable smart account features on Delegated Accounts with Openfort embedded wallets in React.
- [Export a wallet](/docs/products/embedded-wallet/react/wallet/actions/export-key): Export embedded wallet private keys in React with Openfort. Allow users to back up their wallet keys or import them into external wallet clients like MetaMask.
- [Session Keys (React)](/docs/products/embedded-wallet/react/wallet/actions/session-keys): Learn how to use session keys for secure, scoped, and popupless transactions in Openfort smart wallets using React hooks.
- [Sign message](/docs/products/embedded-wallet/react/wallet/actions/sign-message): Sign personal messages and EIP-712 typed data with Openfort embedded wallets in React. Implement message signing for authentication, approvals, and verifications.
- [Sign message (Solana)](/docs/products/embedded-wallet/react/wallet/actions/sign-message-solana): Sign Solana messages with Openfort embedded wallets in React. Implement Solana message signing for authentication and verification in your decentralized application.
- [Switch chain](/docs/products/embedded-wallet/react/wallet/actions/switch-chain): Switch blockchain networks with Openfort embedded wallets in React. Change the active chain for smart and delegated accounts dynamically in your application.
- [Session Keys (Unity)](/docs/products/embedded-wallet/unity/smart-wallet/advanced/session-keys): Use session keys for secure, scoped, and popupless transactions in Unity games with Openfort smart wallets. Enable seamless background blockchain operations.
- [Send transaction (Ethereum)](/docs/products/embedded-wallet/react-native/wallet/actions/send-transaction/ethereum): Send Ethereum transactions with Openfort embedded wallets in React Native. Execute ERC-20 transfers and contract calls with optional gas sponsorship on mobile.
- [Send transaction (Solana)](/docs/products/embedded-wallet/react-native/wallet/actions/send-transaction/solana): Send Solana transactions with Openfort embedded wallets in React Native. Execute SOL transfers and program interactions with optional fee sponsorship on mobile.
- [Send transaction (Ethereum)](/docs/products/embedded-wallet/react/wallet/actions/send-transaction/ethereum): Send Ethereum transactions with Openfort embedded wallets in React. Execute native transfers, ERC-20 sends, and contract calls with optional gas sponsorship support.
- [Send transaction (Solana)](/docs/products/embedded-wallet/react/wallet/actions/send-transaction/solana): Send Solana transactions with Openfort embedded wallets in React. Execute SOL transfers and program interactions with optional fee sponsorship in your application.
-->

# Openfort CLI

The Openfort CLI lets you manage blockchain wallets, access-control policies, gas sponsorship, transaction intents, and other Openfort resources directly from the terminal. It supports both EVM and Solana chains.

<Cards>
  <Card title="Installation" description="Install the Openfort CLI" to="#installation" icon="lucide:download" />

  <Card title="Authenticate" description="Connect to your Openfort dashboard" to="#authenticate" icon="lucide:log-in" />

  <Card title="Example Flow" description="Quick walkthrough for an EVM transaction" to="#example-send-a-sponsored-transaction" icon="lucide:zap" />

  <Card title="Wallets Reference" description="Manage EVM & Solana wallets" to="#accounts-wallets" icon="lucide:wallet" />

  <Card title="Policies & Sponsorship" description="Set up gasless transactions" to="#policies" icon="lucide:fuel" />

  <Card title="Transactions" description="Manage and send transactions" to="#transactions" icon="lucide:send" />
</Cards>

<details>
  <summary>Key Concepts</summary>

  Before using the CLI, it helps to understand the core resource model:

  * **EOA (Externally Owned Account)** — A standard EVM backend wallet created with `accounts evm create`. This is the base key pair you sign with.
  * **Delegated Account** — An EOA upgraded to a smart account via EIP-7702 (`accounts evm update`). Delegated accounts support account abstraction (gasless transactions). Each delegated account is chain-specific and has its own `acc_` ID separate from the EOA.
  * **Policy** — A rule set that governs which operations are allowed (e.g., sponsoring gas on a specific chain).
  * **Sponsorship** — Links a policy to a gas payment strategy (e.g., `pay_for_user`), enabling gasless transactions.
  * **Transaction Intent** — A record of a desired on-chain action. Created via the API, it may require signing before broadcast.

  **Sending Transactions: Two Approaches**

  There are two ways to send transactions. Choose based on your use case:

  | Approach | Command | Best for |
  | :--- | :--- | :--- |
  | **Sponsored (recommended)** | `openfort accounts evm send-transaction` | Gasless transactions. Handles everything automatically: finds or creates a delegated account, signs EIP-7702 authorization, creates the transaction intent, signs and submits it. Pass an **EOA** account ID. |
  | **Manual (advanced)** | `openfort transactions create` + `openfort transactions sign` | When you need fine-grained control over each step, external signing, or non-backend wallets. Requires a **delegated** account ID. You must handle signing separately. |

  :::tip
  For most use cases, use `openfort accounts evm send-transaction`. It wraps the entire delegation and signing flow into a single command. The `openfort transactions` commands are for advanced scenarios where you need to separate transaction creation from signing.
  :::
</details>

## Installation

```bash
npm install -g @openfort/cli
```

After installation, the `openfort` command is available globally.

## Authenticate

```bash
openfort login
```

This opens your browser to the Openfort dashboard. After you authorize, the CLI stores your API key, publishable key, and project ID in a local credentials file at `~/.config/openfort/credentials` (or `$XDG_CONFIG_HOME/openfort/credentials` if set).

:::tip
All commands except `login` require authentication. The CLI reads your credentials automatically from the stored file. After logging in, run `openfort backend-wallet setup` to set up signing keys.
:::

## Example: Send a Sponsored Transaction

This walkthrough creates a backend wallet and sends a gasless transaction on Base Sepolia (chain ID 84532).

::::steps

### Authenticate

```bash
openfort login
```

### Generate wallet keys

```bash
openfort backend-wallet setup
```

### Create a backend wallet

```bash
openfort accounts evm create
# Returns: acc_<your-eoa-id>
```

### Register the target smart contract

```bash
openfort contracts create \
  --name "My Token" \
  --address 0xbabe0001489722187FbaF0689C47B2f5E97545C5 \
  --chainId 84532
```

### Create a policy and sponsorship for gas

```bash
# Create a policy that allows sponsoring transactions on Base Sepolia
openfort policies create \
  --scope project \
  --rules '[{"action":"accept","operation":"sponsorEvmTransaction","criteria":[{"type":"evmNetwork","operator":"in","chainIds":[84532]}]}]'
# Returns: ply_<your-policy-id>

# Create a sponsorship linked to the policy
openfort sponsorship create \
  --policyId ply_<your-policy-id> \
  --strategy pay_for_user \
  --name "Base Sepolia Gas" \
  --chainId 84532
# Returns: pol_<your-sponsorship-id>
```

### Send a gasless transaction

Use `accounts evm send-transaction` with the **EOA** account ID. The command auto-delegates the account via EIP-7702, signs, and broadcasts:

```bash
openfort accounts evm send-transaction acc_<your-eoa-id> \
  --chainId 84532 \
  --interactions '[{"to":"0xbabe0001489722187FbaF0689C47B2f5E97545C5","data":"0x40c10f19000000000000000000000000<your-address-hex>0000000000000000000000000000000000000000000000000de0b6b3a7640000","value":"0"}]' \
  --policy pol_<your-sponsorship-id>
```

### Verify the transaction

```bash
openfort transactions get <tin-id>
```

::::

## Backend Wallet Key Setup

Before you can create wallets, sign data, or send transactions, you need to generate and register backend wallet signing keys (ECDSA P-256):

```bash
openfort backend-wallet setup
```

This generates an ECDSA P-256 key pair, registers it with Openfort, and saves the keys to your credentials file. You can also rotate or revoke keys:

```bash
openfort backend-wallet rotate
openfort backend-wallet revoke
```

## Accounts (Embedded Wallets)

Manage backend wallets on both EVM and Solana chains.

### List all accounts

```bash
openfort accounts list
openfort accounts list --chainType EVM --custody Developer --limit 10
```

| Option | Description |
| :--- | :--- |
| `--limit`, `-l` | Max number of results |
| `--skip` | Number of results to skip |
| `--chainType` | Filter by chain type: `EVM` or `SVM` |
| `--custody` | Filter by custody model: `Developer` or `User` |

### EVM Wallets

```bash
# Create a new EVM backend wallet (EOA)
openfort accounts evm create

# List EOA wallets
openfort accounts evm list --limit 5

# List delegated (smart) accounts
openfort accounts evm list-delegated --limit 5

# List smart accounts
openfort accounts evm list-smart --limit 5

# Get wallet details
openfort accounts evm get <id>

# Sign data with an EOA
openfort accounts evm sign <id> --data 0x1234abcd

# Import an existing private key
openfort accounts evm import --privateKey 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Export a private key
openfort accounts evm export <id>

# Delete a wallet
openfort accounts evm delete <id>
```

#### Upgrading to a Delegated Account (EIP-7702)

Upgrade an EOA to a delegated smart account on a specific chain. This registers the delegation with Openfort — the on-chain EIP-7702 delegation happens automatically on the first transaction.

```bash
openfort accounts evm update <eoa-id> \
  --chainId 84532 \
  --implementationType CaliburV9
```

:::info
The `--implementationType` specifies the smart account implementation. Availability varies by chain. The delegated account receives a new `acc_` ID which you can retrieve with `accounts evm list-delegated`.
:::

#### Sending a Sponsored Transaction

This is the **recommended** way to send transactions. Pass an **EOA** account ID — the command automatically handles delegation, EIP-7702 authorization signing, transaction intent creation, and submission:

```bash
openfort accounts evm send-transaction <eoa-id> \
  --chainId 84532 \
  --interactions '[{"to":"0x...","data":"0x...","value":"0"}]' \
  --policy pol_abc123
```

The `--policy` flag references a sponsorship ID (starts with `pol_`) that covers gas fees. Without it, the account's own native tokens are used.

### Solana Wallets

```bash
# Create a new Solana backend wallet
openfort accounts solana create

# List Solana wallets
openfort accounts solana list

# Get wallet details
openfort accounts solana get <id>

# Sign data
openfort accounts solana sign <id> --data SGVsbG8gV29ybGQ=

# Import / Export
openfort accounts solana import --privateKey <base58-key>
openfort accounts solana export <id>

# Delete a wallet
openfort accounts solana delete <id>

# Transfer SOL (--token defaults to "sol", --cluster defaults to mainnet-beta)
openfort accounts solana transfer <id> \
  --to FDx9mf... \
  --amount 1000000 \
  --cluster devnet

# Transfer USDC
openfort accounts solana transfer <id> \
  --to FDx9mf... \
  --amount 500 \
  --token usdc \
  --cluster mainnet-beta

# Transfer SPL token by mint address
openfort accounts solana transfer <id> \
  --to FDx9mf... \
  --amount 500 \
  --token <mint-address> \
  --cluster mainnet-beta
```

## Smart Contracts

Register and manage smart contracts for use in transactions and policies. When you register a contract by address, Openfort automatically fetches and stores its ABI if the contract is verified on-chain.

```bash
# List contracts
openfort contracts list --limit 10

# Register a contract (ABI auto-fetched if verified on-chain)
openfort contracts create \
  --name USDC \
  --address 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359 \
  --chainId 137

# Register with explicit ABI
openfort contracts create \
  --name "My Contract" \
  --address 0x... \
  --chainId 137 \
  --abi '[{"type":"function","name":"transfer",...}]'

# Get contract details
openfort contracts get <id>

# Update a contract
openfort contracts update <id> --name "USDC v2" --chainId 137 --address 0x... --abi '[{"type":"function","name":"transfer",...}]'

# Delete a contract
openfort contracts delete <id>
```

| Option | Description |
| :--- | :--- |
| `--name` | Human-readable contract name |
| `--address` | Contract address on-chain |
| `--chainId` | Chain ID where the contract is deployed |
| `--abi` | Contract ABI as a JSON string (optional — auto-fetched for verified contracts) |

## Policies

Create access-control policies that govern which transactions are allowed or sponsored.

```bash
# List policies
openfort policies list --scope project --enabled true

# Create a policy to sponsor transactions on a chain
openfort policies create \
  --scope project \
  --description "Sponsor transactions on Base Sepolia" \
  --priority 1 \
  --rules '[{"action":"accept","operation":"sponsorEvmTransaction","criteria":[{"type":"evmNetwork","operator":"in","chainIds":[84532]}]}]'

# Get / Update / Delete
openfort policies get <id>
openfort policies update <id> --enabled false
openfort policies delete <id>

# Evaluate a policy (pre-flight check)
openfort policies evaluate --operation sponsorEvmTransaction --accountId acc_abc123
```

| Option | Description |
| :--- | :--- |
| `--scope` | Policy scope: `project`, `account`, or `transaction` |
| `--description` | Human-readable description |
| `--priority` | Priority order (higher = evaluated first) |
| `--rules` | JSON array of policy rules |
| `--enabled` | Enable or disable the policy |

## Gas Sponsorship

Set up gas fee sponsorship so your users don't pay for transactions. A sponsorship links a policy to a payment strategy.

```bash
# List sponsorships
openfort sponsorship list --enabled true

# Create a sponsorship linked to a policy
openfort sponsorship create \
  --policyId ply_abc123 \
  --name "Base Sepolia Gas Sponsor" \
  --strategy pay_for_user \
  --chainId 84532

# Get details
openfort sponsorship get <id>

# Update
openfort sponsorship update <id> --name "Updated Sponsor" --strategy pay_for_user --policyId ply_abc123

# Enable / Disable
openfort sponsorship enable <id>
openfort sponsorship disable <id>

# Delete
openfort sponsorship delete <id>
```

| Strategy | Description |
| :--- | :--- |
| `pay_for_user` | Fully sponsor the user's gas fees (default) |
| `charge_custom_tokens` | Charge the user in custom tokens |
| `fixed_rate` | Charge a fixed rate |

:::info
After creating a sponsorship, you receive a `pol_` ID. Pass this as `--policy` to `send-transaction` or `transactions create` to enable gas sponsorship.
:::

## Transactions

Transaction intents represent desired on-chain actions. There are two levels of commands:

### Recommended: `accounts evm send-transaction`

For **sponsored/gasless transactions**, use `accounts evm send-transaction` with an **EOA** account ID. It handles the full lifecycle automatically:

1. Finds or creates a delegated account for the EOA on the target chain
2. Signs the EIP-7702 authorization (if this is the first transaction)
3. Creates the transaction intent
4. Signs and submits the transaction

```bash
openfort accounts evm send-transaction <eoa-id> \
  --chainId 84532 \
  --interactions '[{"to":"0x...","data":"0x...","value":"0"}]' \
  --policy pol_abc123
```

### Advanced: `transactions` commands

For **fine-grained control** or external signing workflows, use the `transactions` commands directly. These work with **delegated** account IDs (obtained from `accounts evm update` or `accounts evm list-delegated`).

```bash
# Create a transaction intent (returns a signableHash in nextAction)
openfort transactions create \
  --account <delegated-acc-id> \
  --chainId 84532 \
  --interactions '[{"to":"0x...","data":"0x...","value":"0"}]' \
  --policy pol_abc123

# Sign the signableHash with the EOA
openfort accounts evm sign <eoa-id> --data <signableHash>

# Submit the signature to broadcast
openfort transactions sign <tin-id> --signature <hex-signature>
```

:::warning
When using `transactions create` with a newly delegated account, you may need to pass `--signedAuthorization` with a signed EIP-7702 authorization for the first transaction. Without it, the on-chain delegation won't be established and the transaction will fail with a signature error. Use `accounts evm send-transaction` to avoid this complexity.
:::

### Other transaction commands

```bash
# List transactions
openfort transactions list --limit 20

# Get transaction details and status
openfort transactions get <tin-id>

# Estimate gas cost before sending
openfort transactions estimate \
  --account <acc-id> \
  --chainId 84532 \
  --interactions '[{"to":"0x...","data":"0x...","value":"0"}]' \
  --policy pol_abc123

# Sign with optimistic return (don't wait for on-chain confirmation)
openfort transactions sign <tin-id> --signature 0x... --optimistic true
```

## Sessions

Manage session keys that let users sign transactions for a limited time without repeated approvals.

```bash
# List sessions
openfort sessions list --player pla_abc123

# Create a session key
openfort sessions create \
  --address 0x... \
  --chainId 137 \
  --validAfter 1700000000 \
  --validUntil 1700086400 \
  --player pla_abc123 \
  --account acc_abc123 \
  --limit 100 \
  --policy pol_abc123 \
  --whitelist '["con_abc123"]'

# Get session details
openfort sessions get <id>

# Sign a session
openfort sessions sign <id> --signature 0x...

# Sign a session with optimistic return (don't wait for on-chain confirmation)
openfort sessions sign <id> --signature 0x... --optimistic true

# Revoke sessions
openfort sessions revoke --address 0x... --chainId 137 --player pla_abc123 --policy pol_abc123
```

## Users

View and manage users in your project.

```bash
# List users
openfort users list --email user@example.com --name "John" --limit 10

# Get user details
openfort users get <id>

# Delete a user
openfort users delete <id>
```

## Paymasters

Configure ERC-4337 paymaster contracts.

```bash
# Create a paymaster
openfort paymasters create --address 0x... --name "My Paymaster" --url https://paymaster.example.com

# Get / Update / Delete
openfort paymasters get <id>
openfort paymasters update <id> --address 0x... --name "Updated Paymaster" --url https://paymaster.example.com
openfort paymasters delete <id>
```

| Option | Required | Description |
| :--- | :--- | :--- |
| `--address` | Yes | Paymaster contract address |
| `--name` | No | Human-readable paymaster name |
| `--url` | No | Paymaster service URL |

:::info
When updating a paymaster, `--address` is always required even if you only want to change other fields.
:::

## Subscriptions (Webhooks)

Subscribe to Openfort events and configure webhook triggers.

```bash
# List subscriptions
openfort subscriptions list

# Create a subscription with a webhook trigger
openfort subscriptions create \
  --topic transaction_intent.successful \
  --triggers '[{"type":"webhook","target":"https://myapp.com/webhooks"}]'

# Get / Delete
openfort subscriptions get <id>
openfort subscriptions delete <id>
```

### Managing Triggers

```bash
# List triggers for a subscription
openfort subscriptions triggers list <subscriptionId>

# Add a trigger
openfort subscriptions triggers create <subscriptionId> \
  --target https://myapp.com/webhooks \
  --type webhook

# Add an email trigger
openfort subscriptions triggers create <subscriptionId> \
  --target alerts@myapp.com \
  --type email

# Get / Delete a trigger
openfort subscriptions triggers get <subscriptionId> <triggerId>
openfort subscriptions triggers delete <subscriptionId> <triggerId>
```

### Available Topics

| Topic | Description |
| :--- | :--- |
| `transaction_intent.broadcast` | Transaction was broadcast to the network |
| `transaction_intent.successful` | Transaction completed successfully |
| `transaction_intent.cancelled` | Transaction was cancelled |
| `transaction_intent.failed` | Transaction failed |
| `balance.project` | Project balance changed |
| `balance.contract` | Contract balance changed |
| `balance.dev_account` | Developer account balance changed |
| `user.created` | A new user was created |
| `user.updated` | A user was updated |
| `user.deleted` | A user was deleted |
| `account.created` | A new account was created |
| `test` | Test event for verifying webhooks |

## Embedded Wallet Keys (Shield)

Set up Shield encryption keys for embedded wallets:

```bash
openfort embedded-wallet setup --project pro_abc123
```

This registers encryption keys with the Shield service and stores `SHIELD_PUBLISHABLE_KEY`, `SHIELD_SECRET_KEY`, and `SHIELD_ENCRYPTION_SHARE` in your credentials file.

## Message Utilities

Hash messages using keccak256:

```bash
openfort message hash "Hello World"
```

## Integrations

The CLI includes built-in integration commands:

```bash
# Generate shell completion script (bash, zsh, fish, nushell)
openfort completions

# Register the CLI as an MCP (Model Context Protocol) server
openfort mcp add

# Sync skill files to AI agents
openfort skills add
```

## Configuration

### Credentials File

The CLI stores credentials at:

* **Linux/macOS**: `~/.config/openfort/credentials` (or `$XDG_CONFIG_HOME/openfort/credentials`)
* **Windows**: `%APPDATA%/openfort/credentials`

The file contains key-value pairs:

```text
OPENFORT_API_KEY=sk_test_...
OPENFORT_PUBLISHABLE_KEY=pk_test_...
OPENFORT_PROJECT_ID=pro_...
OPENFORT_WALLET_SECRET=...
OPENFORT_WALLET_KEY_ID=...
OPENFORT_WALLET_PUBLIC_KEY=...
```

### Environment Variables

You can override credentials via environment variables:

| Variable | Description |
| :--- | :--- |
| `OPENFORT_API_KEY` | Secret API key (required for all commands except `login`) |
| `OPENFORT_WALLET_SECRET` | Wallet encryption secret (required for wallet operations) |
| `OPENFORT_PUBLISHABLE_KEY` | Publishable key for client-side operations |
| `OPENFORT_BASE_URL` | Custom API base URL (default: `https://api.openfort.io`) |

## Global Options

Every command supports the following global options:

| Option | Description |
| :--- | :--- |
| `--format <toon\|json\|yaml\|md\|jsonl>` | Output format (default: `toon`) |
| `--filter-output <keys>` | Filter output by key paths (e.g. `foo,bar.baz,a[0,3]`) |
| `--verbose` | Show full output envelope |
| `--schema` | Show JSON Schema for the command |
| `--llms`, `--llms-full` | Print LLM-readable manifest |
| `--mcp` | Start as MCP stdio server |
| `--token-count` | Print token count of output instead of the output itself |
| `--token-limit <n>` | Limit output to n tokens |
| `--token-offset <n>` | Skip first n tokens of output |

:::tip
Use `--format json` to get machine-readable output for scripting and automation. Use `--filter-output` to extract specific fields from the response.
:::

## Learn more

<Cards>
  <Card title="Building with AI" description="Expose the CLI to AI agents via MCP" to="/docs/overview/building-with-ai" icon="lucide:bot" />

  <Card title="Openfort Dashboard" description="Manage your project visually" to="https://dashboard.openfort.io" icon="lucide:layout-dashboard" />

  <Card title="API Reference" description="View detailed API documentation" to="/docs/reference/api" icon="lucide:book-open" />
</Cards>
