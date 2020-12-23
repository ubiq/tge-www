import React, { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";

import ConfirmTransactionModal from "components/ConfirmTransactionModal";
import { ESCHUBQSLPAddress } from "constants/tokenAddresses";
import useApproval from "hooks/useApproval";
import useYam from "hooks/useYam";

import { getEarned, getStaked, harvest, redeem, stake, unstake } from "yam-sdk/utils";

import Context from "./Context";

const farmingStartTime = 1600545500 * 1000;

const Provider: React.FC = ({ children }) => {
  const [confirmTxModalIsOpen, setConfirmTxModalIsOpen] = useState(false);
  const [countdown, setCountdown] = useState<number>();
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [earnedBalanceESCHUBQ, setearnedBalanceESCHUBQ] = useState<BigNumber>();
  const [stakedBalanceESCHUBQ, setstakedBalanceESCHUBQ] = useState<BigNumber>();
  const yam = useYam();
  const { account } = useWallet();

  const ESCHUBQPoolAddress = yam ? yam.contracts.shinobi_pool.options.address : "";
  const { isApproved, isApproving, onApprove } = useApproval(ESCHUBQSLPAddress, ESCHUBQPoolAddress, () => setConfirmTxModalIsOpen(false));

  const fetchearnedBalanceESCHUBQ = useCallback(async () => {
    if (!account || !yam) return;
    const balance = await getEarned(yam.contracts.shinobi_pool, account);
    setearnedBalanceESCHUBQ(balance);
  }, [account, setearnedBalanceESCHUBQ, yam]);

  const fetchstakedBalanceESCHUBQ = useCallback(async () => {
    if (!account || !yam) return;
    const balance = await getStaked(yam.contracts.shinobi_pool, account);
    setstakedBalanceESCHUBQ(balance);
  }, [account, setstakedBalanceESCHUBQ, yam]);

  const fetchBalances = useCallback(async () => {
    fetchearnedBalanceESCHUBQ();
    fetchstakedBalanceESCHUBQ();
  }, [fetchearnedBalanceESCHUBQ, fetchstakedBalanceESCHUBQ]);

  const handleApprove = useCallback(() => {
    setConfirmTxModalIsOpen(true);
    onApprove();
  }, [onApprove, setConfirmTxModalIsOpen]);

  const handleHarvestESCHUBQ = useCallback(async () => {
    if (!yam) return;
    setConfirmTxModalIsOpen(true);
    await harvest(yam, account, yam.contracts.shinobi_pool, () => {
      setConfirmTxModalIsOpen(false);
      setIsHarvesting(true);
    });
    setIsHarvesting(false);
  }, [account, setConfirmTxModalIsOpen, setIsHarvesting, yam]);

  const handleRedeemESCHUBQ = useCallback(async () => {
    if (!yam) return;
    setConfirmTxModalIsOpen(true);
    await redeem(yam, account, yam.contracts.shinobi_pool, () => {
      setConfirmTxModalIsOpen(false);
      setIsRedeeming(true);
    });
    setIsRedeeming(false);
  }, [account, setConfirmTxModalIsOpen, setIsRedeeming, yam]);

  const handleStakeESCHUBQ = useCallback(
    async (amount: string) => {
      if (!yam) return;
      setConfirmTxModalIsOpen(true);
      await stake(yam, amount, account, yam.contracts.shinobi_pool, () => {
        setConfirmTxModalIsOpen(false);
        setIsStaking(true);
      });
      setIsStaking(false);
    },
    [account, setConfirmTxModalIsOpen, setIsStaking, yam]
  );

  const handleUnstakeESCHUBQ = useCallback(
    async (amount: string) => {
      if (!yam) return;
      setConfirmTxModalIsOpen(true);
      await unstake(yam, amount, account, yam.contracts.shinobi_pool, () => {
        setConfirmTxModalIsOpen(false);
        setIsUnstaking(true);
      });
      setIsUnstaking(false);
    },
    [account, setConfirmTxModalIsOpen, setIsUnstaking, yam]
  );

  useEffect(() => {
    fetchBalances();
    let refreshInterval = setInterval(() => fetchBalances(), 10000);
    return () => clearInterval(refreshInterval);
  }, [fetchBalances]);

  useEffect(() => {
    let refreshInterval = setInterval(() => setCountdown(farmingStartTime - Date.now()), 1000);
    return () => clearInterval(refreshInterval);
  }, [setCountdown]);

  return (
    <Context.Provider
      value={{
        farmingStartTime,
        countdown,
        isApproved,
        isApproving,
        isHarvesting,
        isRedeeming,
        isStaking,
        isUnstaking,
        onApprove: handleApprove,
        onHarvestESCHUBQ: handleHarvestESCHUBQ,
        onRedeemESCHUBQ: handleRedeemESCHUBQ,
        onStakeESCHUBQ: handleStakeESCHUBQ,
        onUnstakeESCHUBQ: handleUnstakeESCHUBQ,
        earnedBalanceESCHUBQ,
        stakedBalanceESCHUBQ,
      }}
    >
      {children}
      <ConfirmTransactionModal isOpen={confirmTxModalIsOpen} />
    </Context.Provider>
  );
};

export default Provider;
