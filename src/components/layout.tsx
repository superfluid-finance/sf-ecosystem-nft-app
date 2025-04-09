import { PropsWithChildren, createContext, useEffect, useState } from "react";
import SuperFluidLogo from "../assets/superfluid-logo.svg";
import BackgroundImage from "../assets/bg.png";
import { LoggedInWallet } from "./wallet/LoggedInWallet";
import { DEFAULT_SELECTED_CHAIN } from "../lib/default";
import {
  ChainMintInfosContextType,
  NFTChain,
  SelectedChainContextType,
} from "../lib/types/chain";
import {
  AllChainMintInfos,
  useGetChainMintInfos,
} from "../lib/hooks/useGetChainMintInfos";
import { useAccount } from 'wagmi'
import { ConnectedWallet } from "../types/wallet";

export const SelectedChainContext = createContext<SelectedChainContextType>(
  null!,
);
export const ChainMintInfosContext = createContext<ChainMintInfosContextType>(
  null!,
);

export const ConnectedWalletContext = createContext<
  ConnectedWallet | undefined
>(null!);

const Background = () => {
  return (
    <div className="w-full h-full fixed top-0 left-0">
      <img src={BackgroundImage} className="w-full h-full" />
    </div>
  );
};

export const Layout = ({ children }: PropsWithChildren) => {
  const { address, chainId } = useAccount()
  const [selected, setSelected] = useState<NFTChain>(DEFAULT_SELECTED_CHAIN);
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet>();
  const [allChainMintedInfo, setAllChainMintedInfo] =
    useState<AllChainMintInfos>({});
  const chainMintInfos = useGetChainMintInfos();

  useEffect(() => {
    if (chainMintInfos) {
      setAllChainMintedInfo(chainMintInfos);
    }
  }, [chainMintInfos]);

  useEffect(() => {
    if (address) {
      const wallet: ConnectedWallet = { address, chainId };

      if (chainId) {
        setConnectedWallet(wallet);
      }
    } else {
      setConnectedWallet(undefined);
    }
  }, [address, chainId]);

  return (
    <ConnectedWalletContext.Provider value={connectedWallet}>
      <ChainMintInfosContext.Provider
        value={{
          chainMintInfos: allChainMintedInfo,
          setChainMintInfos: setAllChainMintedInfo,
        }}
      >
        <SelectedChainContext.Provider value={{ selected, setSelected }}>
          <div className="relative w-screen bigscreen:overflow-hidden bg-[#EAEFF4] min-h-screen">
            <Background />
            <header className="fixed top-0 left-0 w-full pl-2 md:pl-0 pr-8 py-2 z-[11] flex justify-between items-center bg-[#EAEFF4] md:bg-transparent">
              <img
                src={SuperFluidLogo}
                className="w-[12rem] md:w-[16.375rem]"
              />

              {connectedWallet && (
                <div className="relative">
                  <LoggedInWallet />
                </div>
              )}
            </header>
            <main className="relative pt-[7rem] pb-[4rem] md:py-[7rem] w-full min-h-[100vh] flex justify-center items-center">
              {children}
            </main>
          </div>
        </SelectedChainContext.Provider>
      </ChainMintInfosContext.Provider>
    </ConnectedWalletContext.Provider>
  );
};