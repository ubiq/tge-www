import BigNumber from "bignumber.js";

export interface ContextValues {
  countdown?: number;
  earnedBalance?: BigNumber;
  tvl?: number;
  apr?: number;
  farmingStartTime: number;
  isApproved?: boolean;
  isApproving?: boolean;
  isHarvesting?: boolean;
  isRedeeming?: boolean;
  isStaking?: boolean;
  isUnstaking?: boolean;
  onApprove: () => void;
  onHarvestESCHUBQ: () => void;
  onRedeemESCHUBQ: () => void;
  onStakeESCHUBQ: (amount: string) => void;
  onUnstakeESCHUBQ: (amount: string) => void;
  earnedBalanceESCHUBQ?: BigNumber;
  stakedBalanceESCHUBQ?: BigNumber;
}
