import React, { createContext, useEffect, useState } from "react";

import { useWallet } from "use-wallet";

import { Ubiq } from "ubiq-sdk/lib";

export interface UbiqContext {
  ubiq?: any;
}

export const Context = createContext<UbiqContext>({
  ubiq: undefined,
});

declare global {
  interface Window {
    ubiqsauce: any;
  }
}

const UbiqProvider: React.FC = ({ children }) => {
  const { ethereum } = useWallet();
  const [ubiq, setUbiq] = useState<any>();

  useEffect(() => {
    if (ethereum) {
      const ubiqLib = new Ubiq(ethereum, "1", false, {
        defaultAccount: "",
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: "6000000",
        defaultGasPrice: "1000000000000",
        accounts: [],
        ethereumNodeTimeout: 10000,
      });

      setUbiq(ubiqLib);
      window.ubiqsauce = ubiqLib;
    }
  }, [ethereum]);

  return <Context.Provider value={{ ubiq }}>{children}</Context.Provider>;
};

export default UbiqProvider;
