import { BigNumber, BigNumberish, ethers } from 'ethers'
import { FC, ReactElement, useEffect, useMemo, useState } from 'react'

import EtherFormatted from './EtherFormatted'

const ANIMATION_MINIMUM_STEP_TIME = 75

export interface FlowingBalanceProps {
  balance: bigint
  /**
   * Timestamp in Subgraph's UTC.
   */
  balanceTimestamp: number
  flowRate: bigint
}

const FlowingBalance: FC<FlowingBalanceProps> = ({
  balance,
  balanceTimestamp,
  flowRate
}): ReactElement => {

  //If decimal setting is 5 18 show respective decimals
  const [weiValue, setWeiValue] = useState<BigNumberish>(balance)

  useEffect(() => setWeiValue(balance), [balance])

  const flowRateBigNumber = useMemo(() => BigNumber.from(flowRate), [flowRate])

  const balanceTimestampMs = useMemo(
    () => balanceTimestamp*(1000),
    [balanceTimestamp]
  )

  //If balance in settings is 0, then show smart flowing balance
  useEffect(() => {
    const balanceBigNumber = ethers.BigNumber.from(balance)

    let stopAnimation = false
    let lastAnimationTimestamp: DOMHighResTimeStamp = 0

    const animationStep = (currentAnimationTimestamp: DOMHighResTimeStamp) => {
      if (stopAnimation) {
        return
      }

      if (
        currentAnimationTimestamp - lastAnimationTimestamp >
        ANIMATION_MINIMUM_STEP_TIME
      ) {
        const currentTimestampBigNumber = ethers.BigNumber.from(
          new Date().valueOf() // Milliseconds elapsed since UTC epoch, disregards timezone.
        )

        setWeiValue(
          balanceBigNumber.add(
            currentTimestampBigNumber
              .sub(balanceTimestampMs)
              .mul(flowRateBigNumber)
              .div(1000)
          )
        )

        lastAnimationTimestamp = currentAnimationTimestamp
      }

      window.requestAnimationFrame(animationStep)
    }

    window.requestAnimationFrame(animationStep)

    return () => {
      stopAnimation = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, balanceTimestamp, flowRate])

  return (
    <EtherFormatted wei={weiValue} />  
  )
}

export default FlowingBalance