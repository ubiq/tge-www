import { createContext } from "react";

import { ContextValues } from "./types";

const Context = createContext<ContextValues>({
  farmingStartTime: 1600545500000,
  onApprove: () => {},
  onHarvestESCHUBQ: () => {},
  onRedeemESCHUBQ: () => {},
  onStakeESCHUBQ: () => {},
  onUnstakeESCHUBQ: () => {},
});

export default Context;
