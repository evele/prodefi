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
        }
      }[status] || {
        text: "⏳ Loading...",
        iconColor: "bg-gray-400",
        className: "bg-gray-100 text-gray-700"    
      }

    return (
        <div className="flex items-center gap-2">
            {/* TODO: Check prediction status from contract */}
            <span className={`px-2 py-1 text-xs rounded-full ${statusConfig.className}`}>
            { status && statusConfig && (
                <div className={`w-3 h-3 rounded-full ${statusConfig.iconColor}`} />
            )}
            {statusConfig.text}
            </span>
            <span className="text-gray-400">→</span>
        </div>
    )
}