import {
    EndToken,
    StETH,
    StETH__factory,
    EndToken__factory,
    MockLido__factory,
    MockLido,
    EnderBond,
    EnderTreasury,
} from "../../typechain-types";
import { ethers } from "hardhat";
import { createFixtureWithParameter, signatureDigest } from "../utils/utils";
import { Deployer } from "../utils/deployer";
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
describe("test enderBond contract", async () => {
    let enderBond: EnderBond;
    let enderTokenFactory: EndToken__factory;
    let stEthTokenFactory: StETH__factory;
    let lidoFactory: MockLido__factory;
    let stEth: StETH, endToken: EndToken, lido: MockLido;
    let treasury: EnderTreasury;
    let instadappLiteAddr: string;

    let owner: HardhatEthersSigner, user1: HardhatEthersSigner;
    let initialRateOfChange: number,
        initialBondRewardPercentage: number,
        initialRebaseIndex: number;
    let depositAmount: bigint, maturity: number, bondFee: number;
    const netYield = 700;
    const deployer = new Deployer();

    // Deploy contracts and set initial state before each test
    beforeEach(async () => {
        [owner, user1] = await ethers.getSigners();
        const contracts = await deployer.prepareEndBondTest({
            owner: owner.address,
            signer: user1.address,
        });
        enderBond = contracts.enderBond;
        stEth = contracts.stEth;
        endToken = contracts.endToken;
        treasury = contracts.enderTreasury;
        instadappLiteAddr = contracts.instadappLiteAddress;

        // Mint sEth to user wallet.

        // Initialize test variables based on PDF setup
        initialRateOfChange = 1; // Just an example, set according to your contract
        initialBondRewardPercentage = 10; // Represented as 10% for the test case
        initialRebaseIndex = 1; // Starting index

        // Example deposit settings from the PDF
        maturity = 90; // 90 days to maturity
        bondFee = 500; // Represented as 5% in basis points
    });

    it("Deposit first day", async () => {
        const principal = ethers.parseEther("100");
        const bondFee = 1000;
        const maturity = 7;
        const baseRate = 300;
        await enderBond.setBondYieldBaseRate(baseRate);

        const user1Addr = await user1.getAddress();
        const signature = await signatureDigest(
            user1,
            "bondContract",
            await enderBond.getAddress(),
            user1,
        );
        const userSign = {
            user: user1Addr,
            key: "0",
            signature,
        };
        const stEthAddr = await stEth.getAddress();
        await stEth.connect(user1).submit({ value: principal });
        await stEth.connect(user1).approve(await enderBond.getAddress(), principal);
        await expect(
            enderBond
                .connect(user1)
                .deposit(
                    user1Addr,
                    principal,
                    maturity,
                    bondFee,
                    await stEth.getAddress(),
                    userSign,
                ),
        ).to.emit(enderBond, "Deposit");

        const secondInDay = await enderBond.SECONDS_IN_DAY();
        const maturityInSeconds = BigInt(maturity) * secondInDay;

        await treasury.depositInStrategy(stEthAddr, instadappLiteAddr, principal);

        await time.increase(maturityInSeconds);

        const expectedEndTokenAmt =
            (((await enderBond.getInterest(maturity)) * BigInt(10000 + bondFee) * principal) /
                BigInt(365 * 10 ** 10)) *
            BigInt(maturity) *
            BigInt(1000);

        // After 7 days, TotalBondReturn.
        const tx = await enderBond.connect(user1).withdraw(1);
        await expect(tx).changeTokenBalance(endToken, user1, expectedEndTokenAmt);

        // Check Treasury value
        const expectedTreasuryValue = (principal * BigInt(netYield)) / BigInt(365);
        console.log("deposit return:", expectedTreasuryValue);

        const dailyBondYield = await treasury.calculateDepositReturn(stEthAddr);
        console.log("dailyBond Yield:", dailyBondYield);
        // console.log("dailyBond Yield:", dailyBondYield);
        // const totalReturn = await treasury.calculateDepositReturn(stEthAddr);
        // console.log("total Return:", totalReturn);
    });
});
