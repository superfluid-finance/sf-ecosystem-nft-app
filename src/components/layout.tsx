import { PropsWithChildren, createContext, useEffect, useState } from "react"
import SuperFluidLogo from "../assets/superfluid-logo.svg"
import BackgroundImage from "../assets/bg.png"
import { usePrivy } from '@privy-io/react-auth';
import { LoggedInWallet } from "./wallet/LoggedInWallet";
import { DEFAULT_SELECTED_CHAIN } from "../lib/default";
import { ChainMintInfosContextType, NFTChain, SelectedChainContextType } from "../lib/types/chain";
import { AllChainMintInfos, useGetChainMintInfos } from "../lib/hooks/useGetChainMintInfos";

export const SelectedChainContext = createContext<SelectedChainContextType>(null!)
export const ChainMintInfosContext = createContext<ChainMintInfosContextType>(null!)

const Background = () => {
  return (
    <div className="w-full h-full fixed top-0 left-0">
      <img src={BackgroundImage} className="w-full h-full" />
    </div>
  )
}

export const Layout = ({ children }: PropsWithChildren) => {

  const { ready, authenticated } = usePrivy()
  const [selected, setSelected] = useState<NFTChain>(DEFAULT_SELECTED_CHAIN)
  const [allChainMintedInfo, setAllChainMintedInfo] = useState<AllChainMintInfos>({})
  const chainMintInfos = useGetChainMintInfos()

  useEffect(() => {
    if (chainMintInfos) {
      setAllChainMintedInfo(chainMintInfos)
    }
  }, [chainMintInfos])

  return (
    <ChainMintInfosContext.Provider value={{ chainMintInfos: allChainMintedInfo, setChainMintInfos: setAllChainMintedInfo }}>
    <SelectedChainContext.Provider value={{ selected, setSelected }}>
      <div className="relative w-screen bigscreen:overflow-hidden bg-[#EAEFF4] min-h-screen">
        <Background />
        <header className="fixed top-0 left-0 w-full pr-8 py-2 z-[11] flex justify-between items-center">
        <img src={SuperFluidLogo} className="w-[16.375rem]"/>

        { ready && authenticated &&
          <div className="relative">
            <LoggedInWallet />
          </div>
        }
        </header>
        <main className="relative py-16 md:py-[6rem] w-full h-full flex justify-center items-center">
        {children}
        </main>
      </div>
    </SelectedChainContext.Provider>
    </ChainMintInfosContext.Provider>
  )
}