import {
    EndToken,
    StETH,
    StETH__factory,
    EndToken__factory,
    MockLido__factory,
    MockLido,
    EnderBond,
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

    let owner: HardhatEthersSigner, user1: HardhatEthersSigner;
    let initialRateOfChange: number,
        initialBondRewardPercentage: number,
        initialRebaseIndex: number;
    let depositAmount: bigint, maturity: number, bondFee: number;

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

        // Mint sEth to user wallet.

        // Initialize test variables based on PDF setup
        initialRateOfChange = 1; // Just an example, set according to your contract
        initialBondRewardPercentage = 10; // Represented as 10% for the test case
        initialRebaseIndex = 1; // Starting index

        // Example deposit settings from the PDF
        depositAmount = ethers.parseEther("1"); // 1 ETH for simplicity
        maturity = 90; // 90 days to maturity
        bondFee = 500; // Represented as 5% in basis points
    });

    it("Deposit 1:", async () => {
        console.log(user1.getAddress());
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
        const principal = ethers.parseEther("1");
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

        const refactorShareIndex = await enderBond.secondsRefractionShareIndex(0);
        expect(refactorShareIndex).to.equal(0);
        expect((await enderBond.totalRefractionPrincipal()) / BigInt(1e16)).to.equal(BigInt(102));
    });
});
