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

/** Used to differentiate versions between deployments, as
 * we are retrieving data from local store for faster access
 * and if a new contract is deployed the minters from previous deployments
 * mint status should be reset; without having users to
 * manually clear their browser cache.
 */
export const VERSION = 2;

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
    gdaInfo: {
      nftContractAddress: "0xcd4e576ba1B74692dBc158c5F399269Ec4739577",
      gdaForwarderV1Address: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08",
      poolAddress: "0x75215c45088120F375De9C5FE52D41BfcD52CADC",
      nativeTokenAddress: "0x3aD736904E9e65189c3000c7DD2c8AC8bB7cD4e3",
      superTokenSymbol: `MATICx`,
    },
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
    gdaInfo: {
      nftContractAddress: "0xcd4e576ba1B74692dBc158c5F399269Ec4739577",
      gdaForwarderV1Address: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08",
      poolAddress: "0xe3cb3c990429a06012bf377ec5bbeb9a6ce25309",
      nativeTokenAddress: "0x59988e47A3503AaFaA0368b9deF095c818Fdca01",
      superTokenSymbol: `xDAIx`,
    },
  },
  {
    name: "Arbitrum",
    logo: "./network-icons/arbitrum.svg",
    ticker: "ETH",
    price: 0.005,
    viemChain: arbitrum,
    gdaInfo: {
      nftContractAddress: "0xcd4e576ba1B74692dBc158c5F399269Ec4739577",
      gdaForwarderV1Address: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08",
      poolAddress: "0x83A005498eA01D1cB0E6a5E120e4937a5A177029",
      nativeTokenAddress: "0xe6C8d111337D0052b9D88BF5d7D55B7f8385ACd3",
      superTokenSymbol: `ETHx`,
    },
  },
  {
    name: "Avalanche",
    logo: "./network-icons/avalanche.svg",
    ticker: "AVAX",
    price: 0.3,
    viemChain: avalanche,
    gdaInfo: {
      nftContractAddress: "0xcd4e576ba1B74692dBc158c5F399269Ec4739577",
      gdaForwarderV1Address: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08",
      poolAddress: "0xa7E6587494826Fd7a2fafE61E48F199E6DFFc83e",
      nativeTokenAddress: "0xBE916845D8678b5d2F7aD79525A62D7c08ABba7e",
      superTokenSymbol: `AVAXx`,
    },
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
    gdaInfo: {
      nftContractAddress: "0xcd4e576ba1B74692dBc158c5F399269Ec4739577",
      gdaForwarderV1Address: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08",
      poolAddress: "0x7576f7A4b691c51FdF1888E73CF829F2cE6d71f3",
      nativeTokenAddress: "0x4ac8bD1bDaE47beeF2D1c6Aa62229509b962Aa0d",
      superTokenSymbol: `ETHx`,
    },
  },
  {
    name: "BSC",
    logo: "./network-icons/bsc.svg",
    ticker: "BNB",
    price: 0.05,
    viemChain: bsc,
    gdaInfo: {
      nftContractAddress: "0xcd4e576ba1B74692dBc158c5F399269Ec4739577",
      gdaForwarderV1Address: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08",
      poolAddress: "0x8987BAA491Ae9738Fe99A4D2D267d5f189f8128e",
      nativeTokenAddress: "0x529A4116F160c833c61311569D6B33dFF41fD657",
      superTokenSymbol: `BNBx`,
    },
  },
  {
    name: "Celo",
    logo: "./network-icons/celo.svg",
    ticker: "CELO",
    price: 15.0,
    viemChain: celo,
    gdaInfo: {
      nftContractAddress: "0xcd4e576ba1B74692dBc158c5F399269Ec4739577",
      gdaForwarderV1Address: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08",
      poolAddress: "0x8987BAA491Ae9738Fe99A4D2D267d5f189f8128e", // need to verify
      nativeTokenAddress: "0x671425Ae1f272Bc6F79beC3ed5C4b00e9c628240",
      superTokenSymbol: `CELOx`,
    },
  },
  {
    name: "Base",
    logo: "./network-icons/base.svg",
    ticker: "ETH",
    price: 0.005,
    viemChain: base,
    gdaInfo: {
      nftContractAddress: "0xcd4e576ba1B74692dBc158c5F399269Ec4739577",
      gdaForwarderV1Address: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08",
      poolAddress: "0x12FC788EC80A6D6445DC17a2343F6993e6484A29",
      nativeTokenAddress: "0x46fd5cfB4c12D87acD3a13e92BAa53240C661D93",
      superTokenSymbol: `ETHx`,
    },
  },
  {
    name: "Scroll",
    logo: "./network-icons/scroll.svg",
    ticker: "ETH",
    price: 0.005,
    viemChain: scroll,
    gdaInfo: {
      nftContractAddress: "0xcd4e576ba1B74692dBc158c5F399269Ec4739577",
      gdaForwarderV1Address: "0x6DA13Bde224A05a288748d857b9e7DDEffd1dE08",
      poolAddress: "0xbe76d05092b4c1be17358c20e205192a49654c3a",
      nativeTokenAddress: "0x483C1716b6133cdA01237ebBF19c5a92898204B7",
      superTokenSymbol: `ETHx`,
    },
  },
];

export let TOOLTIP_TEXT =
  "The stream is extended back to 1 month each time someone mints.";

export let FLOW_DURATION = 2629746;

export const DEFAULT_SELECTED_CHAIN: NFTChain = NETWORK_LIST[1];
