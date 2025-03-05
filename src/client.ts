import { createPublicClient, http } from 'viem'
import { useChainStore } from './config'

export const getPublicClient = () => {
  const { currentChain } = useChainStore.getState()
  
  return createPublicClient({
    chain: currentChain,
    transport: http()
  })
}

export const publicClient = getPublicClient()