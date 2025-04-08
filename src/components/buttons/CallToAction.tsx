import { ConnectWallet } from "./ConnectWallet";
import { Mint } from "./Mint";
import { SelectedChainContext } from "../layout";
import { useContext, useEffect, useState } from "react";
import { useViemWalletClient } from "../../lib/hooks/useViemWalletClient";
import { SwitchNetwork } from "./SwitchNetwork";
import { useAccount } from "wagmi";

export const CallToAction = () => {
  const { isConnected } = useAccount();
  const { selected } = useContext(SelectedChainContext);

  const viemWalletClient = useViemWalletClient({ selectedChain: selected });
  const [correctNetwork, setCorrectNetwork] = useState<boolean>(false);

  // ensures that user is always on the right network
  // before allowing minting.
  useEffect(() => {
    if (viemWalletClient) {
      // @ts-ignore
      if (viemWalletClient.chain?.id == selected.viemChain.id)
        setCorrectNetwork(true);
      else {
        setCorrectNetwork(false);
      }
    }
  }, [viemWalletClient, selected]);

  return isConnected ? (
    correctNetwork ? (
      <Mint />
    ) : (
      <SwitchNetwork type="mint" />
    )
  ) : (
    <ConnectWallet />
  );
};

export default function ConnectButton() {
  return <appkit-button />
}
