import Web3 from "web3";
import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export { Ubiq } from "./Ubiq.js";
export { Web3, BigNumber };
