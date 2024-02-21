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

/** Used to differentiate versions between deployments, as
 * we are retrieving data from local store for faster access
 * and if a new contract is deployed the minters from previous deployments
 * mint status should be reset; without having users to
 * manually clear their browser cache.
 */
export const VERSION = 4;

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
      poolAddress: "0x75a7013C0Ccd50C7624a0e5F05B2a9FfF82d126C",
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
