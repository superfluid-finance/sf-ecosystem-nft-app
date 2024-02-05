import { Chain } from "viem";
import { AllChainMintInfos } from "../hooks/useGetChainMintInfos";

type NFTChain = {
  name: string;
  logo: string;
  ticker: string;
  price: number;
  viemChain: Chain;
  gdaInfo?: ChainGdaAddresses;
};

/** stores the contract variables such as adddresses
 * for each chain **/
type ChainMintInfo = {
  mintedCount: number;
  lastMintedTimestamp?: number;
  flowRunsUntil?: number; // timestamp the stream will be flowing until
};

type ChainGdaAddresses = {
  nftContractAddress: `0x${string}`;
  gdaForwarderV1Address: `0x${string}`;
  poolAddress: `0x${string}`;
  nativeTokenAddress: `0x${string}`;
};

type SelectedChainContextType = {
  selected: NFTChain;
  setSelected: Function;
};

type ChainMintInfosContextType = {
  chainMintInfos: AllChainMintInfos;
  setChainMintInfos: Function;
};
