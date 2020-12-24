import React, { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import { TGE1, ESCHUBQSLPAddress } from "constants/tokenAddresses";
import { getBalance } from "utils";

import Context from "./Context";

const Provider: React.FC = ({ children }) => {
  const [TGE1Balance, setTGE1Balance] = useState<BigNumber>();
  const [ESCHUBQLPBalance, setESCHUBQLPBalance] = useState<BigNumber>();

  const { account, ethereum }: { account: string | null; ethereum: provider } = useWallet();

  const fetchBalances = useCallback(
    async (userAddress: string, provider: provider) => {
      const balances = await Promise.all([await getBalance(provider, TGE1, userAddress), await getBalance(provider, ESCHUBQSLPAddress, userAddress)]);
      setTGE1Balance(new BigNumber(balances[0]).dividedBy(new BigNumber(10).pow(18)));
      setESCHUBQLPBalance(new BigNumber(balances[1]).dividedBy(new BigNumber(10).pow(18)));
    },
    [setTGE1Balance, setESCHUBQLPBalance]
  );

  useEffect(() => {
    if (account && ethereum) {
      fetchBalances(account, ethereum);
    }
  }, [account, ethereum, fetchBalances]);

  useEffect(() => {
    if (account && ethereum) {
      fetchBalances(account, ethereum);
      let refreshInterval = setInterval(() => fetchBalances(account, ethereum), 10000);
      return () => clearInterval(refreshInterval);
    }
  }, [account, ethereum, fetchBalances]);

  return (
    <Context.Provider
      value={{
        TGE1Balance,
        ESCHUBQLPBalance,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
