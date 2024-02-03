import { useCallback, useContext, useEffect, useState } from "react"
import { usePrivy } from '@privy-io/react-auth';
import { useRetrieveBalance } from "../../lib/hooks/useRetrieveBalance";
import { SelectedChainContext } from "../layout";
import { ClaimStreamModal } from "../modals/ClaimStreamModal";
import { createPublicClient, http, parseEther } from "viem";
import { useViemWalletClient } from "../../lib/hooks/useViemWalletClient";
import { gdaNftContractAbi } from "../../lib/abi/gdaNFTContract";
import { MintStatusContext } from "../views/Dashboard";
import { LoadingSpinner } from "../common/Loading";
import { INSUFFICIENT_BALANCE, REJECTED_TRANSACTION_MINT } from "../../lib/dictionary";

export const Mint = () => {

    const { user } = usePrivy()
    const userBalance = useRetrieveBalance()
    const [loading, setLoading] = useState<boolean>(false)
    const { selected } = useContext(SelectedChainContext)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [ openMintSuccessModal, setOpenMintSuccessModal ] = useState<boolean>(false)
    const viemWalletClient: any = useViemWalletClient()

    const handleMint = useCallback(async () => {
      setErrorMessage('')
      setLoading(true)

      try { 
        const hash = await viemWalletClient!.writeContract({
          address: selected.gdaInfo?.nftContractAddress,
          abi: gdaNftContractAbi,
          functionName: 'gdaMint',
          value: parseEther(selected.price as unknown as string)
        })

        let publicClient = createPublicClient({
          chain: selected.viemChain,
          transport: http()
        })

        let tx = await publicClient.waitForTransactionReceipt({ hash });
        tx = await publicClient.getTransactionReceipt({ hash })
        
        // test this
        if (tx.status == 'success') {
          setOpenMintSuccessModal(true)
          setLoading(false)
        }
      } catch (error: any) {
        if (error.message.includes('denied transaction')) {
          setErrorMessage(REJECTED_TRANSACTION_MINT)
        } 
        setLoading(false)

      }
    }, [user?.wallet?.address, viemWalletClient])
 
    useEffect(() => {
      // @ts-ignore
      if(userBalance < selected.price) {
        setErrorMessage(INSUFFICIENT_BALANCE)
      } else {
        setErrorMessage('')
      }
    }, [userBalance, selected])

    return (
      <div className="flex flex-col gap-y-2">
      <button className={`${userBalance < selected.price ? 'bg-invalid-grey cursor-not-allowed text-[#8995A1]' : 'cursor-pointer bg-sf-green text-white'} w-full active:border-transparent active:outline-none focus:border-transparent focus:outline-none hover:border-transparent hover:outline-none rounded-[0.625rem] font-medium`} onClick={() => userBalance < selected.price ? null : handleMint()}>
        { loading ?
        <LoadingSpinner /> :
        <span>Mint</span>
        }
      </button>
      { errorMessage && 
      <p className="text-error-red">{errorMessage}</p>
      }
      { openMintSuccessModal &&
        <ClaimStreamModal setModalOpen={setOpenMintSuccessModal}/>
      }
      </div>
    )
}