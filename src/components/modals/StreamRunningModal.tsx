import XIcon from "../../assets/xicon.svg";
import USDCx from "../../assets/USDCx.svg";
import { StreamInfoType } from "../../lib/types/stream";
import FlowingBalance from "../amount/FlowingBalance";
import { useGetStreamInfo } from "../../lib/hooks/useGetStreamInfo";
import { useContext } from "react";
import { MintStatusContext } from "../views/Dashboard";

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
        <img src={USDCx} className="w-5 h-5 md:w-8 md:h-8" />
        <div className="font-medium text-[24px] sm:text-[2rem] bigscreen:text-lg leading-[1] flex gap-x-2 items-end">
          <p>
            <FlowingBalance
              balance={streamInfo?.balance}
              balanceTimestamp={streamInfo?.balanceTimestamp}
              flowRate={streamInfo?.flowRate}
            />
          </p>
          <span className="text-base text-sm sm:text-md text-sf-green -ml-1">
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
        <div className="p-12 bg-white relative max-w-[36rem] rounded-[1.25rem]">
          <img
            className="absolute top-6 right-6 w-6 h-6 cursor-pointer"
            src={XIcon}
            onClick={() => {
              setUpdate(true);
              setModalOpen(false);
            }}
          />

          <div
            className="flex flex-col gap-y-8 !bg-cover !bg-no-repeat !bg-[center_1rem]"
            style={{ background: `url(/modal-sf-bg.png)` }}
          >
            <div>
              <h4 className="text-md font-bold text-[#2E3A47] text-center">
                Your stream is running
              </h4>
              <p className="text-center text-darkgrey mt-[0.2rem]">
                You can check your streams at any time on the{" "}
                <a
                  href="https://app.superfluid.finance"
                  rel="noreferrer"
                  className="cursor-pointer underline"
                  target="_blank"
                >
                  Superfluid Dashboard
                </a>
                .
              </p>
            </div>
            <div className="rounded-[1.25rem] p-5 bg-white w-fit mx-auto">
              <StreamInfo streamInfo={streamInfo!} />
            </div>
            <button
              className="cursor-pointer w-full bg-sf-green active:border-transparent active:outline-none focus:border-transparent focus:outline-none hover:border-transparent hover:outline-none rounded-[0.625rem] font-medium text-white"
              onClick={() => {
                setUpdate(true);
                setModalOpen(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};
