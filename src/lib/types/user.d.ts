import { NFTChain } from "./chain";

type UserMintInfo = {
  mintedChain: NFTChain;
  timestamp: number;
  tokenId: number;
  claimedStream: boolean;
  tokenSeed: number;
};
