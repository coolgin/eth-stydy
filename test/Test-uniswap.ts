import {Address} from "hardhat-deploy/dist/types";

const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers"); // 时间、快照插件
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs"); // 断言插件
const { expect } = require("chai"); // 断言插件

const {ethers} = require("hardhat");
const hre = require("hardhat"); // 暂时不知道有什么用
require("@nomiclabs/hardhat-ethers");


import {IERC20, TestUniswap} from "../typechain";
import {JsonRpcSigner} from "@ethersproject/providers/src.ts/json-rpc-provider";
import {Signer} from "ethers";

const BN = require("bn.js");
const { sendEther } = require("./util");
const { DAI, WBTC, WBTC_WHALE } = require("./config");

const WBTC_ABI = require("./ABI/wbtc_abi.json");
const DAI_ABI = require("./ABI/dai_abi.json");

const mockAddress = "0x8558FE88F8439dDcd7453ccAd6671Dfd90657a32";

let signer: JsonRpcSigner; // 签名账户对象，使用对象做任何交互操作，如转账、授权、调用合约

describe("TEST-uniswap", function () {

  const WHALE = WBTC_WHALE;
  const TOKEN_IN = WBTC;
  const TOKEN_OUT = DAI;
  const AMOUNT_IN = 100;
  const AMOUNT_OUT_MIN = 1;

  let testUniswap2: TestUniswap;
  let tokenIn: IERC20;
  let tokenOut: IERC20;
  let owne: Signer;

  this.beforeEach(async () => {
    console.log("in beforeEach...");
    const provider = ethers.provider;

    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [mockAddress],
    });
    signer = await ethers.provider.getSigner(mockAddress);

    const {testUniswap, owner} = await loadFixture(deployTestUniswapFixture);
    tokenIn = await ethers.getContractAt(WBTC_ABI, TOKEN_IN, provider);
    tokenOut = await ethers.getContractAt(DAI_ABI, TOKEN_OUT, provider);

    owne = owner;
    testUniswap2 = testUniswap

    //signer = await ethers.getImpersonatedSigner(mockAddress);

    let ownerBNBBalance = await owner.getBalance();
    console.log(`ownerBalance balance is ${ownerBNBBalance.toString() / 1e18}`);

    let ownerBNBBalance2 = await signer.getBalance();
    console.log(`ownerBalance balance is ${ownerBNBBalance2.toString() / 1e18}`);

    let WBTCBalanceA = await tokenIn.balanceOf(signer.getAddress()) ;
    console.log(`USDT balance before transfer is ${WBTCBalanceA.toString()}`);
  })

  async function deployTestUniswapFixture() {
    const [owner] = await ethers.getSigners();
    const TestUniswap = await ethers.getContractFactory("TestUniswap");
    const testUniswap = await TestUniswap.deploy();
    return {testUniswap, owner};
  }

  describe("swap", function () {

    it("should pass", async () => {

      /*let ownerBNBBalance = await owne.getBalance();
      console.log(`ownerBalance balance is ${ownerBNBBalance.toString() / 1e18}`);

      const tx = await owne.sendTransaction({
        to: mockAddress,
        value: ethers.utils.parseEther("0.025"),
        gasLimit: 30000000
      });
      await tx.wait();
      console.log(tx); //在控制台显示交易过程

      ownerBNBBalance = await owne.getBalance();
      console.log(`ownerBalance balance is ${ownerBNBBalance.toString() / 1e18}`);

      let thisAddressBalance = await tokenIn.balanceOf(mockAddress);
      console.log("balance is : ", thisAddressBalance);*/

      await tokenIn.connect(signer).approve(testUniswap2.address, AMOUNT_IN);

      console.log("balance is : ",await tokenOut.balanceOf(signer.getAddress()));
      await testUniswap2.connect(signer).swap(
          tokenIn.address,
          tokenOut.address,
          AMOUNT_IN,
          AMOUNT_OUT_MIN,
          signer.getAddress(),
      );
      console.log("balance is : ",await tokenOut.balanceOf(signer.getAddress()));
    });
  });
});