import { useCallback, useContext, useEffect, useState } from "react";
import { createPublicClient, formatEther, http } from "viem";
import { viemChainLookupById } from "../utils";
import { ConnectedWalletContext } from "../../components/layout";

export const useRetrieveBalance = () => {
  const [userBalance, setUserBalance] = useState<number>(0);
  const wallet = useContext(ConnectedWalletContext);

  const getBalance = useCallback(
    async (wallet: any) => {
      if (wallet && wallet?.chainId) {
        let chainId = wallet?.chainId?.split(":")[1];

        const publicClient = createPublicClient({
          cacheTime: 60_000,
          chain: viemChainLookupById(Number(chainId))!,
          transport: http(),
        });

        let bal: any = await publicClient.getBalance({
          address: wallet.address as `0x${string}`,
        });

        bal = formatEther(bal);
        setUserBalance(bal);
      }
    },
    [wallet],
  );

  useEffect(() => {
    if (wallet) {
      getBalance(wallet);
    }
  }, [wallet]);

  return userBalance;
};
