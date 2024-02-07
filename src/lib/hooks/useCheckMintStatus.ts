import { useCallback, useContext, useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { NETWORK_LIST } from "../default";
import { createPublicClient, getContract, http } from "viem";
import { UserMintInfo } from "../types/user";
import { gdaForwarderV1Abi } from "../abi/gdaForwarderV1";
import { gdaNftContractAbi } from "../abi/gdaNFTContract";
import { SelectedChainContext } from "../../components/layout";

export const useCheckMintStatus = (triggerUpdate?: boolean) => {
  const { user, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { selected } = useContext(SelectedChainContext);
  const [userMintInfo, setUserMintInfo] = useState<UserMintInfo | undefined>(
    undefined,
  );

  /** Check the user's mint status */
  /** by querying each chain. If there's a hit, store the mint info details
   ** in context to be used throughout the app
   **/
  const checkMintedChain = useCallback(
    async (wallet: any) => {
      let publicClient;

      for (let i = 0; i < NETWORK_LIST.length; i++) {
        if (NETWORK_LIST[i].gdaInfo) {
          publicClient = createPublicClient({
            cacheTime: 10_000,
            chain: NETWORK_LIST[i].viemChain!,
            transport: http(),
          });

          const nftContract = getContract({
            address: NETWORK_LIST[i].gdaInfo
              ?.nftContractAddress as `0x${string}`,
            abi: gdaNftContractAbi,
            client: publicClient,
          });
          const forwarderContract = getContract({
            address: NETWORK_LIST[i].gdaInfo
              ?.gdaForwarderV1Address as `0x${string}`,
            abi: gdaForwarderV1Abi,
            client: publicClient,
          });

          const result = await nftContract.read.hasMinted([wallet.address]);

          if (result) {
            let mintResult: any = await nftContract.read.userMint([
              wallet.address,
            ]);
            let seed: any = await nftContract.read.calcURI([mintResult[1]]);
            let hasClaimedStream: any =
              await forwarderContract.read.isMemberConnected([
                NETWORK_LIST[i].gdaInfo?.poolAddress!,
                wallet.address,
              ]);

            let userMintObj = {
              mintedChain: NETWORK_LIST[i],
              tokenId: Number(mintResult[1]),
              timestamp: Number(mintResult[2]),
              claimedStream: hasClaimedStream,
              tokenSeed: Number(seed.split("seed=")[1]),
            };

            setUserMintInfo(userMintObj);

            // store this in local storage for easier retrieval
            localStorage.setItem(
              `${user?.wallet?.address}_sf`,
              JSON.stringify(userMintObj),
            );

            break;
          }
        }
      }
    },
    [user?.wallet?.address, triggerUpdate],
  );

  /** User has minted, just need to check that streamed has been claimed */
  const checkClaimedStreamStatus = useCallback(
    async (mintStatus: UserMintInfo) => {
      let publicClient = createPublicClient({
        cacheTime: 10_000,
        chain: mintStatus?.mintedChain?.viemChain ?? selected.viemChain,
        transport: http(),
      });

      const forwarderContract = getContract({
        address: mintStatus.mintedChain.gdaInfo
          ?.gdaForwarderV1Address as `0x${string}`,
        abi: gdaForwarderV1Abi,
        client: publicClient,
      });
      let hasClaimedStream: any =
        await forwarderContract.read.isMemberConnected([
          mintStatus.mintedChain.gdaInfo?.poolAddress!,
          user?.wallet?.address as `0x${string}`,
        ]);

      if (hasClaimedStream) {
        let newMintStatus = { ...mintStatus, claimedStream: true };
        setUserMintInfo(newMintStatus);
        localStorage.setItem(
          `${user?.wallet?.address}_sf`,
          JSON.stringify(newMintStatus),
        );
      } else {
        setUserMintInfo(mintStatus);
      }
    },
    [user?.wallet?.address, triggerUpdate],
  );

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      const wallet = wallets.find(
        (wallet: any) => wallet.address == user.wallet?.address,
      );

      // check if local storage already have info on the mint status.
      if (
        wallet &&
        window.localStorage.getItem(`${user?.wallet?.address}_sf`)
      ) {
        let mintStatus = JSON.parse(
          // @ts-ignore
          window.localStorage.getItem(`${user?.wallet?.address}_sf`),
        );

        // if last retrieved info has not been connected to pool, check the status
        if (!mintStatus.claimedStream) {
          checkClaimedStreamStatus(mintStatus);
        } else {
          setUserMintInfo(
            JSON.parse(
              window.localStorage.getItem(`${user?.wallet?.address}_sf`)!,
            ),
          );
        }
      } else if (wallet) {
        checkMintedChain(wallet);
      }
    } else {
      setUserMintInfo(undefined);
    }
  }, [wallets, authenticated, triggerUpdate]);

  return userMintInfo;
};
