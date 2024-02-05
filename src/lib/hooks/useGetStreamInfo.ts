import { useCallback, useEffect, useState } from "react";
import { StreamInfoType } from "../types/stream";
import { createPublicClient, erc20Abi, getContract, http } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import { superfluidPoolAbi } from "../abi/superfluidPool";
import { UserMintInfo } from "../types/user";

export const useGetStreamInfo = () => {
  const [streamInfo, setStreamInfo] = useState<StreamInfoType>();
  const { user } = usePrivy();

  const getStreamInfo = useCallback(async () => {
    let mintedInfo: UserMintInfo = JSON.parse(
      // @ts-ignore
      localStorage.getItem(user?.wallet?.address + "_sf"),
    );

    let publicClient = createPublicClient({
      cacheTime: 10_000,
      chain: mintedInfo.mintedChain.viemChain,
      transport: http(),
    });

    const superfluidPoolContract = getContract({
      address: mintedInfo.mintedChain.gdaInfo?.poolAddress as `0x${string}`,
      abi: superfluidPoolAbi,
      client: publicClient,
    });
    const nativeTokenContract = getContract({
      address: mintedInfo.mintedChain.gdaInfo
        ?.nativeTokenAddress as `0x${string}`,
      abi: erc20Abi,
      client: publicClient,
    });

    let flowRate: any = await superfluidPoolContract.read.getMemberFlowRate([
      user?.wallet?.address as `0x${string}`,
    ]);
    let balanceTimestamp = Number(new Date().getTime()) / 1000;
    let balance: any = await nativeTokenContract.read.balanceOf([
      user?.wallet?.address as `0x${string}`,
    ]);

    setStreamInfo({
      flowRate: flowRate as bigint,
      balance: balance as bigint,
      balanceTimestamp: balanceTimestamp,
    });
  }, [user?.wallet?.address]);

  useEffect(() => {
    getStreamInfo();
  }, []);

  return streamInfo;
};
