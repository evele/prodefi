import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useUserBalance } from '../hooks/useBalance'

function RootLayout() {
  const { isConnected, eth, usdc } = useUserBalance()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              ProDefi ⚽
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Decentralized Football Predictions
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Balance Display */}
            {isConnected && (
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Balances</div>
                <div className="font-mono font-semibold text-gray-800 dark:text-white">
                  {eth.isLoading ? 'Loading...' : `${eth.amount} ${eth.symbol}`}
                </div>
                <div className="font-mono text-gray-700 dark:text-gray-200 text-sm">
                  {usdc.isLoading ? 'Loading...' : `${usdc.amount} ${usdc.symbol}`}
                </div>
              </div>
            )}
            
            {/* Navigation Links */}
            <nav className="flex gap-4 items-center">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors [&.active]:bg-white/20"
              >
                Home
              </Link>
              <Link 
                to="/predictions" 
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors [&.active]:bg-white/20"
              >
                Predictions
              </Link>
              <Link 
                to="/leaderboard" 
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors [&.active]:bg-white/20"
              >
                Leaderboard
              </Link>
              {import.meta.env.DEV && (
                <Link
                  to="/admin/dev"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors [&.active]:bg-white/20"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Wallet Connection */}
            <ConnectButton />
          </div>
        </header>

        {/* Page Content */}
        <Outlet />
      </div>
      
      {/* Dev Tools */}
      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
