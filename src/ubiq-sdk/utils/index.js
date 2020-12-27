import { ethers } from "ethers";
import Web3 from "web3";
import BigNumber from "bignumber.js";

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

export const getEarned = async (pool, account) => {
  return new BigNumber(await pool.methods.earned(account).call());
};

export const getStaked = async (pool, account) => {
  return new BigNumber(await pool.methods.balanceOf(account).call());
};

export const getCirculatingSupply = async (yam) => {
  let now = await yam.web3.eth.getBlock("latest");
  let starttime = yam.toBigN(await yam.contracts.shinobi_pool.methods.starttime().call()).toNumber();
  let timePassed = now["timestamp"] - starttime;
  if (timePassed < 0) {
    return 0;
  }
  timePassed = now["timestamp"] - starttime;
  let pool2Yams = yam.toBigN((timePassed * 1500000) / 625000); // yams from second pool. note: just accounts for first week
  let circulating = pool2Yams
    .dividedBy(10 ** 36)
    .toFixed(2);
  return circulating;
};

export const getTotalSupply = async (yam) => {
  return await yam.contracts.yam.methods.totalSupply().call();
};

export const getStats = async (yam) => {
  const circSupply = await getCirculatingSupply(yam);
  const totalSupply = await getTotalSupply(yam);
  return {
    circSupply,
    totalSupply,
  };
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
