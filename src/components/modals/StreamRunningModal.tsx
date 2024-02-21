import XIcon from "../../assets/xicon.svg";
import USDCx from "../../assets/USDCx.svg";
import { StreamInfoType } from "../../lib/types/stream";
import FlowingBalance from "../amount/FlowingBalance";
import { useGetStreamInfo } from "../../lib/hooks/useGetStreamInfo";
import { useContext } from "react";
import { MintStatusContext } from "../views/Dashboard";
import { TwitterShareButton } from "react-share";
import { useCheckMintStatus } from "../../lib/hooks/useCheckMintStatus";

type ClaimStreamModalProps = {
  setModalOpen: Function;
};

export const StreamInfo = ({ streamInfo }: { streamInfo: StreamInfoType }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="text-xs font-medium text-[#121413]/87">
        Total amount streamed
      </span>
      <div className="flex flex-row gap-x-2 items-center">
        <img src={USDCx} className="w-5 h-5 sm:w-8 sm:h-8" />
        <div className="font-medium text-[22px] sm:text-[2rem] bigscreen:text-[38px] leading-[1] flex gap-x-2 items-end">
          <p className="mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>
            <FlowingBalance
              startingBalance={streamInfo?.balance}
              startingBalanceDate={
                new Date(streamInfo?.balanceTimestamp * 1000)
              }
              flowRate={streamInfo?.flowRate}
            />
          </p>
          <span className="text-base text-sm sm:text-md text-sf-green -mt-4">
            {streamInfo.tokenSymbol}
          </span>
        </div>
      </div>
    </div>
  );
};

export const StreamRunningModal = ({ setModalOpen }: ClaimStreamModalProps) => {
  const streamInfo = useGetStreamInfo();
  const { setUpdate } = useContext(MintStatusContext);
  const userMintInfo = useCheckMintStatus();

  const GreyOverlay = () => {
    return (
      <div className="modal-backdrop w-screen h-screen absolute top-0 left-0 bg-black/50"></div>
    );
  };

  return (
    streamInfo && (
      <div className="w-screen h-screen fixed top-0 left-0 z-[100] flex items-center justify-center">
        <GreyOverlay />

        {/** Modal Content */}
        <div className="relative bg-white relative max-w-[40rem] md:w-[40rem]  rounded-[1.25rem]">
          <img
            src="/stream-bg.png"
            className="absolute top-2/3 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[100%] !h-[100%] object-contain z-[0]"
          />

          <div className="p-12 relative z-[1]">
            <img
              className="absolute top-6 right-6 w-6 h-6 cursor-pointer"
              src={XIcon}
              onClick={() => {
                setUpdate(true);
                setModalOpen(false);
              }}
            />

            <div className="flex flex-col gap-y-8">
              <div>
                <h4 className="text-md font-bold text-[#2E3A47] text-center">
                  Your stream is running
                </h4>
                <p className="text-center text-darkgrey mt-[0.2rem]">
                  You can check your streams at any time on the <br />
                  <a
                    href="https://app.superfluid.finance"
                    rel="noreferrer"
                    className="cursor-pointer underline text-sf-green"
                    target="_blank"
                  >
                    Superfluid Dashboard
                  </a>
                  .
                </p>
              </div>
              <div className="rounded-[1.25rem] p-5 bg-white w-fit mx-auto z-[1]">
                <StreamInfo streamInfo={streamInfo!} />
              </div>
              <div
                className="z-[2] relative cursor-pointer w-full text-center py-2 bg-sf-green active:border-transparent active:outline-none focus:border-transparent focus:outline-none hover:border-transparent hover:outline-none rounded-[0.625rem] font-medium text-white"
                onClick={() => {
                  setUpdate(true);
                  setModalOpen(false);
                }}
              >
                <TwitterShareButton
                  title={`I minted my @Superfluid_HQ Ecosystem Rewards Pass on ${streamInfo.chain}.\n\n1 Stream → Unlimited recipients.\nEvery minter gets a fraction of the Biggest stream ever. We're currently at ${(userMintInfo?.tokenId || 0) + 1} recipient${userMintInfo?.tokenId && userMintInfo.tokenId + 1 > 1 ? "s" : ""}.`}
                  url="mint.superfluid.finance"
                >
                  <span className="flex gap-x-2 items-center">
                    Share on{" "}
                    <img
                      src="/x-logo.svg"
                      width={10}
                      height={10}
                      className="inline-block"
                    ></img>
                  </span>
                </TwitterShareButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
