import {
  Chain,
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
import Decimal from "decimal.js";

export const truncateAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const viemChainLookupById = (id: number) => {
  let chain: Chain = polygon;
  let rpcUrl: string = import.meta.env.VITE_POLYGON_MAINNET_RPC;

  switch (id) {
    case 100:
      chain = gnosis;
      rpcUrl = import.meta.env.VITE_XDAI_MAINNET_RPC;
      break;
    case 137:
      chain = polygon;
      rpcUrl = import.meta.env.VITE_POLYGON_MAINNET_RPC;
      break;
    case 42161:
      chain = arbitrum;
      rpcUrl = import.meta.env.VITE_ARBITRUM_ONE_RPC;
      break;
    case 43114:
      chain = avalanche;
      rpcUrl = import.meta.env.VITE_AVALANCHE_RPC;
      break;
    case 10:
      chain = optimism;
      rpcUrl = import.meta.env.VITE_OPTIMISM_MAINNET_RPC;
      break;
    case 56:
      chain = bsc;
      rpcUrl = import.meta.env.VITE_BSC_MAINNET_RPC;
      break;
    case 42220:
      chain = celo;
      rpcUrl = import.meta.env.VITE_CELO_MAINNET_RPC;
      break;
    case 8453:
      chain = base;
      rpcUrl = import.meta.env.VITE_BASE_MAINNET_RPC;
      break;
    case 534352:
      chain = scroll;
      rpcUrl = import.meta.env.VITE_SCROLL_MAINNET_RPC;
      break;
    default:
      chain = polygon;
      rpcUrl = import.meta.env.VITE_POLYGON_MAINNET_RPC;
  }

  return { chain, rpcUrl };
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

export const absoluteValue = (n: bigint) => {
  return n >= 0 ? n : -n;
};

export function toFixedUsingString(numStr: string, decimalPlaces: number) {
  const [wholePart, decimalPart] = numStr.split(".");

  if (!decimalPart || decimalPart.length <= decimalPlaces) {
    return numStr.padEnd(wholePart.length + 1 + decimalPlaces, "0");
  }

  const decimalPartBigInt = BigInt(decimalPart.slice(0, decimalPlaces + 1));

  const round = decimalPartBigInt % 10n >= 5n;
  const roundedDecimal = decimalPartBigInt / 10n + (round ? 1n : 0n);

  return (
    wholePart + "." + roundedDecimal.toString().padStart(decimalPlaces, "0")
  );
}
