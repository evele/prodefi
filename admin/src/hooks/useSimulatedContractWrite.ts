import { useCallback, useRef, useState } from 'react'
import type { Abi, Address } from 'viem'
import { toast } from 'sonner'

import { extractErrorMessage } from '../../../frontend/src/lib/transaction-errors'
import { useAdminWallet } from '../lib/wallet'

type ContractWriteParameters = {
  address: Address
  abi: Abi
  functionName: string
  args?: readonly unknown[]
  value?: bigint
}

type PreparedWriteRequest = Record<string, unknown>

type WriteFeedbackOptions = {
  toastId?: string
  pendingMessage: string
  successMessage: string
  revertedMessage?: string
  mapError: (error: unknown) => string
  onSuccess?: () => void | Promise<void>
  logLabel?: string
}

export function useSimulatedContractWrite() {
  const { address, chainId, publicClient, walletClient } = useAdminWallet()
  const [isSimulating, setIsSimulating] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined)
  const currentOptionsRef = useRef<WriteFeedbackOptions | null>(null)
  const currentToastIdRef = useRef<string | undefined>(undefined)
  const lastErrorKeyRef = useRef<string>('')

  const prepareExecution = (options: WriteFeedbackOptions) => {
    currentOptionsRef.current = options
    currentToastIdRef.current = options.toastId
    lastErrorKeyRef.current = ''
  }

  const logError = useCallback((stage: string, error: unknown) => {
    const label = currentOptionsRef.current?.logLabel ?? 'Contract write'
    console.error(`${label} ${stage}:`, error)

    const details = extractErrorMessage(error)
    if (details) {
      console.error(`${label} ${stage} details:`, details)
    }
  }, [])

  const showErrorToast = useCallback((error: unknown) => {
    const options = currentOptionsRef.current
    if (!options) return

    const message = options.mapError(error)
    const toastId = currentToastIdRef.current ?? hash
    const errorKey = `${toastId ?? 'no-id'}:${message}`

    if (lastErrorKeyRef.current === errorKey) return

    lastErrorKeyRef.current = errorKey
    toast.error(message, toastId ? { id: toastId } : undefined)
  }, [hash])

  const sendPreparedRequest = async (request: PreparedWriteRequest, options: WriteFeedbackOptions) => {
    prepareExecution(options)

    if (!walletClient) {
      const error = new Error('Wallet not connected')
      logError('write error', error)
      showErrorToast(error)
      return
    }

    if (chainId === undefined || !walletClient.chain || chainId !== walletClient.chain.id) {
      const error = new Error('Wrong network')
      logError('write error', error)
      showErrorToast(error)
      return
    }

    try {
      setIsPending(true)
      const nextHash = await walletClient.writeContract(request as never)
      setHash(nextHash)
      const toastId = currentToastIdRef.current ?? nextHash
      toast.loading(options.pendingMessage, { id: toastId })

      setIsPending(false)
      setIsConfirming(true)
      const receipt = await publicClient.waitForTransactionReceipt({ hash: nextHash })
      setIsConfirming(false)

      if (receipt.status === 'reverted') {
        const message = options.revertedMessage ?? 'Transaction was rejected on-chain.'
        lastErrorKeyRef.current = `${toastId}:${message}`
        toast.error(message, { id: toastId })
        return
      }

      toast.success(options.successMessage, { id: toastId })

      if (options.onSuccess) {
        void Promise.resolve(options.onSuccess())
      }
    } catch (error) {
      setIsPending(false)
      setIsConfirming(false)
      logError('write error', error)
      showErrorToast(error)
    }
  }

  const simulateAndSend = async (parameters: ContractWriteParameters, options: WriteFeedbackOptions) => {
    prepareExecution(options)

    if (!publicClient) {
      const error = new Error('Public client unavailable')
      logError('simulation error', error)
      showErrorToast(error)
      return
    }

    if (!address) {
      const error = new Error('Wallet not connected')
      logError('simulation error', error)
      showErrorToast(error)
      return
    }

    setIsSimulating(true)

    try {
      const { request } = await publicClient.simulateContract({
        ...parameters,
        account: address,
      } as never)

      await sendPreparedRequest(request as PreparedWriteRequest, options)
    } catch (error) {
      logError('simulation error', error)
      showErrorToast(error)
    } finally {
      setIsSimulating(false)
    }
  }

  return {
    sendPreparedRequest,
    simulateAndSend,
    isSimulating,
    isPending,
    isConfirming,
    isBusy: isSimulating || isPending || isConfirming,
    hash,
  }
}
