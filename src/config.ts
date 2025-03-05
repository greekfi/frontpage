import { createConfig, http } from 'wagmi'
import { sepolia, mainnet, arbitrum, optimism, base, baseSepolia, plume, plumeTestnet } from 'wagmi/chains'
import { create } from 'zustand'
import { Chain } from 'wagmi/chains'

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

// Define available chains
export const availableChains = [
  sepolia,
  mainnet,
  arbitrum,
  optimism,
  base,
  baseSepolia,
  plume,
  plumeTestnet
]

// Create a store to manage the current chain
interface ChainState {
  currentChain: Chain
  setCurrentChain: (chain: Chain) => void
}

export const useChainStore = create<ChainState>((set) => ({
  currentChain: sepolia,
  setCurrentChain: (chain) => set({ currentChain: chain }),
}))

// Create a function to get the current config based on the selected chain
export const getConfig = () => {
  const { currentChain } = useChainStore.getState()
  
  return createConfig({
    chains: [currentChain],
    transports: {
      [currentChain.id]: http(
        currentChain.id === sepolia.id 
          ? "https://endpoints.omniatech.io/v1/eth/sepolia/public"
          : undefined
      ),
    },
  })
}

// Export the initial config
export const config = getConfig()