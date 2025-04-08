import { useCallback, useContext, useEffect, useState } from "react";
import { createPublicClient, formatEther, http } from "viem";
import { viemChainLookupById } from "../utils";
import {
  ConnectedWalletContext,
  SelectedChainContext,
} from "../../components/layout";

export const useRetrieveBalance = () => {
  const [userBalance, setUserBalance] = useState<number>(0);
  const wallet = useContext(ConnectedWalletContext);
  const selected = useContext(SelectedChainContext);

  const getBalance = useCallback(
    async (wallet: any) => {
      if (wallet && wallet?.chainId) {
        let chainId = wallet?.chainId;
        
        const publicClient = createPublicClient({
          cacheTime: 60_000,
          chain: viemChainLookupById(Number(chainId)).chain!,
          transport: http(viemChainLookupById(Number(chainId)).rpcUrl),
        });

        let bal: any = await publicClient.getBalance({
          address: wallet.address as `0x${string}`,
        });

        bal = formatEther(bal);
        setUserBalance(bal);
      }
    },
    [wallet, selected],
  );

  useEffect(() => {
    if (wallet) {
      getBalance(wallet);
    }
  }, [wallet, selected]);

  return userBalance;
};
