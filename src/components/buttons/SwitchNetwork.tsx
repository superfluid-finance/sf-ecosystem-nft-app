import { useCallback, useContext, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { SelectedChainContext } from "../layout";
import { LoadingSpinner } from "../common/Loading";
import { REJECTED_TRANSACTION_GENERAL } from "../../lib/dictionary";

export const SwitchNetwork = ({
  idealNetwork,
  type,
}: {
  idealNetwork?: number;
  type: "mint" | "claim stream";
}) => {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { selected } = useContext(SelectedChainContext);

  const performSwitchChain = useCallback(
    async (wallet: any) => {
      try {
        await wallet.switchChain(selected.viemChain.id);
        setLoading(false);
      } catch {
        setLoading(false);
        setErrorMessage(REJECTED_TRANSACTION_GENERAL);
      }
    },
    [selected],
  );

  const performSwitchChainToIdealNetwork = useCallback(
    async (wallet: any, idealNetwork: number) => {
      try {
        await wallet.switchChain(idealNetwork);
        setLoading(false);
      } catch {
        setErrorMessage(REJECTED_TRANSACTION_GENERAL);
        setLoading(false);
      }
    },
    [idealNetwork],
  );

  const handleSwitchNetwork = useCallback(() => {
    setLoading(true);
    setErrorMessage("");

    if (wallets && wallets.length > 0) {
      const wallet = wallets.find(
        (wallet) => wallet.address == user?.wallet?.address,
      );

      if (wallet && !idealNetwork) {
        performSwitchChain(wallet);
      } else if (wallet && idealNetwork) {
        performSwitchChainToIdealNetwork(wallet, idealNetwork);
      }
    } else {
      setErrorMessage(REJECTED_TRANSACTION_GENERAL);
      setLoading(false);
    }
  }, [selected]);

  return (
    <div className="flex flex-col gap-y-2">
      <button
        className="cursor-pointer w-full bg-sf-green active:border-transparent active:outline-none focus:border-transparent focus:outline-none hover:border-transparent hover:outline-none rounded-[0.625rem] font-medium text-white"
        onClick={handleSwitchNetwork}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <span>{`Switch network to ${type == "mint" ? "mint" : "Claim Stream"}`}</span>
        )}
      </button>

      {errorMessage && <p className="text-error-red">{errorMessage}</p>}
    </div>
  );
};
