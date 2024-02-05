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

export const sepolia = /*#__PURE__*/ defineChain({
  id: 11_155_111,
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
  rpcUrls: {
    default: {
      http: [`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_SEPOLIA_KEY}`, 'https://rpc.sepolia.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
      apiUrl: 'https://api-sepolia.etherscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 751532,
    },
    ensRegistry: { address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' },
    ensUniversalResolver: {
      address: '0xBaBC7678D7A63104f1658c11D6AE9A21cdA09725',
      blockCreated: 5_043_334,
    },
  },
  testnet: true,
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
      nftContractAddress: '0x15C8796F2ff8165C16257001caEE928c8DecD851',
      gdaForwarderV1Address: `0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08`,
      poolAddress: `0x973fDDEC2022d9a1F0781A3C9204de09fc450495`,
      nativeTokenAddress: `0x96B82B65ACF7072eFEb00502F45757F254c2a0D4`
    }
  },
  {
    name: 'Ethereum Sepolia Testnet',
    logo: './network-icons/ethereum.svg',
    ticker: 'SEP',
    // @ts-ignore
    price: formatEther(10000000000000000 as unknown as bigint),
    viemChain: sepolia,
    gdaInfo: {
      nftContractAddress: '0x08748d13392f18f5040de7722a4e29859035c338',
      gdaForwarderV1Address: `0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08`,
      poolAddress: `0xFE1a6BC4c07Fc183c2e7473dF86471D559a3a4FB`,
      nativeTokenAddress: `0x30a6933Ca9230361972E413a15dC8114c952414e`
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
