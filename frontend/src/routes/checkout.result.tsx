import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { Button } from '../components/ui/button'
import { getCheckoutOrderStatus } from '../lib/orders'

export const Route = createFileRoute('/checkout/result')({
  component: CheckoutResultPage,
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: typeof search.orderId === 'string' ? search.orderId.trim() : '',
  }),
})

const POLLED_STATUSES = new Set(['pending_payment', 'awaiting_payment_confirmation', 'paid', 'minting'])

function buildStatusCopy(status: string, paymentStatus?: string | null, lastError?: string | null) {
  switch (status) {
    case 'pending_payment':
      return {
        title: 'Esperando pago',
        description: 'Mercado Pago todavía no confirmó un pago para esta orden.',
      }
    case 'awaiting_payment_confirmation':
      return {
        title: 'Pago en revisión',
        description: paymentStatus === 'pending'
          ? 'Tu pago quedó pendiente. Cuando Mercado Pago lo confirme, continuaremos con la emisión del cartón.'
          : 'Estamos esperando la confirmación final de Mercado Pago para continuar.',
      }
    case 'paid':
      return {
        title: 'Pago acreditado',
        description: 'El pago ya fue verificado. Estamos preparando la emisión de tu cartón.',
      }
    case 'minting':
      return {
        title: 'Emitiendo cartón',
        description: 'El pago fue aprobado y ahora estamos mintiendo tu cartón en la wallet conectada.',
      }
    case 'fulfilled':
      return {
        title: 'Cartón listo',
        description: 'Tu compra quedó completa. Ya puedes seguir con tus predicciones.',
      }
    case 'failed':
      return {
        title: 'No pudimos completar la compra',
        description: lastError || 'La orden quedó en estado fallido. Si el pago se debitó, revisamos el caso desde Firestore.',
      }
    default:
      return {
        title: 'Estado de orden',
        description: paymentStatus
          ? `Mercado Pago informó el estado ${paymentStatus}.`
          : 'Estamos esperando novedades de esta orden.',
      }
  }
}

function CheckoutResultPage() {
  const { orderId } = useSearch({ from: '/checkout/result' })

  const orderQuery = useQuery({
    queryKey: ['checkout-order', orderId],
    queryFn: () => getCheckoutOrderStatus(orderId),
    enabled: orderId.length > 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status && POLLED_STATUSES.has(status) ? 4000 : false
    },
    refetchOnWindowFocus: true,
  })

  const statusCopy = buildStatusCopy(
    orderQuery.data?.status || '',
    orderQuery.data?.paymentStatus,
    orderQuery.data?.lastError,
  )

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <section
        className="rounded-2xl border p-6"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--accent-gold)' }}>
          Checkout Mercado Pago
        </p>

        {!orderId && (
          <div className="mt-4 space-y-3">
            <h1 className="font-display text-2xl font-black uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
              Falta el identificador de la orden
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Vuelve al inicio e intenta abrir nuevamente el checkout desde la app.
            </p>
          </div>
        )}

        {orderId && orderQuery.isPending && (
          <div className="mt-4 space-y-3">
            <h1 className="font-display text-2xl font-black uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
              Consultando estado de la compra
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Estamos consultando tu orden en Firebase.
            </p>
          </div>
        )}

        {orderId && orderQuery.isError && (
          <div className="mt-4 space-y-3">
            <h1 className="font-display text-2xl font-black uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
              No pudimos leer la orden
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {orderQuery.error instanceof Error ? orderQuery.error.message : 'Error desconocido al consultar la orden.'}
            </p>
          </div>
        )}

        {orderId && orderQuery.data && (
          <div className="mt-4 space-y-5">
            <div>
              <h1 className="font-display text-2xl font-black uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                {statusCopy.title}
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {statusCopy.description}
              </p>
            </div>

            <div className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2" style={{ borderColor: 'var(--border-color)' }}>
              <StatusRow label="Orden" value={orderQuery.data.orderId} />
              <StatusRow label="Estado interno" value={orderQuery.data.status} />
              <StatusRow label="Estado MP" value={orderQuery.data.paymentStatus || 'n/a'} />
              <StatusRow label="Wallet destino" value={orderQuery.data.walletAddress} mono />
              <StatusRow label="Monto" value={`$${orderQuery.data.totalAmountArs} ARS`} />
              <StatusRow label="Torneo" value={String(orderQuery.data.tournamentId)} />
              {orderQuery.data.mintTxHash && <StatusRow label="Mint tx" value={orderQuery.data.mintTxHash} mono />}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/predictions" search={{ carton: undefined }}>Ir a predicciones</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function StatusRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </p>
      <p className={mono ? 'break-all font-mono text-sm' : 'text-sm'} style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  )
}
