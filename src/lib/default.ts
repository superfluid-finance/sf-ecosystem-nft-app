import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  gnosis,
  optimism,
  polygon,
  scroll,
} from "viem/chains";
import { NFTChain } from "./types/chain";
import { defineChain, formatEther } from "viem";

/** Custom chains, using our own Alchemy RPC  */
export const mumbai = defineChain({
  id: 80_001,
  name: "Polygon Mumbai Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: {
      http: [
        `https://polygon-mumbai.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`,
        "https://polygon-mumbai.blockpi.network/v1/rpc/public",
        "https://polygon-mumbai-bor.publicnode.com",
        "https://matic-testnet-archive-rpc.bwarelabs.com",
      ],
    },
  },
  blockExplorers: {
    default: { name: "polygonscan", url: "https://mumbai.polygonscan.com" },
  },
});

export const sepolia = /*#__PURE__*/ defineChain({
  id: 11_155_111,
  name: "Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "SEP", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_SEPOLIA_KEY}`,
        "https://rpc.sepolia.org",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
      apiUrl: "https://api-sepolia.etherscan.io/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 751532,
    },
    ensRegistry: { address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" },
    ensUniversalResolver: {
      address: "0xBaBC7678D7A63104f1658c11D6AE9A21cdA09725",
      blockCreated: 5_043_334,
    },
  },
  testnet: true,
});

export const avalancheFuji = /*#__PURE__*/ defineChain({
  id: 43_113,
  name: "Avalanche Fuji",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche Fuji",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: {
      http: [
        "https://avalanche-fuji-c-chain.publicnode.com",
        "https://api.avax-test.network/ext/bc/C/rpc",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "SnowTrace",
      url: "https://testnet.snowtrace.io",
      apiUrl: "https://api-testnet.snowtrace.io/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 7096959,
    },
  },
  testnet: true,
});

/** Default values */
export const NETWORK_LIST: NFTChain[] = [
  {
    name: "Polygon",
    logo: "./network-icons/polygon.svg",
    ticker: "MATIC",
    price: 15.0,
    viemChain: polygon,
  },
  {
    name: "Mumbai Testnet",
    logo: "./network-icons/polygon.svg",
    ticker: "MATIC",
    // @ts-ignore
    price: formatEther(10000000000000000 as unknown as bigint),
    viemChain: mumbai,
    gdaInfo: {
      nftContractAddress: "0x511b730d0a99FED54B8211E69Ddc19755aac93ce",
      gdaForwarderV1Address: `0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08`,
      poolAddress: `0xa9de31c480B60451BB1Af97B7813007697983837`,
      nativeTokenAddress: `0x96B82B65ACF7072eFEb00502F45757F254c2a0D4`,
      superTokenSymbol: `MATICx`,
    },
  },
  {
    name: "Gnosis",
    logo: "./network-icons/gnosis.svg",
    ticker: "xDAI",
    price: 10.0,
    viemChain: gnosis,
  },
  {
    name: "Arbitrum",
    logo: "./network-icons/arbitrum.svg",
    ticker: "ETH",
    price: 0.005,
    viemChain: arbitrum,
  },
  {
    name: "Avalanche",
    logo: "./network-icons/avalanche.svg",
    ticker: "AVAX",
    price: 0.3,
    viemChain: avalanche,
  },
  {
    name: "Avalance Snowtrace Testnet",
    logo: "./network-icons/avalanche.svg",
    ticker: "AVAX",
    price: 0.01,
    viemChain: avalancheFuji,
    gdaInfo: {
      nftContractAddress: "0x23637e56c04D20c197D51b8b3C9bA4735ed90c5C",
      gdaForwarderV1Address: `0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08`,
      poolAddress: `0x8c9D05695A4602456C0A97a68C2168c87659a41D`,
      nativeTokenAddress: `0xfFD0f6d73ee52c68BF1b01C8AfA2529C97ca17F3`,
      superTokenSymbol: `AVAXx`,
    },
  },
  {
    name: "Optimism",
    logo: "./network-icons/optimism.svg",
    ticker: "ETH",
    price: 0.005,
    viemChain: optimism,
  },
  {
    name: "BSC",
    logo: "./network-icons/bsc.svg",
    ticker: "BNB",
    price: 0.05,
    viemChain: bsc,
  },
  {
    name: "Celo",
    logo: "./network-icons/celo.svg",
    ticker: "CELO",
    price: 15.0,
    viemChain: celo,
  },
  {
    name: "Base",
    logo: "./network-icons/base.svg",
    ticker: "ETH",
    price: 0.005,
    viemChain: base,
  },
  {
    name: "Scroll",
    logo: "./network-icons/scroll.svg",
    ticker: "ETH",
    price: 0.005,
    viemChain: scroll,
  },
];

export let TOOLTIP_TEXT =
  "The stream is extended back to 1 month each time someone mints.";

export let FLOW_DURATION = 2629746;

export const DEFAULT_SELECTED_CHAIN: NFTChain = NETWORK_LIST[1];
