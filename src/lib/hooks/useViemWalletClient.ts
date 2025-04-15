import { useContext, useEffect, useState } from "react";
import { NFTChain } from "../types/chain";
import { createWalletClient, http } from "viem";
import { viemChainLookupById } from "../utils";
import { ConnectedWalletContext } from "../../components/layout";

export const useViemWalletClient = ({
  selectedChain,
  triggerUpdate,
}: {
  selectedChain?: NFTChain;
  triggerUpdate?: boolean;
}) => {
  const [viemWalletClient, setViemWalletClient] = useState();

  const wallet = useContext(ConnectedWalletContext);

  useEffect(() => {
    const getViemWalletClient = async (wallet: any) => {
      let currentlyConnectedId = wallet.chainId;
      // Get an EIP1193 provider from the user's wallet
      let chain = viemChainLookupById(Number(currentlyConnectedId)).chain!;
      // Create a Viem wallet client from the EIP1193 provider
      const walletClient = await createWalletClient({
        account: wallet?.address as `0x${string}`,
        chain,
        transport: http(viemChainLookupById(Number(currentlyConnectedId)).rpcUrl)
      });

      // @ts-ignore
      setViemWalletClient(walletClient);
    };

    if (wallet?.chainId) {
      getViemWalletClient(wallet);
    }
  }, [wallet, selectedChain, triggerUpdate]);

  return viemWalletClient;
};
