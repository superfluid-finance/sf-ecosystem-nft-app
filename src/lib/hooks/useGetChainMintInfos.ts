import { FLOW_DURATION, NETWORK_LIST } from "../default";
import { createPublicClient, http } from "viem";
import { gdaNftContractAbi } from "../abi/gdaNFTContract";
import { ChainMintInfo } from "../types/chain";
import { useEffect, useState } from "react";
import { GET_ALL_CHAIN_MINT_DETAILS } from "../queries.ts/networks";
import { useQuery } from "@apollo/client";

export type AllChainMintInfos = {
  [index: number]: ChainMintInfo
}


export const useGetChainMintInfos = () => {

  const { data } = useQuery(GET_ALL_CHAIN_MINT_DETAILS);
  const [chainMintInfos, setChainMintInfos] = useState<AllChainMintInfos>()


  useEffect(() => {
    if (data && data.mints.nodes.length > 0) {
      let allChainInfos:AllChainMintInfos = {}

      data.mints.nodes.forEach((chainInfo: any) => {
        allChainInfos[80001] = {
          mintedCount: Number(chainInfo.tokenID)+1,
          lastMintedTimestamp: Number(chainInfo.timestamp),
          flowRunsUntil: Number(new Date(Number(chainInfo.timestamp) + FLOW_DURATION))
        }
      }) 

      for(let i = 0; i < NETWORK_LIST.length; i++) {
        if(NETWORK_LIST[i].viemChain.id !== 80001) {
          allChainInfos[NETWORK_LIST[i].viemChain.id] = { mintedCount: 0, lastMintedTimestamp: undefined, flowRunsUntil: undefined}; 
        }
      }

      setChainMintInfos(allChainInfos)
    }
  }, [data])

  return chainMintInfos;
}