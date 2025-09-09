import type { PredictionStatus } from "../lib/types.ts"

export function TokenStatusBadge({status}: {status: PredictionStatus}) {

    const statusConfig = {
        'none': {
          text: "Not set",
          iconColor: "bg-gray-400",
          className: "bg-gray-100 text-gray-700"
        },
        'partial': {
          text: "Partial",
          iconColor: "bg-yellow-500",
          className: "bg-yellow-100 text-yellow-700"
        },
        'complete': {
          text: "Submitted",
          iconColor: "bg-green-500",
          className: "bg-green-100 text-green-700"
        },
        'expired': {
          text: "Expired",
          iconColor: "bg-red-500",
          className: "bg-red-100 text-red-700"
        }
      }[status] || {
        text: "⏳ Loading...",
        iconColor: "bg-gray-400",
        className: "bg-gray-100 text-gray-700"    
      }

    return (
        <span
          className={`inline-flex items-center gap-2 px-2 py-1 text-xs rounded-full ${statusConfig.className}`}
          role="status"
          aria-label={`Prediction status: ${statusConfig.text}`}
        >
          { status && statusConfig && (
            <span className={`w-3 h-3 rounded-full ${statusConfig.iconColor}`} aria-hidden="true" />
          )}
          {statusConfig.text}
        </span>
    )
}
