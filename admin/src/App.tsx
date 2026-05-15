import { AdminPage } from './AdminPage'
import { AdminWalletPanel } from './components/AdminWalletPanel'
import { Providers } from './components/providers'

export default function App() {
  return (
    <Providers>
      <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <main className="container mx-auto grid gap-8 px-4 py-6">
          <section className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.24em]" style={{ color: 'var(--text-secondary)' }}>
              ProDefi
            </p>
            <h1 className="font-display text-4xl font-black tracking-wide" style={{ color: 'var(--text-primary)' }}>
              Admin Console
            </h1>
            <p className="max-w-3xl text-sm" style={{ color: 'var(--text-secondary)' }}>
              Herramienta local separada del frontend publico. Usa una wallet EOA para operar contratos y administrar el torneo.
            </p>
          </section>

          <AdminWalletPanel />
          <AdminPage />
        </main>
      </div>
    </Providers>
  )
}
