import { createContext, useContext, useEffect, useState } from "react";
import { NETWORK_LIST, TOOLTIP_TEXT } from "../../lib/default";
import { useCountdown } from "../../lib/hooks/useCountdown";
import { Timer } from "../common/Timer";
import { DropdownArrow } from "../../assets/dropdown-arrow";
import InfoIcon from "../../assets/info-tooltip.svg";
import { NFTChain } from "../../lib/types/chain";
import {
  ChainMintInfosContext,
  ConnectedWalletContext,
  SelectedChainContext,
} from "../layout";
import { CallToAction } from "../buttons/CallToAction";
import { ClaimStreamButton } from "../buttons/ClaimStream";
import { SwitchNetwork } from "../buttons/SwitchNetwork";
import { StreamInfo } from "../modals/StreamRunningModal";
import { useCheckMintStatus } from "../../lib/hooks/useCheckMintStatus";
import { UserMintInfo } from "../../lib/types/user";
import { useGetStreamInfo } from "../../lib/hooks/useGetStreamInfo";
import { GenerativeArt } from "../nft/GenerativeArt";

export const UserMintInfoContext = createContext<UserMintInfo>(null!);
export const MintStatusContext = createContext<{
  update: boolean;
  setUpdate: Function;
}>(null!);

/** Preview image of the NFT */
const NFTPreview = () => {
  let [seed, setSeed] = useState<number>();
  const wallet = useContext(ConnectedWalletContext);
  const [element, setElement] = useState<Element>();

  useEffect(() => {
    if (wallet && window.localStorage.getItem(`${wallet?.address}_sf`)) {
      let mintStatus = JSON.parse(
        // @ts-ignore
        window.localStorage.getItem(`${wallet?.address}_sf`),
      );
      setSeed(mintStatus?.tokenSeed ?? null);
    } else {
      setSeed(undefined);
    }

    setElement(document.querySelector("#gen-art-wrapper")!);
  }, [wallet]);

  return (
    <div
      id="gen-art-wrapper"
      className="w-full md:w-1/2 rounded-2xl max-h-[60vh] bigscreen:min-h-[70vh]"
    >
      <GenerativeArt seed={seed} parentElement={element} />
    </div>
  );
};

/** Display the chains for user to pick where the NFT will be minted
 *  Depending on the selected chain, the `MintInfoBox` component will render the corresponding
 *  mint information for that chain.
 */
const DropdownSelect = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { selected, setSelected } = useContext(SelectedChainContext);
  const { chainMintInfos } = useContext(ChainMintInfosContext);

  const Option = ({ chainInfo }: { chainInfo: NFTChain }) => {
    let countdown = useCountdown(
      (chainMintInfos[chainInfo.viemChain.id]?.flowRunsUntil || 0) * 1000,
    );

    return (
      <div className="cursor-pointer option flex gap-x-3 border-b border-[#EAEFF4] py-5">
        <img src={chainInfo.logo} className="w-5 h-5 -mt-0.5" />

        <div className="flex-col w-full">
          <p className="font-medium leading-[1] mb-1">{chainInfo.name}</p>

          <div className="w-full flex justify-between items-center">
            <p className="font-medium text-sm text-darkgray">
              Stream will be flowing for:
            </p>
            {chainMintInfos[chainInfo.viemChain.id]?.flowRunsUntil ? (
              <Timer countdown={countdown} />
            ) : (
              <p className="flex gap-x-2 text-sm text-darkgray">N/A</p>
            )}
          </div>

          <div className="w-full flex justify-between items-center">
            <p className="font-medium text-sm text-darkgray">Minted</p>
            <p className="text-sm text-darkgray">
              {chainMintInfos[chainInfo.viemChain.id]?.mintedCount || 0}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const SelectedView = () => (
    <div
      onClick={() => {
        setIsActive(!isActive);
      }}
      className={`dropdown-boxshadow cursor-pointer bg-white flex items-center justify-between p-5 rounded-[0.625rem]`}
    >
      <div className="flex items-center gap-x-3">
        <img src={selected.logo} className="w-5 h-5" />
        <p className="font-medium">{selected.name}</p>
      </div>

      <div
        className={`rotate-180 transition-all ${isActive ? "-rotate-0" : ""}`}
      >
        <DropdownArrow />
      </div>
    </div>
  );

  return (
    <div className="dropdown relative rounded-[0.625rem]">
      <SelectedView />
      <div
        className={`option-list max-h-[40vh] overflow-y-scroll bg-white dropdown-boxshadow mt-2 absolute w-full px-5 py-1 rounded-[0.625rem] ${isActive ? "block" : "hidden"}`}
      >
        {NETWORK_LIST.filter((n: NFTChain) => n.name != selected.name).map(
          (network: NFTChain) => (
            <div
              className="option-wrapper"
              onClick={() => {
                setSelected(network);
                setIsActive(false);
              }}
            >
              <Option chainInfo={network} />
            </div>
          ),
        )}
      </div>
    </div>
  );
};

/** Displays the corresponding network/chain's mint details depending on the
 * selected option
 */
const MintInfoBox = () => {
  const { selected } = useContext(SelectedChainContext);
  const { chainMintInfos } = useContext(ChainMintInfosContext);

  let countdown = useCountdown(
    (chainMintInfos[selected.viemChain.id]?.flowRunsUntil || 0) * 1000,
  );
  let lastMintedTimestamp;

  if (
    chainMintInfos[selected.viemChain.id] &&
    chainMintInfos[selected.viemChain.id].flowRunsUntil
  ) {
    // @ts-ignore
    lastMintedTimestamp =
      (chainMintInfos[selected.viemChain.id]?.lastMintedTimestamp || 0) * 1000;
  }

  return (
    <div className="dropdown-boxshadow p-5 rounded-[0.625rem] font-medium w-full flex flex-col gap-y-2.5">
      <div className="w-full text-sm flex justify-between items-center">
        <p className="text-darkgray">NFTs Minted:</p>
        <p className="text-black-2">
          {chainMintInfos[selected.viemChain.id]?.mintedCount ?? 0}
        </p>
      </div>
      <div className="w-full text-sm flex justify-between items-center">
        <p className="text-darkgray">Last Mint:</p>
        <p className="text-black-2">
          {lastMintedTimestamp
            ? new Date(lastMintedTimestamp).toDateString()
            : "N/A"}
        </p>
      </div>
      <div className="w-full text-sm flex justify-between items-center">
        <p className="text-darkgray">Stream will be flowing for:</p>
        <div className="flex gap-x-2 items-center">
          {lastMintedTimestamp ? (
            <Timer countdown={countdown} className="!text-black-2" />
          ) : (
            <p className="flex gap-x-2 text-sm text-black-2">N/A</p>
          )}
          <div className="tooltip cursor-pointer">
            <img src={InfoIcon} />
            <span className="tooltiptext p-2 bg-white">{TOOLTIP_TEXT}</span>
          </div>
        </div>
      </div>
      <div className="w-full text-sm flex justify-between items-center">
        <p className="text-darkgray">Price:</p>
        <p className="text-black-2">
          {selected.price} {selected.ticker}
        </p>
      </div>
    </div>
  );
};

/** Information about the network and mint timestamp performed by the user */
const UserMintInfoBox = ({
  includesDetailedInfo = false,
}: {
  includesDetailedInfo?: boolean;
}) => {
  const { mintedChain, timestamp, tokenId } = useContext(UserMintInfoContext);
  const { chainMintInfos } = useContext(ChainMintInfosContext);

  let countdown = useCountdown(
    (chainMintInfos[mintedChain?.viemChain?.id]?.flowRunsUntil || 0) * 1000,
  );
  let lastMintedTimestamp;

  if (
    mintedChain &&
    chainMintInfos[mintedChain.viemChain.id] &&
    chainMintInfos[mintedChain.viemChain.id].flowRunsUntil
  ) {
    // @ts-ignore
    lastMintedTimestamp =
      chainMintInfos[mintedChain.viemChain.id]?.lastMintedTimestamp || 0;
  }

  return (
    <div className="dropdown-boxshadow p-5 rounded-[0.625rem] font-medium w-full flex flex-col gap-y-2.5">
      <div className="w-full text-sm flex justify-between items-center">
        <p className="text-darkgray">Network</p>
        <div className="flex gap-x-2 items-center">
          <img src={mintedChain.logo} className="w-4 h-4" />
          <p className="text-black-2">{mintedChain.name}</p>
        </div>
      </div>
      {!includesDetailedInfo ? (
        <div className="w-full text-sm flex justify-between items-center">
          <p className="text-darkgray">Your Mint:</p>
          <p className="text-black-2">
            {new Date(timestamp * 1000).toDateString()}
          </p>
        </div>
      ) : (
        <>
          <div className="w-full text-sm flex justify-between items-center">
            <p className="text-darkgray">Your NFT:</p>
            <p className="text-black-2"># {tokenId}</p>
          </div>
          <div className="w-full text-sm flex justify-between items-center">
            <p className="text-darkgray">NFTs Minted:</p>
            <p className="text-black-2">
              {chainMintInfos[mintedChain?.viemChain?.id]?.mintedCount || 0}
            </p>
          </div>
          <div className="w-full text-sm flex justify-between items-center">
            <p className="text-darkgray">Last Mint:</p>
            <p className="text-black-2">
              {lastMintedTimestamp
                ? new Date(lastMintedTimestamp * 1000).toDateString()
                : "N/A"}
            </p>
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="font-medium text-sm text-darkgray">
              Stream will be flowing for:
            </p>
            <div className="flex gap-x-2 items-center">
              {lastMintedTimestamp ? (
                <Timer countdown={countdown} />
              ) : (
                <span className="flex gap-x-2 text-sm text-darkgray">N/A</span>
              )}
              <div className="tooltip cursor-pointer">
                <img src={InfoIcon} />
                <span className="tooltiptext p-2 bg-white">{TOOLTIP_TEXT}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/** MINT CONTENT VIEWS */

/** Displayed to wallets who have not minted. Basically, this is the default content to render to users. */
const ToMintContent = () => {
  return (
    <>
      <h1 className="text-md font-bold mb-2 text-[#2E3A47]">
        Superfluid Ecosystem NFT
      </h1>
      <h2 className="text-sm text-darkgray mb-8">
        Mint a Superfluid Ecosystem NFT to be a part of the official launch of
        the General Distribution Agreement!
      </h2>

      <div className="flex flex-col gap-y-5">
        <DropdownSelect />
        <MintInfoBox />
        <CallToAction />
      </div>
    </>
  );
};

/** Displayed to wallets who have minted, but have NOT claimed their stream */
/** Clicking on the Claim Stream triggers the `connectPool` transaction.  */
const ClaimStreamContent = () => {
  const [requireSwitchNetwork, setRequireSwitchNetwork] =
    useState<boolean>(false);
  const { mintedChain } = useContext(UserMintInfoContext);
  const wallet = useContext(ConnectedWalletContext);

  // ensures that user is always on the right network as the minted network
  // before allowing claiming of stream.
  useEffect(() => {
    if (wallet) {
      if (Number(wallet.chainId.split(":")[1]) != mintedChain.viemChain.id) {
        setRequireSwitchNetwork(true);
      } else {
        setRequireSwitchNetwork(false);
      }
    }
  }, [wallet]);

  return (
    <>
      <h1 className="text-md font-bold mb-2 text-[#2E3A47]">
        Claim your Stream!
      </h1>
      <h2 className="text-sm text-darkgray mb-8">
        Lorem ipsum dolor sit amet consectetur. Pharetra ante eget lacus feugiat
        orci lorem. Non quam pretium purus aliquet turpis velit.
      </h2>

      <div className="flex flex-col gap-y-5">
        <UserMintInfoBox />
        {requireSwitchNetwork ? (
          <SwitchNetwork
            idealNetwork={mintedChain?.viemChain?.id}
            type="claim stream"
          />
        ) : (
          <ClaimStreamButton />
        )}
      </div>
    </>
  );
};

/** Displayed to wallets who have minted, AND claimed their stream
 *  No CTAs or further action required. Users have to connect a different wallet
 *  To mint another NFT.
 */

const MintedAndClaimedContent = () => {
  const streamInfo = useGetStreamInfo();

  return (
    <>
      <h1 className="text-md font-bold mb-2 text-[#2E3A47]">
        Lorem ipsum dolor sit amet
      </h1>
      <h2 className="text-sm text-darkgray mb-8">
        Lorem ipsum dolor sit amet consectetur. Faucibus tellus vitae at duis
        dui tellus in. Morbi ac tempus quis dolor non ut nulla feugiat.
      </h2>

      <div className="flex flex-col gap-y-5">
        <div className="dropdown-boxshadow p-5 rounded-[0.625rem] font-medium w-full flex flex-col gap-y-2.5">
          {streamInfo && <StreamInfo streamInfo={streamInfo!} />}
        </div>
        <div className="flex flex-col gap-y-2">
          <UserMintInfoBox includesDetailedInfo={true} />
          <p className="text-xs text-darkgray">
            If you want to mint another NFT connect different wallet.
          </p>
        </div>
      </div>
    </>
  );
};

const DashboardContent = () => {
  const [update, setUpdate] = useState(false);
  const mintInfo = useCheckMintStatus(update);
  const mintContextProviderProps = { update, setUpdate };

  return (
    <MintStatusContext.Provider value={mintContextProviderProps}>
      <div className="w-full md:w-1/2 p-6 md:p-8 bigscreen:p-12 bg-white bigscreen:rounded-tr-2xl rounded-bl-2xl md:rounded-bl-0 rounded-br-2xl flex flex-col">
        {!mintInfo ? (
          <ToMintContent />
        ) : (
          <UserMintInfoContext.Provider value={mintInfo}>
            {mintInfo.claimedStream ? (
              <MintedAndClaimedContent />
            ) : (
              <ClaimStreamContent />
            )}
          </UserMintInfoContext.Provider>
        )}
      </div>
    </MintStatusContext.Provider>
  );
};

/** Component that renders the dashboard page */
export const Dashboard = () => {
  return (
    <div className="text-black-2 w-[90%] bigscreen:max-h-[80vh] max-w-[82.125rem] bg-white flex flex-col md:flex-row rounded-2xl">
      <NFTPreview />
      <DashboardContent />
    </div>
  );
};
