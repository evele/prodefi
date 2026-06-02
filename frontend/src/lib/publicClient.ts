import { createPublicClient, http } from 'viem'
import { appChain, appRpcUrl } from './chains'

export const appPublicClient = createPublicClient({
  chain: appChain,
  transport: http(appRpcUrl),
})
