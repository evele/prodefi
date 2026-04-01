import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useUserBalance } from '../hooks/useBalance'
import { Home, Target, Trophy, Settings } from 'lucide-react'

function RootLayout() {
  const { isConnected, eth, usdc } = useUserBalance()

  const navLinkClass =
    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors [&.active]:text-[var(--accent-green)] hover:text-[var(--text-primary)]'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* ─── Sticky Header ─── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(11, 16, 32, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span
              className="font-display text-2xl font-black tracking-wide leading-none"
              style={{ color: 'var(--text-primary)' }}
            >
              PRODEFI
            </span>
            <span className="text-lg leading-none">⚽</span>
          </Link>

          {/* Desktop: nav + balances + connect */}
          <div className="hidden md:flex items-center gap-5">
            {isConnected && (
              <div
                className="flex items-center gap-3 text-xs font-mono"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span>{eth.isLoading ? '…' : `${eth.amount} ETH`}</span>
                <span style={{ color: 'var(--border-color)' }}>|</span>
                <span>{usdc.isLoading ? '…' : `${usdc.amount} USDC`}</span>
              </div>
            )}
            <nav className="flex gap-1" style={{ color: 'var(--text-secondary)' }}>
              <Link to="/" className={navLinkClass}>
                Inicio
              </Link>
              <Link
                to="/predictions"
                search={{ carton: undefined }}
                className={navLinkClass}
              >
                Predecir
              </Link>
              <Link to="/leaderboard" className={navLinkClass}>
                Tabla
              </Link>
              {import.meta.env.DEV && (
                <Link to="/admin/dev" className={navLinkClass}>
                  Admin
                </Link>
              )}
            </nav>
            <ConnectButton showBalance={false} />
          </div>

          {/* Mobile: only connect button */}
          <div className="md:hidden">
            <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="none" />
          </div>
        </div>
      </header>

      {/* ─── Page Content ─── */}
      <main className="container mx-auto px-4 py-6 pb-28 md:pb-10">
        <Outlet />
      </main>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{
          background: 'rgba(11, 16, 32, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border-color)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[10px] font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          activeProps={{ style: { color: 'var(--accent-green)' } }}
        >
          <Home size={20} strokeWidth={1.75} />
          <span>Inicio</span>
        </Link>
        <Link
          to="/predictions"
          search={{ carton: undefined }}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[10px] font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          activeProps={{ style: { color: 'var(--accent-green)' } }}
        >
          <Target size={20} strokeWidth={1.75} />
          <span>Predecir</span>
        </Link>
        <Link
          to="/leaderboard"
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[10px] font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          activeProps={{ style: { color: 'var(--accent-green)' } }}
        >
          <Trophy size={20} strokeWidth={1.75} />
          <span>Tabla</span>
        </Link>
        {import.meta.env.DEV && (
          <Link
            to="/admin/dev"
            className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[10px] font-medium transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            activeProps={{ style: { color: 'var(--accent-green)' } }}
          >
            <Settings size={20} strokeWidth={1.75} />
            <span>Admin</span>
          </Link>
        )}
      </nav>

      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
