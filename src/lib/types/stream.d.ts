import { BigNumberish } from "ethers";
import { NFTChain } from "./chain";

type StreamInfoType = {
  flowRate: bigint;
  balanceTimestamp: number;
  balance: bigint;
  tokenSymbol: string;
  chain: string;
};
