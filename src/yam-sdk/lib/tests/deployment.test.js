import { Yam } from "../index.js";

export const yam = new Yam(
  "http://localhost:8545/",
  // "http://127.0.0.1:9545/",
  "1001",
  true,
  {
    defaultAccount: "",
    defaultConfirmations: 1,
    autoGasMultiplier: 1.5,
    testing: false,
    defaultGas: "6000000",
    defaultGasPrice: "1000000000000",
    accounts: [],
    ethereumNodeTimeout: 10000,
  }
);

describe("post-deployment", () => {
  let snapshotId;
  let user;

  beforeAll(async () => {
    const accounts = await yam.web3.eth.getAccounts();
    yam.addAccount(accounts[0]);
    user = accounts[0];
    snapshotId = await yam.testing.snapshot();
  });

  beforeEach(async () => {
    await yam.testing.resetEVM("0x2");
  });

  describe("supply ownership", () => {
    test("owner balance", async () => {
      let balance = await yam.contracts.yam.methods.balanceOf(user).call();
      expect(balance).toBe(
        yam
          .toBigN(7000000)
          .times(yam.toBigN(10 ** 18))
          .toString()
      );
    });

    test("total supply", async () => {
      let ts = await yam.contracts.yam.methods.totalSupply().call();
      expect(ts).toBe("10500000000000000000000000");
    });

    test("init supply", async () => {
      let init_s = await yam.contracts.yam.methods.initSupply().call();
      expect(init_s).toBe("10500000000000000000000000000000");
    });
  });

  describe("contract ownership", () => {
    test("yam gov", async () => {
      let gov = await yam.contracts.yam.methods.gov().call();
      expect(gov).toBe(yam.contracts.timelock.options.address);
    });

    test("reserves gov", async () => {
      let gov = await yam.contracts.reserves.methods.gov().call();
      expect(gov).toBe(yam.contracts.timelock.options.address);
    });

    test("pool owner", async () => {
      let owner = await yam.contracts.eth_pool.methods.owner().call();
      expect(owner).toBe(yam.contracts.timelock.options.address);
    });

    test("incentives owner", async () => {
      let owner = await yam.contracts.ycrv_pool.methods.owner().call();
      expect(owner).toBe(yam.contracts.timelock.options.address);
    });

    test("pool rewarder", async () => {
      let rewarder = await yam.contracts.eth_pool.methods.rewardDistribution().call();
      expect(rewarder).toBe(yam.contracts.timelock.options.address);
    });
  });

});
