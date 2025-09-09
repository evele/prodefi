
import { useNavigate } from "@tanstack/react-router"
import { TokenStatusBadge } from "./TokenStatusBadge"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from "../lib/contracts"



export function CartonListItem({ tokenId, deadline }: { tokenId: bigint, deadline?: number }) {
    
    const navigate = useNavigate()

    const {data: cartonGroupsState, refetch: refetchCartonUsedState} = useReadContract({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'used',
        args: [tokenId],
        query: {
        // enabled: !!userAddress && isConnected, NOTE: proably this is handled by the father
        refetchInterval: 10000,
        refetchOnWindowFocus: true,
        }
    })

    const {data: cartonWinnersState, refetch: refetchCartonWinnersState} = useReadContract({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'winnersPredictions',
        args: [tokenId],
        query: {
        // enabled: !!userAddress && isConnected, NOTE: proably this is handled by the father
        refetchInterval: 10000,
        refetchOnWindowFocus: true,
        }
    })

    const cartonStatus = () => {
        const now = Math.floor(Date.now() / 1000)
        const expired = typeof deadline === 'number' && now >= deadline
        if (cartonGroupsState && cartonWinnersState) {
            return 'complete'
        }
        if (expired && !cartonGroupsState) {
            return 'expired'
        }
        if (cartonGroupsState) {
            return 'partial'
        }
        if (cartonWinnersState) {
            return 'partial'
        }
        return 'none'
    }


    return (
        <div key={tokenId.toString()} className="group flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => {
                navigate({
                    to: '/predictions',
                    search: { carton: tokenId.toString() }
                })
            }}
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    #{tokenId.toString()}
                </div>
                <div>
                    <div className="font-medium text-sm">Carton #{tokenId.toString()}</div>
                    <div className="text-xs text-gray-500">Click to predict</div>
                </div>
                </div>
                <div className="flex items-center gap-2">
                <TokenStatusBadge status={cartonStatus()}/>
                <span
                    className="text-gray-300 transition-opacity opacity-0 group-hover:opacity-100"
                    aria-hidden="true"
                >
                    ➔
                </span>
            </div>
        </div>
    )   
}
