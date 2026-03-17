import { useCallback, useEffect, useRef, useState } from 'react'
import type { Abi, Address } from 'viem'
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { extractErrorMessage } from '../lib/transaction-errors'

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
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract()
  const [isSimulating, setIsSimulating] = useState(false)
  const currentOptionsRef = useRef<WriteFeedbackOptions | null>(null)
  const currentToastIdRef = useRef<string | undefined>(undefined)
  const pendingHashRef = useRef<`0x${string}` | undefined>(undefined)
  const lastErrorKeyRef = useRef<string>('')

  const {
    data: receipt,
    error: receiptError,
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash })

  const prepareExecution = (options: WriteFeedbackOptions) => {
    currentOptionsRef.current = options
    currentToastIdRef.current = options.toastId
    pendingHashRef.current = undefined
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

  const sendPreparedRequest = (request: PreparedWriteRequest, options: WriteFeedbackOptions) => {
    prepareExecution(options)

    try {
      writeContract(request as never)
    } catch (error) {
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

      sendPreparedRequest(request as PreparedWriteRequest, options)
    } catch (error) {
      logError('simulation error', error)
      showErrorToast(error)
    } finally {
      setIsSimulating(false)
    }
  }

  useEffect(() => {
    if (!hash || pendingHashRef.current === hash) return

    pendingHashRef.current = hash
    const options = currentOptionsRef.current
    const toastId = currentToastIdRef.current ?? hash
    toast.loading(options?.pendingMessage ?? 'Transaction pending...', { id: toastId })
  }, [hash])

  useEffect(() => {
    if (!isSuccess || !hash) return

    const options = currentOptionsRef.current
    const toastId = currentToastIdRef.current ?? hash
    toast.success(options?.successMessage ?? 'Transaction confirmed.', { id: toastId })

    if (options?.onSuccess) {
      void Promise.resolve(options.onSuccess())
    }
  }, [hash, isSuccess])

  useEffect(() => {
    if (!writeError) return
    logError('write error', writeError)
    showErrorToast(writeError)
  }, [logError, showErrorToast, writeError])

  useEffect(() => {
    if (!receiptError) return
    logError('receipt error', receiptError)
    showErrorToast(receiptError)
  }, [logError, receiptError, showErrorToast])

  useEffect(() => {
    if (receipt?.status !== 'reverted' || receiptError) return

    const options = currentOptionsRef.current
    const toastId = currentToastIdRef.current ?? hash
    const message = options?.revertedMessage ?? 'Transaction was rejected on-chain.'
    const errorKey = `${toastId ?? 'no-id'}:${message}`

    if (lastErrorKeyRef.current === errorKey) return

    lastErrorKeyRef.current = errorKey
    toast.error(message, { id: toastId })
  }, [hash, receipt, receiptError])

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
