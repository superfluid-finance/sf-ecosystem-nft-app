import { useEffect, useState } from "react";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { NFTChain } from "../types/chain";
import { createWalletClient, custom } from "viem";
import { viemChainLookupById } from "../utils";

export const useViemWalletClient = (selectedChain?: NFTChain) => {

  const [viemWalletClient, setViemWalletClient] = useState()

  const { user } = usePrivy()  
  const { wallets } = useWallets();


  useEffect(() => {

    const getViemWalletClient = async (wallet: any) => {

        let currentlyConnectedId = wallet.chainId.split(':')[1]
        // Get an EIP1193 provider from the user's wallet
        const ethereumProvider = await wallet?.getEthereumProvider();

        // Create a Viem wallet client from the EIP1193 provider
        const walletClient = await createWalletClient({
            account: user?.wallet?.address as `0x${string}`,
            chain: viemChainLookupById(Number(currentlyConnectedId))!,
            transport: custom(ethereumProvider)
        });
        
        // @ts-ignore
        setViemWalletClient(walletClient);
    } 

    if(wallets && user?.wallet?.address) {
      const wallet = wallets.find((wallet: any) => (wallet.address == user.wallet?.address)); 
      getViemWalletClient(wallet)
    }
  }, [wallets, selectedChain])

  return viemWalletClient
}

