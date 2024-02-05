import { FLOW_DURATION, NETWORK_LIST } from "../default";
import { createPublicClient, http } from "viem";
import { gdaNftContractAbi } from "../abi/gdaNFTContract";
import { ChainMintInfo } from "../types/chain";
import { useEffect, useState } from "react";

export type AllChainMintInfos = {
  [index: number]: ChainMintInfo
}


export const useGetChainMintInfos = () => {

  const [chainMintInfos, setChainMintInfos] = useState<AllChainMintInfos>()

  const getChainMintInfos = async() => {
    let publicClient;

    /** object of chain ids as keys, mapped to a lastMintDetails obj as value */
    let allMintInfos:AllChainMintInfos = {}

    for(let i = 0; i < NETWORK_LIST.length; i++) {

      let lastMintDetails: ChainMintInfo = { mintedCount: 0, lastMintedTimestamp: undefined, flowRunsUntil: undefined}; 

      if (NETWORK_LIST[i].gdaInfo) {

        publicClient = createPublicClient({
          cacheTime: 60_000, 
          chain: NETWORK_LIST[i].viemChain!,
          transport: http()
        })

        const gdaNftContract = {
          address: NETWORK_LIST[i].gdaInfo?.nftContractAddress as `0x${string}`,
          abi: gdaNftContractAbi
        } as const

        /** If addresses have been set, query their last minted timestamp, flow remaining time and token count */
        const lastMintTimestamp = await publicClient.readContract({
          ...gdaNftContract,
          functionName: 'lastMintTimestamp'  // last minted timestamp
        })

        const mintedCount = await publicClient.readContract({
          ...gdaNftContract,
          functionName: 'tokenToMint'  // mintedCount
        })

        // get last event in the returned array as that represent the latest mint
        if (lastMintTimestamp > 0) {
          lastMintDetails.mintedCount = Number(mintedCount)
          lastMintDetails.lastMintedTimestamp = Number(lastMintTimestamp)
          lastMintDetails.flowRunsUntil = Number(new Date(lastMintDetails.lastMintedTimestamp + FLOW_DURATION))
        }

      }

      allMintInfos[NETWORK_LIST[i].viemChain.id] = lastMintDetails
    }
    setChainMintInfos(allMintInfos)
  }

  useEffect(() => {
    getChainMintInfos();
  }, [])

  return chainMintInfos;
}