import { arbitrum, avalanche, base, bsc, celo, gnosis, optimism, polygon, scroll } from "viem/chains"
import { NFTChain } from "./types/chain"
import { defineChain, formatEther, parseEther } from "viem"

export const mumbai = defineChain({
  id: 80_001,
  name: 'Polygon Mumbai Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC'
  },
  rpcUrls: {
    default: {
      http: [`https://polygon-mumbai.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`, "https://polygon-mumbai.blockpi.network/v1/rpc/public", "https://polygon-mumbai-bor.publicnode.com", "https://matic-testnet-archive-rpc.bwarelabs.com"]
    }
  },
  blockExplorers: {
    default: { name: 'polygonscan', url: 'https://mumbai.polygonscan.com'},

  }
})

/** Default values */
export const NETWORK_LIST: NFTChain[] = [
  {
    name: 'Polygon',
    logo: './network-icons/polygon.svg',
    ticker: 'MATIC',
    price: 15.0,
    viemChain: polygon,
  },
  {
    name: 'Mumbai Testnet',
    logo: './network-icons/polygon.svg',
    ticker: 'MATIC',
    // @ts-ignore
    price: formatEther(10000000000000000 as unknown as bigint),
    viemChain: mumbai,
    gdaInfo: {
      nftContractAddress: '0x5644ae06901dd1d9cb5082685702b84b0b2d4da6',
      gdaForwarderV1Address: `0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08`,
      poolAddress: `0x531b5fA3E649885793088A1b6eEa3803edcb9caf`,
      nativeTokenAddress: `0x96B82B65ACF7072eFEb00502F45757F254c2a0D4`
    }
  },
  {
    name: 'Gnosis',
    logo: './network-icons/gnosis.svg',
    ticker: 'xDAI',
    price: 10.0,
    viemChain: gnosis
  },
  {
    name: 'Arbitrum',
    logo: './network-icons/arbitrum.svg',
    ticker: 'ETH',
    price: 0.005,
    viemChain: arbitrum
  },
  {
    name: 'Avalanche',
    logo: './network-icons/avalanche.svg',
    ticker: 'AVAX',
    price: 0.3,
    viemChain: avalanche
  },
  {
    name: 'Optimism',
    logo: './network-icons/optimism.svg',
    ticker: 'ETH',
    price: 0.005,
    viemChain: optimism
  },
  {
    name: 'BSC',
    logo: './network-icons/bsc.svg',
    ticker: 'BNB',
    price: 0.05,
    viemChain: bsc
  },
  {
    name: 'Celo',
    logo: './network-icons/celo.svg',
    ticker: 'CELO',
    price: 15.0,
    viemChain: celo
  },
  {
    name: 'Base',
    logo: './network-icons/base.svg',
    ticker: 'ETH',
    price: 0.005,
    viemChain: base
  },
  {
    name: 'Scroll',
    logo: './network-icons/scroll.svg',
    ticker: 'ETH',
    price: 0.005,
    viemChain: scroll
  },
]

export let TOOLTIP_TEXT = 'Explanation of the mechanic'

export let FLOW_DURATION = 2629746

export const DEFAULT_SELECTED_CHAIN: NFTChain = NETWORK_LIST[1]
