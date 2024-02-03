import { usePrivy } from '@privy-io/react-auth';
import { useCallback, useContext, useState } from 'react';
import { useViemWalletClient } from '../../lib/hooks/useViemWalletClient';
import { createPublicClient, http } from 'viem';
import { gdaForwarderV1Abi } from '../../lib/abi/gdaForwarderV1';
import { StreamRunningModal } from '../modals/StreamRunningModal';
import { MintStatusContext, UserMintInfoContext } from '../views/Dashboard';
import { INSUFFICIENT_FOR_GAS, REJECTED_TRANSACTION_GENERAL } from '../../lib/dictionary';
import { LoadingSpinner } from '../common/Loading';

export const ClaimStreamButton = () => {

  const { user } = usePrivy();
  const viemWalletClient: any = useViemWalletClient()
  const mintInfo = useContext(UserMintInfoContext)

  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [streamClaimedSuccessModal, setStreamClaimedSuccessModal] = useState<boolean>(false)


  const handleClaimStream = useCallback(async() => {

    setLoading(true)
    setErrorMessage('')

    let publicClient = createPublicClient({
      chain: mintInfo?.mintedChain.viemChain,
      transport: http()
    })

    try {
      const hash = await viemWalletClient!.writeContract({
        address: mintInfo?.mintedChain.gdaInfo?.gdaForwarderV1Address,
        abi: gdaForwarderV1Abi,
        functionName: 'connectPool',
        args: [mintInfo?.mintedChain.gdaInfo?.poolAddress, ""]
      })

    
      let tx = await publicClient.waitForTransactionReceipt({ hash });
      tx = await publicClient.getTransactionReceipt({ hash })
      
      // test this
      if (tx.status == 'success') {
        let updatedMintInfo = {...mintInfo, claimedStream: true}
        // update mint info
        localStorage.setItem(`${user?.wallet?.address}_sf`, JSON.stringify(updatedMintInfo))

        setLoading(false)
        setStreamClaimedSuccessModal(true)
      } 
    } catch (error:any) {
      if (error.message.includes('insufficient')) {
        setErrorMessage(INSUFFICIENT_FOR_GAS)
      } 

      if (error.message.includes('denied transaction')) {
        setErrorMessage(REJECTED_TRANSACTION_GENERAL)
      }

      setLoading(false)
    }
    
  }, [user?.wallet?.address, viemWalletClient, mintInfo])

  return (
    <div className="flex flex-col gap-y-2">
      <button className="cursor-pointer w-full bg-sf-green active:border-transparent active:outline-none focus:border-transparent focus:outline-none hover:border-transparent hover:outline-none rounded-[0.625rem] font-medium text-white" onClick={() => handleClaimStream()}>
      { loading ? 
        <LoadingSpinner />:
        <span>Claim Stream</span>
      }
      </button>
    
      { errorMessage && 
        <p className="text-error-red">{errorMessage}</p>
      }
    
      { streamClaimedSuccessModal &&
        <StreamRunningModal setModalOpen={setStreamClaimedSuccessModal}/>
      }
    </div>
  )
}