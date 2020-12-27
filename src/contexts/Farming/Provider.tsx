import React, { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";

import ConfirmTransactionModal from "components/ConfirmTransactionModal";
import { ESCHUBQSLPAddress } from "constants/tokenAddresses";
import useApproval from "hooks/useApproval";
import useUbiq from "hooks/useUbiq";

import { getEarned, getStaked, harvest, redeem, stake, unstake } from "ubiq-sdk/utils";

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
  const ubiq = useUbiq();
  const { account } = useWallet();

  const ESCHUBQPoolAddress = ubiq ? ubiq.contracts.shinobi_pool.options.address : "";
  const { isApproved, isApproving, onApprove } = useApproval(ESCHUBQSLPAddress, ESCHUBQPoolAddress, () => setConfirmTxModalIsOpen(false));

  const fetchearnedBalanceESCHUBQ = useCallback(async () => {
    if (!account || !ubiq) return;
    const balance = await getEarned(ubiq.contracts.shinobi_pool, account);
    setearnedBalanceESCHUBQ(balance);
  }, [account, setearnedBalanceESCHUBQ, ubiq]);

  const fetchstakedBalanceESCHUBQ = useCallback(async () => {
    if (!account || !ubiq) return;
    const balance = await getStaked(ubiq.contracts.shinobi_pool, account);
    setstakedBalanceESCHUBQ(balance);
  }, [account, setstakedBalanceESCHUBQ, ubiq]);

  const fetchBalances = useCallback(async () => {
    fetchearnedBalanceESCHUBQ();
    fetchstakedBalanceESCHUBQ();
  }, [fetchearnedBalanceESCHUBQ, fetchstakedBalanceESCHUBQ]);

  const handleApprove = useCallback(() => {
    setConfirmTxModalIsOpen(true);
    onApprove();
  }, [onApprove, setConfirmTxModalIsOpen]);

  const handleHarvestESCHUBQ = useCallback(async () => {
    if (!ubiq) return;
    setConfirmTxModalIsOpen(true);
    await harvest(ubiq, account, ubiq.contracts.shinobi_pool, () => {
      setConfirmTxModalIsOpen(false);
      setIsHarvesting(true);
    }).catch((err) => {
      if (err.code === 4001) {
        console.log("Wallet: User cancelled");
      } else {
        console.log("Error caught:", err);
      }
    });
    setIsHarvesting(false);
  }, [account, setConfirmTxModalIsOpen, setIsHarvesting, ubiq]);

  const handleRedeemESCHUBQ = useCallback(async () => {
    if (!ubiq) return;
    setConfirmTxModalIsOpen(true);
    await redeem(ubiq, account, ubiq.contracts.shinobi_pool, () => {
      setConfirmTxModalIsOpen(false);
      setIsRedeeming(true);
    }).catch((err) => {
      if (err.code === 4001) {
        console.log("Wallet: User cancelled");
      } else {
        console.log("Error caught:", err);
      }
    });
    setIsRedeeming(false);
  }, [account, setConfirmTxModalIsOpen, setIsRedeeming, ubiq]);

  const handleStakeESCHUBQ = useCallback(
    async (amount: string) => {
      if (!ubiq) return;
      setConfirmTxModalIsOpen(true);
      await stake(ubiq, amount, account, ubiq.contracts.shinobi_pool, () => {
        setConfirmTxModalIsOpen(false);
        setIsStaking(true);
      });
      setIsStaking(false);
    },
    [account, setConfirmTxModalIsOpen, setIsStaking, ubiq]
  );

  const handleUnstakeESCHUBQ = useCallback(
    async (amount: string) => {
      if (!ubiq) return;
      setConfirmTxModalIsOpen(true);
      await unstake(ubiq, amount, account, ubiq.contracts.shinobi_pool, () => {
        setConfirmTxModalIsOpen(false);
        setIsUnstaking(true);
      });
      setIsUnstaking(false);
    },
    [account, setConfirmTxModalIsOpen, setIsUnstaking, ubiq]
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
