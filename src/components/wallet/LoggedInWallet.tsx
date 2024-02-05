// @ts-ignore
import { useCallback, useContext, useEffect, useRef, useState } from "react";
// @ts-ignore
import { createIcon } from "../../lib/blockies.js";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { truncateAddress } from "../../lib/utils.js";
import { useViemWalletClient } from "../../lib/hooks/useViemWalletClient.js";
import { SelectedChainContext } from "../layout.js";
import { useRetrieveBalance } from "../../lib/hooks/useRetrieveBalance.js";
import { DropdownArrow } from "../../assets/dropdown-arrow.js";
import DisconnectIcon from "../../assets/disconnect.svg";

export const LoggedInWallet = () => {
  const { selected } = useContext(SelectedChainContext);

  const blockieRefDiv = useRef(null);
  const [blockieSet, setBlockieSet] = useState<boolean>(false);
  const { user, logout } = usePrivy();
  const viemWalletClient = useViemWalletClient({ selectedChain: selected });
  const userBalance = useRetrieveBalance();
  const { wallets } = useWallets();

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  /** Function to generate blockie icon */
  let icon = createIcon({
    seed: user?.wallet?.address,
    size: 6,
    scale: 5,
  });

  const performSwitchChain = useCallback(
    async (wallet: any) => {
      await wallet.switchChain(selected.viemChain.id);
    },
    [selected],
  );

  // generates blockie image
  useEffect(() => {
    if (!blockieSet && blockieRefDiv.current) {
      // @ts-ignore
      blockieRefDiv.current!.appendChild(icon);
      setBlockieSet(true);
    }
  }, [blockieRefDiv.current]);

  // if selected chain changes,
  // we switch user to right network first before we
  // request wallet balance
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      const wallet = wallets.find(
        (wallet) => wallet.address == user?.wallet?.address,
      );

      if (wallet) {
        performSwitchChain(wallet);
      }
    }
  }, [selected]);

  return (
    <div
      className="flex gap-x-4 items-center cursor-pointer relative"
      onClick={() => setOpenDropdown(!openDropdown)}
    >
      <div className="blockie-wrapper" ref={blockieRefDiv}></div>
      <div className="flex flex-col">
        <span className="text-black font-medium">
          {truncateAddress(user?.wallet?.address as string)}
        </span>
        <span className="text-darkgray -mt-1 text-[12px]">
          {Number(userBalance).toFixed(4)} {/** @ts-ignore */}
          {viemWalletClient?.chain?.nativeCurrency?.symbol}
        </span>
      </div>

      <div
        className={`rotate-180 transition-all ${openDropdown ? "rotate-0" : ""}`}
      >
        <DropdownArrow />
      </div>

      {/** Display disconnect button */}
      {openDropdown && (
        <div
          className="cursor-pointed flex gap-x-1 items-center absolute bottom-[-130%] right-0 rounded-[0.625rem] py-2.5 px-4 bg-white"
          onClick={() => logout()}
        >
          <img src={DisconnectIcon} className="h-4" />
          <span className="font-medium text-error-red">Disconnect</span>
        </div>
      )}
    </div>
  );
};
