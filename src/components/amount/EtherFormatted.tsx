import Decimal from "decimal.js";
import { BigNumberish, ethers } from "ethers";
import { FC } from "react";

const EtherFormatted: FC<{ wei: BigNumberish }> = ({ wei }) => {
  const etherDecimalPlaces = 11;

  const ether = ethers.utils.formatEther(wei);

  return <>{new Decimal(ether).toDP(etherDecimalPlaces).toFixed()}</>;
};

export default EtherFormatted;
