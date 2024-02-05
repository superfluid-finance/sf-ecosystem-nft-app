import {
  Chain,
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  gnosis,
  mainnet,
  optimism,
  polygon,
  scroll,
} from "viem/chains";
import { mumbai, sepolia, avalancheFuji } from "./default";
import Decimal from "decimal.js";

export const truncateAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const viemChainLookupById = (id: number) => {
  let chain: Chain;

  switch (id) {
    case 1:
      chain = mainnet;
      break;
    case 100:
      chain = gnosis;
      break;
    case 137:
      chain = polygon;
      break;
    case 42161:
      chain = arbitrum;
      break;
    case 43114:
      chain = avalanche;
      break;
    case 10:
      chain = optimism;
      break;
    case 56:
      chain = bsc;
      break;
    case 42220:
      chain = celo;
      break;
    case 8453:
      chain = base;
      break;
    case 534352:
      chain = scroll;
      break;
    case 80001:
      chain = mumbai;
      break;
    case 11155111:
      chain = sepolia;
      break;
    case 43113:
      chain = avalancheFuji;
      break;
    default:
      chain = mainnet;
  }

  return chain;
};

export const getDecimalPlacesToRoundTo = (value: Decimal): number => {
  if (value.isZero()) {
    return 0;
  }

  const absoluteValue = value.abs();

  if (absoluteValue.gte(1000)) {
    return 0;
  }

  if (absoluteValue.gte(100)) {
    return 1;
  }

  if (absoluteValue.gte(10)) {
    return 2;
  }

  if (absoluteValue.gte(0.099)) {
    return 4;
  }

  if (absoluteValue.gte(0.00099)) {
    return 6;
  }

  if (absoluteValue.gte(0.0000099)) {
    return 8;
  }

  if (absoluteValue.gte(0.000000099)) {
    return 12;
  }

  if (absoluteValue.gte(0.0000000000099)) {
    return 16;
  }

  return 18;
};
