import { useContext, useEffect, useState } from "react";
import { ConnectedWalletContext } from "../layout";
import { useCheckMintStatus } from "../../lib/hooks/useCheckMintStatus";
const videoSrc = 'https://6g4v59ayv7sqyrsj.public.blob.vercel-storage.com/nft-video-UgC4p9p4W1jWPeN0OmfRwPSsrD5JMD.mp4'; // Adjust path as needed

export const NFTPreviewVideo = (): JSX.Element => {
  const wallet = useContext(ConnectedWalletContext);
  const userMintInfo = useCheckMintStatus();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // No need for the old seed logic
  }, [wallet, userMintInfo]);
  return (
    <div className="relative overflow-hidden">
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sf-green"></div>
        </div>
      )}
      <video
        className={`w-full h-full object-contain object-left-bottom rounded-t-2xl md:rounded-b-2xl ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{ objectPosition: '0 0' }}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
