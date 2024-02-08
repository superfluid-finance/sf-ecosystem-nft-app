import XIcon from "../../assets/xicon.svg";
import { ClaimStreamButton } from "../buttons/ClaimStream";
import { MintStatusContext } from "../views/Dashboard";
import { useContext, useEffect, useState } from "react";
import { GenerativeArt } from "../nft/GenerativeArt";
import { ConnectedWalletContext } from "../layout";

type ClaimStreamModalProps = {
  setModalOpen: Function;
};

export const ClaimStreamModal = ({ setModalOpen }: ClaimStreamModalProps) => {
  const { setUpdate } = useContext(MintStatusContext);
  const wallet = useContext(ConnectedWalletContext);

  const GreyOverlay = () => {
    return (
      <div className="modal-backdrop w-screen h-screen absolute top-0 left-0 bg-black/50"></div>
    );
  };

  const NFTPreview = () => {
    let [seed, setSeed] = useState<number>(0);

    useEffect(() => {
      if (wallet && window.localStorage.getItem(`${wallet?.address}_sf`)) {
        let mintStatus = JSON.parse(
          // @ts-ignore
          window.localStorage.getItem(`${wallet?.address}_sf`),
        );

        setSeed(mintStatus.tokenSeed);
      }
    }, [wallet]);

    return (
      <div
        style={{ background: `url(/modal-sf-bg.png)` }}
        className="mx-auto w-full h-full"
      >
        <GenerativeArt
          parentElement={document.querySelector("#claim-stream-modal")}
          seed={seed}
        />
      </div>
    );
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-[100] flex items-center justify-center">
      <GreyOverlay />

      {/** Modal Content **/}
      <div className="p-12 bg-white relative max-w-[36rem] rounded-[1.25rem]">
        <img
          className="absolute top-6 right-6 w-6 h-6 cursor-pointer"
          src={XIcon}
          onClick={() => {
            setUpdate(true);
            setModalOpen(false);
          }}
        />

        <div className="flex flex-col">
          <h4 className="text-md font-bold text-[#2E3A47] text-center">
            Success
          </h4>
          <p className="text-center text-darkgrey mt-[0.2rem]">
            Lorem ipsum dolor sit amet consectetur. Auctor orci est et bibendum.
            Metus quis sed tortor tincidunt tellus.
          </p>
          <div
            id="claim-stream-modal"
            className="flex flex-col gap-y-8 mt-6 !bg-no-repeat !bg-[center_-3rem] min-h-[48vh] justify-between"
            style={{ background: `url(/modal-sf-bg.png)` }}
          >
            <NFTPreview />
            <ClaimStreamButton />
          </div>
        </div>
      </div>
    </div>
  );
};
