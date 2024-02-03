import { useCallback, useEffect, useState } from "react";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createPublicClient, formatEther, http } from "viem";
import { viemChainLookupById } from "../utils";

export const useRetrieveBalance = () => {

  const { user, authenticated } = usePrivy()  
  const [userBalance, setUserBalance] = useState<number>(0)
  const { wallets } = useWallets();

  const getBalance = useCallback(async (wallet: any) => {

    if (wallet && wallet?.chainId) {
      let chainId = wallet?.chainId?.split(':')[1]

      const publicClient = createPublicClient({
        cacheTime: 60_000,
        chain: viemChainLookupById(Number(chainId))!,
        transport: http()
      })

      let bal: any = await publicClient.getBalance({
        address: user?.wallet?.address as `0x${string}`
      })

      bal = formatEther(bal)
      setUserBalance(bal)
    }

  }, [])

  useEffect(() => {
    if (wallets && authenticated && user?.wallet?.address) {
      const wallet = wallets.find((wallet: any) => (wallet.address == user.wallet?.address)); 
      
      if (wallet) {
        getBalance(wallet);
      }
    }

  }, [wallets, authenticated])

  return userBalance
}

