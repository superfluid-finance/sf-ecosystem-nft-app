import { BigNumberish } from "ethers";
import { NFTChain } from "./chain";

type StreamInfoType = {
  flowRate: bigint;
  balanceTimestamp: number;
  totalAmountReceivedByMember: bigint;
  tokenSymbol: string;
  chain: string;
};
