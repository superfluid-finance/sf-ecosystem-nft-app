import { useCallback, useContext, useEffect, useState } from "react";
import { StreamInfoType } from "../types/stream";
import { createPublicClient, erc20Abi, getContract, http } from "viem";
import { superfluidPoolAbi } from "../abi/superfluidPool";
import { UserMintInfo } from "../types/user";
import { ConnectedWalletContext } from "../../components/layout";
import { VERSION } from "../default";
import { viemChainLookupById } from "../utils";

export const useGetStreamInfo = () => {
  const [streamInfo, setStreamInfo] = useState<StreamInfoType>();
  const wallet = useContext(ConnectedWalletContext);

  const getStreamInfo = useCallback(async () => {
    let mintedInfo: UserMintInfo = JSON.parse(
      // @ts-ignore
      localStorage.getItem(wallet?.address + "_sf_" + VERSION),
    );

    let publicClient = createPublicClient({
      cacheTime: 10_000,
      chain: mintedInfo.mintedChain.viemChain,
      transport: http(
        viemChainLookupById(mintedInfo.mintedChain.viemChain.id).rpcUrl,
      ),
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

    let totalAmountReceivedByMember = await superfluidPoolContract.read.getTotalAmountReceivedByMember([
      wallet?.address as `0x${string}`,
    ]);

    let flowRate: any = await superfluidPoolContract.read.getMemberFlowRate([
      wallet?.address as `0x${string}`,
    ]);
    let balanceTimestamp = Number(new Date().getTime()) / 1000;
    let balance: any = await nativeTokenContract.read.balanceOf([
      wallet?.address as `0x${string}`,
    ]);

    setStreamInfo({
      flowRate: flowRate as bigint,
      balance: balance as bigint,
      totalAmountReceivedByMember: totalAmountReceivedByMember as bigint,
      balanceTimestamp: balanceTimestamp,
      tokenSymbol: mintedInfo.mintedChain.gdaInfo?.superTokenSymbol ?? "USDCx",
      chain: mintedInfo.mintedChain.name,
    });
  }, [wallet?.address]);

  useEffect(() => {
    getStreamInfo();
  }, []);

  return streamInfo;
};
