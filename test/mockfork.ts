import {Contract} from "@ethersproject/contracts/src.ts";
import {JsonRpcSigner} from "@ethersproject/providers/src.ts/json-rpc-provider";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/src/signers";
import {address} from "hardhat/internal/core/config/config-validation";

const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers"); // 时间、快照插件
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs"); // 断言插件
const { expect } = require("chai"); // 断言插件

const {ethers} = require("hardhat"); // ethers库，与区块链的交互库，轻量级且强大

const hre = require("hardhat"); // 暂时不知道有什么用
const BigNumber = require('bignumber'); // 引入bignumber

// 需要将 usdt 的 abi 保存在本地，去区块浏览器里面复制一份下来
const USDT_ABI = require("./ABI/usdt_abi.json");
// usdt 合约的主网地址
const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";

// 这是模拟的账户地址，可以去bsc上查查余额多少哈
const mockAddress = "0x00000000219ab540356cBB839Cbe05303d7705Fa";

let USDT: Contract; // USDT全局contract对象
let signer: JsonRpcSigner; // 签名账户对象，使用对象做任何交互操作，如转账、授权、调用合约
let owners: SignerWithAddress; // 本地账户对象

describe("Fork", function () {

    // 钩子函数，每次测试都会提前运行进行
    beforeEach(async function () {
        const provider = ethers.provider;
        // 构造 usdt 合约对象
        USDT = await ethers.getContractAt(USDT_ABI, USDT_ADDRESS, provider);
            //.Contract(USDT_ADDRESS, USDT_ABI, provider);

        await hre.network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: [mockAddress],
        });

        // 获取签名的账户对象
        signer = await ethers.provider.getSigner(mockAddress);


        const [owner] = await ethers.getSigners();
        owners = owner;

    })



    it("Testing fork data", async function () {
        let totalSupply = await USDT.totalSupply();
        console.log("totalSupply is : ", totalSupply.toString());
        let thisAddressBalance = await USDT.balanceOf(mockAddress);
        console.log("thisAddress is : ", thisAddressBalance);
    });


    it("模拟测试账户", async() =>{

        /*let ownerBNBBalance = await owners.getBalance();
        console.log(`ownerBNBBalance balance is ${ownerBNBBalance.toString() / 1e18}`);*/


        /*const tx = {
            to: await signer.getAddress(),
            value: ethers.utils.parseEther("10"),
            gasLimit: 30000000
        }

        const receipt = await owners.sendTransaction(tx);*/

        let BNBBalance = await signer.getBalance();
        console.log(`BNB balance is ${BNBBalance.toString() / 1e18}`);

        let ownerBNBBalance = await owners.getBalance();
        console.log(`ownerBNBBalance balance is ${ownerBNBBalance.toString() / 1e18}`);

        /*let USDTBalance = await USDT.balanceOf(signer.getAddress()) / 1e18;
        console.log(`USDT balance is ${USDTBalance.toString()}`);*/

    })

    it("转账操作测试", async() =>{

        // 打印转账前的账户余额
        let USDTBalanceA = await USDT.balanceOf(signer.getAddress()) ;
        console.log(`USDT balance before transfer is ${USDTBalanceA.toString()}`);

        const recipient = "0x49636C5e61bDab68FB9f33f79866e003c6e9D12d";

        let USDTBalanceB = await USDT.balanceOf(recipient) ;
        console.log(`USDT balance of recipient before transfer is ${USDTBalanceB.toString()}`);

        let USDTBalanceC = await USDT.balanceOf(owners.address);
        console.log(`USDT balance of recipient before transfer is ${USDTBalanceC.toString()}`);

        console.log("========Transfering========");

        // 转账操作
        /*await USDT.connect(signer).transfer(
            "0x0Ad4C111595e2F477dF897A22B0e1bDdb49e555f",
            ethers.utils.parseUnits("1", 18)
        );*/

        await USDT.connect(signer).transfer(
            owners.address,
            ethers.utils.parseUnits("1000000", 1)
        );

        // 打印转账后的账户余额
        USDTBalanceA = await USDT.balanceOf(signer.getAddress()) ;
        console.log(`USDT balance after transfer is ${USDTBalanceA.toString()}`);

        USDTBalanceB = await USDT.balanceOf(recipient) ;
        console.log(`USDT balance of recipient after transfer is ${USDTBalanceB.toString()}`);

        USDTBalanceC = await USDT.balanceOf(owners.address) ;
        console.log(`USDT balance of recipient after transfer is ${USDTBalanceC.toString()}`);

    })

});
