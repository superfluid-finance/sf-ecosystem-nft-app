import XIcon from "../../assets/xicon.svg";
import { ClaimStreamButton } from "../buttons/ClaimStream";
import { MintStatusContext } from "../views/Dashboard";
import { useContext } from "react";
import { NFTPreviewVideo } from "../nft/NFTPreviewVideo";

type ClaimStreamModalProps = {
  setModalOpen: Function;
};

export const ClaimStreamModal = ({ setModalOpen }: ClaimStreamModalProps) => {
  const { setUpdate } = useContext(MintStatusContext);

  const GreyOverlay = () => {
    return (
      <div className="modal-backdrop w-screen h-screen absolute top-0 left-0 bg-black/50"></div>
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
            Each Ecosystem Rewards Pass sends a stream back to its minter. Claim
            your stream below!
          </p>
          <div
            id="claim-stream-modal"
            className="flex flex-col gap-y-8 mt-6 !bg-no-repeat !bg-[center_-3rem] min-h-[48vh] justify-between"
            style={{ background: `url(/modal-sf-bg.png)` }}
          >
            <NFTPreviewVideo />
            <ClaimStreamButton />
          </div>
        </div>
      </div>
    </div>
  );
};
