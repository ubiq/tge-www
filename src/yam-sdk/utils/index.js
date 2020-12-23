import { ethers } from "ethers";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import request from "request";
import { bnToDec } from "utils";

// temp
import { ContractIncentivizer } from "constants/tokenAddresses";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const GAS_LIMIT = {
  GENERAL: 510000,
  STAKING: {
    DEFAULT: 510000,
    SNX: 850000,
  },
};

export const getPoolStartTime = async (poolContract) => {
  return await poolContract.methods.starttime().call();
};

export const stake = async (yam, amount, account, poolContract, onTxHash) => {
  let now = new Date().getTime() / 1000;
  // const gas = GAS_LIMIT.STAKING[tokenName.toUpperCase()] || GAS_LIMIT.STAKING.DEFAULT;
  const gas = GAS_LIMIT.STAKING.DEFAULT;
  if (now >= 1597172400) {
    return poolContract.methods
      .stake(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account, gas }, async (error, txHash) => {
        if (error) {
          onTxHash && onTxHash("");
          console.log("Staking error", error);
          return false;
        }
        onTxHash && onTxHash(txHash);
        const status = await waitTransaction(yam.web3.eth, txHash);
        if (!status) {
          console.log("Staking transaction failed.");
          return false;
        }
        return true;
      });
  } else {
    alert("pool not active");
  }
};

export const unstake = async (yam, amount, account, poolContract, onTxHash) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1597172400) {
    return poolContract.methods
      .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account, gas: GAS_LIMIT.GENERAL }, async (error, txHash) => {
        if (error) {
          onTxHash && onTxHash("");
          console.log("Unstaking error", error);
          return false;
        }
        onTxHash && onTxHash(txHash);
        const status = await waitTransaction(yam.web3.eth, txHash);
        if (!status) {
          console.log("Unstaking transaction failed.");
          return false;
        }
        return true;
      });
  } else {
    alert("pool not active");
  }
};

export const harvest = async (yam, account, poolContract, onTxHash) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1597172400) {
    return poolContract.methods.getReward().send({ from: account, gas: GAS_LIMIT.GENERAL }, async (error, txHash) => {
      if (error) {
        onTxHash && onTxHash("");
        console.log("Harvest error", error);
        return false;
      }
      onTxHash && onTxHash(txHash);
      const status = await waitTransaction(yam.web3.eth, txHash);
      if (!status) {
        console.log("Harvest transaction failed.");
        return false;
      }
      return true;
    });
  } else {
    alert("pool not active");
  }
};

export const redeem = async (yam, account, poolContract, onTxHash) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1597172400) {
    return poolContract.methods.exit().send({ from: account, gas: GAS_LIMIT.GENERAL }, async (error, txHash) => {
      if (error) {
        onTxHash && onTxHash("");
        console.log("Redeem error", error);
        return false;
      }
      onTxHash && onTxHash(txHash);
      const status = await waitTransaction(yam.web3.eth, txHash);
      if (!status) {
        console.log("Redeem transaction failed.");
        return false;
      }
      return true;
    });
  } else {
    alert("pool not active");
  }
};

export const approve = async (tokenContract, poolContract, account) => {
  return tokenContract.methods.approve(poolContract.options.address, ethers.constants.MaxUint256).send({ from: account, gas: 80000 });
};

export const getPoolContracts = async (yam) => {
  const pools = Object.keys(yam.contracts)
    .filter((c) => c.indexOf("_pool") !== -1)
    .reduce((acc, cur) => {
      const newAcc = { ...acc };
      newAcc[cur] = yam.contracts[cur];
      return newAcc;
    }, {});
  return pools;
};

export const getEarned = async (yam, pool, account) => {
  return new BigNumber(await pool.methods.earned(account).call());
};

export const getStaked = async (yam, pool, account) => {
  return new BigNumber(await pool.methods.balanceOf(account).call());
};

export const getCurrentPrice = async (yam) => {
  // FORBROCK: get current YAM price
  return new BigNumber(await yam.contracts.eth_rebaser.methods.getCurrentTWAP().call());
};

export const getTargetPrice = async (yam) => {
  return yam.toBigN(1).toFixed(2);
};

export const getProjectedRebase = async (yam) => {
  let projected_rebase_perc = await getProjectedRebasePercent(yam);
  if (projected_rebase_perc == 0) return 0;
  let total_supply = new BigNumber(await getMaxSupply());
  return total_supply.dividedBy(100).times(projected_rebase_perc).toNumber();
};

export const getProjectedRebasePercent = async (yam) => {
  let BASE = new BigNumber(10).pow(18);
  let twap = (await getCurrentPrice(yam)).dividedBy(BASE);
  if (twap.isGreaterThanOrEqualTo(0.95) && twap.isLessThanOrEqualTo(1.05)) return 0;
  let target_price = await getTargetPrice(yam);
  let rebase_lag = await getRebaseLag(yam);
  let deviation = twap.minus(target_price).dividedBy(target_price);
  return deviation.dividedBy(rebase_lag).times(100).toNumber();
};

export const getProjectedMint = async (yam) => {
  let rebase = await getProjectedRebase(yam);
  let mint_percent = await getProjectedMintPercent(yam);
  return rebase <= 0 ? 0 : (rebase * mint_percent) / 100;
};

export const getProjectedMintPercent = async (yam, rebaseType) => {
  let BASE = new BigNumber(10).pow(18);
  if (!rebaseType) {
    return 0;
  }
  return new BigNumber(await yam.contracts.eth_rebaser.methods.rebaseMintPerc().call()).div(BASE).times(100).toNumber();
};

export const getRebaseLag = async (yam) => {
  return await yam.contracts.eth_rebaser.methods.rebaseLag().call();
};

export const getCirculatingSupply = async (yam) => {
  let now = await yam.web3.eth.getBlock("latest");
  let scalingFactor = yam.toBigN(await yam.contracts.TGE1.methods.yamsScalingFactor().call());
  let starttime = yam.toBigN(await yam.contracts.eth_pool.methods.starttime().call()).toNumber();
  let timePassed = now["timestamp"] - starttime;
  if (timePassed < 0) {
    return 0;
  }
  let yamsDistributed = yam.toBigN((8 * timePassed * 250000) / 625000); //yams from first 8 pools
  timePassed = now["timestamp"] - starttime;
  let pool2Yams = yam.toBigN((timePassed * 1500000) / 625000); // yams from second pool. note: just accounts for first week
  let circulating = pool2Yams
    .plus(yamsDistributed)
    .times(scalingFactor)
    .dividedBy(10 ** 36)
    .toFixed(2);
  return circulating;
};

export const getLastRebaseTimestamp = async (yam) => {
  try {
    const lastTimestamp = yam.toBigN(await yam.contracts.eth_rebaser.methods.lastRebaseTimestampSec().call()).toNumber();
    return lastTimestamp;
  } catch (e) {
    console.log(e);
  }
};

export const getNextRebaseTimestamp = async (yam) => {
  try {
    let now = await yam.web3.eth.getBlock("latest").then((res) => res.timestamp);
    let interval = 43200; // 12 hours
    let offset = 28800; // 8am/8pm utc
    let secondsToRebase = 0;
    if (await yam.contracts.eth_rebaser.methods.rebasingActive().call()) {
      if (now % interval > offset) {
        secondsToRebase = interval - (now % interval) + offset;
      } else {
        secondsToRebase = offset - (now % interval);
      }
    }
    return secondsToRebase;
  } catch (e) {
    console.log(e);
  }
};

export const getTotalSupply = async (yam) => {
  return await yam.contracts.yam.methods.totalSupply().call();
};

export const getStats = async (yam) => {
  const curPrice = await getCurrentPrice(yam);
  const circSupply = await getCirculatingSupply(yam);
  const nextRebase = await getNextRebaseTimestamp(yam);
  const targetPrice = await getTargetPrice(yam);
  const totalSupply = await getTotalSupply(yam);
  return {
    circSupply,
    curPrice,
    nextRebase,
    targetPrice,
    totalSupply,
  };
};

export const delegate = async (yam, account, onTxHash) => {
  return yam.contracts.TGE1.methods.delegate(account).send({ from: account, gas: 150000 }, async (error, txHash) => {
    if (error) {
      onTxHash && onTxHash("");
      console.log("Delegate error", error);
      return false;
    }
    onTxHash && onTxHash(txHash);
    const status = await waitTransaction(yam.web3.eth, txHash);
    if (!status) {
      console.log("Delegate transaction failed.");
      return false;
    }
    return true;
  });
};

export const didDelegate = async (yam, account) => {
  return (await yam.contracts.TGE1.methods.delegates(account).call()) === account;
};

export const vote = async (yam, proposal, side, account, onTxHash) => {
  return yam.contracts.gov3.methods.castVote(proposal, side).send({ from: account, gas: 180000 }, async (error, txHash) => {
    if (error) {
      onTxHash && onTxHash("");
      console.log("Vote error", error);
      return false;
    }
    onTxHash && onTxHash(txHash);
    const status = await waitTransaction(yam.web3.eth, txHash);
    if (!status) {
      console.log("Vote transaction failed.");
      return false;
    }
    return true;
  });
};


export const getScalingFactor = async (yam) => {
  return new BigNumber(await yam.contracts.TGE1.methods.yamsScalingFactor().call());
};


export const scalingFactors = async (yam) => {
  let BASE = new BigNumber(10).pow(18);

  let rebases = await yam.contracts.TGE1.getPastEvents("Rebase", {
    fromBlock: 10886913,
    toBlock: "latest",
  });
  let scalingFactors = [];
  let blockNumbers = [];
  let blockTimes = [];
  for (let i = 0; i < rebases.length; i++) {
    blockNumbers.push(rebases[i]["blockNumber"]);
    scalingFactors.push(Math.round(new BigNumber(rebases[i]["returnValues"]["prevYamsScalingFactor"]).div(BASE).toNumber() * 100) / 100);
  }
  return {
    factors: scalingFactors,
    blockNumbers: blockNumbers,
    blockTimes: blockTimes,
  };
};

export const getTVL = async (yam) => {
  const BASE = new BigNumber(10).pow(18);
  const yamPrice = bnToDec(await getCurrentPrice(yam));
  const wethPrice = await getWETHPrice();
  const totalIncentivizerValue = (await yam.contracts.masterchef.methods.userInfo(44, ContractIncentivizer).call()).amount;
  const totalSLPSupply = await yam.contracts.slp.methods.totalSupply().call();
  const totalSLPReserves = await yam.contracts.slp.methods.getReserves().call();
  const Yamvalue = new BigNumber(totalSLPReserves._reserve0).dividedBy(BASE).toNumber();
  const ETHvalue = new BigNumber(totalSLPReserves._reserve1).dividedBy(BASE).toNumber();
  return Math.round((totalIncentivizerValue / totalSLPSupply) * (ETHvalue * wethPrice + Yamvalue * yamPrice) * 1) / 1;
};

export const getRebaseType = (rebaseValue) => {
  return Math.sign(rebaseValue) === 1;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const waitTransaction = async (provider, txHash) => {
  const web3 = new Web3(provider);
  let txReceipt = null;
  while (txReceipt === null) {
    const r = await web3.eth.getTransactionReceipt(txHash);
    txReceipt = r;
    await sleep(2000);
  }
  return txReceipt.status;
};

export const getCurrentBlock = async (yam) => {
  try {
    return await yam.web3.eth.getBlock("latest");
  } catch (e) {
    console.log(e);
  }
};

const requestHttp = (url) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: url,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      }
    );
  });
};

export const getWETHPrice = async () => {
  const data = await requestHttp("https://api.coingecko.com/api/v3/coins/weth");
  return data.market_data.current_price.usd;
};

export const getYam = async () => {
  const data = await requestHttp("https://api.coingecko.com/api/v3/coins/yam-2");
  return data;
};

export const getMarketCap = async () => {
  const data = await requestHttp("https://api.coingecko.com/api/v3/coins/yam-2");
  return data.market_data.market_cap.usd;
};

export const getMaxSupply = async () => {
  const data = await requestHttp("https://api.coingecko.com/api/v3/coins/yam-2");
  return data.market_data.max_supply;
};
