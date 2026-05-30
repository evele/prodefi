import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import './index.css'
import 'flag-icons/css/flag-icons.min.css'    
import { Providers } from './components/providers'
import { appChainId, appRpcHost } from './lib/chains'
import { CONTRACT_ADDRESSES } from './lib/contracts'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

function shortAddress(address: `0x${string}`) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

if (!import.meta.env.PROD) {
  console.info('[ProDefi runtime]', {
    chainId: appChainId,
    rpcHost: appRpcHost,
    contracts: {
      carton: shortAddress(CONTRACT_ADDRESSES.CARTON),
      predictions: shortAddress(CONTRACT_ADDRESSES.PREDICTIONS),
      treasury: shortAddress(CONTRACT_ADDRESSES.TREASURY),
    },
  })
}

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <Providers>
    <RouterProvider router={router} />
  </Providers>,
)
