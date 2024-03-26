import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

import { EnderBond } from "../../typechain-types/contracts/EnderBond";
import { EndToken } from "../../typechain-types/contracts/ERC20/EndToken";
import { EnderStaking } from "../../typechain-types/contracts/EnderStaking";
import { MockEnderStaking } from "../../typechain-types/contracts/mock/MockEnderStaking";
import { SEndToken } from "../../typechain-types/contracts/ERC20/SEndToken";
import { Deployer } from "../utils/deployer";
import { expandToDecimals, signatureDigest } from "../utils/utils";

describe("Ender Bond deposit and withdraw", async () => {
    let owner: HardhatEthersSigner,
        signer: HardhatEthersSigner,
        signer1: HardhatEthersSigner,
        signer2: HardhatEthersSigner,
        stEthAddress: string,
        enderBondAddress: string,
        endTokenAddress: string,
        sEndTokenAddress: string,
        instadappLiteAddress: string,
        enderStakingAddress: string,
        mockEnderStakingAddress: string,
        stEth,
        enderBond: EnderBond,
        endToken: EndToken,
        sEndToken: SEndToken,
        enderStaking: EnderStaking,
        mockEnderStaking: MockEnderStaking,
        userSign: EnderStaking.SignDataStruct,
        signature1: string;

    const deployer = new Deployer();

    before(async function () {
        [owner, signer, signer1, signer2] = await ethers.getSigners();
        const contracts = await deployer.prepareEndBondTest({
            owner: owner.address,
            signer: signer.address,
        });

        stEth = contracts.stEth;
        stEthAddress = contracts.stEthAddr;

        sEndToken = contracts.sEndToken;
        sEndTokenAddress = contracts.sEndTokenAddr;

        instadappLiteAddress = contracts.instadappLiteAddress;

        endToken = contracts.endToken;
        endTokenAddress = contracts.endTokenAddr;

        enderBond = contracts.enderBond;
        enderBondAddress = contracts.enderBondAddress;

        enderStaking = contracts.enderStaking;
        enderStakingAddress = contracts.enderStakingAddress;

        // deploy mock ender staking contract
        const mockEnderStakingFactory = await ethers.getContractFactory("MockEnderStaking");
        mockEnderStaking = (await upgrades.deployProxy(
            mockEnderStakingFactory,
            [endTokenAddress, sEndTokenAddress, stEthAddress, signer.address],
            {
                initializer: "initialize",
            },
        )) as unknown as MockEnderStaking;

        mockEnderStakingAddress = await mockEnderStaking.getAddress();

        //signature
        signature1 = await signatureDigest(signer, "stakingContract", enderStakingAddress, signer1);
    });

    describe("Ender Staking contract test", async () => {
        it("should fail on second initialization attempt", async function () {
            // Attempt to re-initialize
            await expect(
                enderStaking.initialize(
                    endTokenAddress,
                    sEndTokenAddress,
                    stEthAddress,
                    signer.address,
                ),
            ).to.be.revertedWith("Initializable: contract is already initialized"); // Assuming this is the revert message for re-initialization
        });

        it("calculateRebaseIndex is 1e18 owing to the sEndTotalSupply is zero", async () => {
            const depositAmountEnd = expandToDecimals(5, 18);
            await endToken.connect(owner).mint(mockEnderStakingAddress, depositAmountEnd);

            const balanceAmt = await endToken.balanceOf(mockEnderStakingAddress);
            expect(balanceAmt).to.be.greaterThan(BigInt(0));

            const sEndTotalSupply = await sEndToken.totalSupply();
            expect(sEndTotalSupply).to.equal(BigInt(0));
            await mockEnderStaking._calculateRebaseIndex();

            const rebaseIndex = await mockEnderStaking.rebasingIndex();
            expect(rebaseIndex).to.equal(BigInt(1e18));
        });

        it("setAddress is reverted with ZeroAddress custom error", async () => {
            await expect(
                enderStaking.setAddress(ethers.ZeroAddress, 1),
            ).to.be.revertedWithCustomError(enderStaking, "ZeroAddress");
        });

        it("setAddress is reverted with invalid caller", async () => {
            await expect(
                enderStaking.connect(signer1).setAddress(stEthAddress, 1),
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("stake is reverted with InvalidAmount custom error", async () => {
            userSign = { user: signer1.address, key: "0", signature: signature1 };

            await expect(enderStaking.stake(0, userSign)).to.be.revertedWithCustomError(
                enderStaking,
                "InvalidAmount",
            );
        });

        it("stake is called with isWhitelisted", async () => {
            const stakingAmount = 10;
            let isWhitelisted = await mockEnderStaking.isWhitelisted();
            expect(isWhitelisted).to.equal(false);

            await mockEnderStaking.whitelist(true);
            isWhitelisted = await mockEnderStaking.isWhitelisted();
            expect(isWhitelisted).to.equal(true);

            const stakingEnable = await mockEnderStaking.stakingEnable();
            expect(stakingEnable).to.equal(true);

            const stakingContractPause = await mockEnderStaking.stakingContractPause();
            expect(stakingContractPause).to.equal(true);

            const sig = await signatureDigest(
                signer,
                "stakingContract",
                mockEnderStakingAddress,
                signer1,
            );
            userSign = { user: signer1.address, key: "0", signature: sig };
            const userAddresss = await mockEnderStaking.verify(userSign);
            const signerAddress = await mockEnderStaking.contractSigner();
            expect(userAddresss).to.equal(signerAddress);

            //mint to signer1
            const depositAmountEnd = expandToDecimals(5, 18);
            await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

            const balanceAmt = await endToken.balanceOf(signer1.address);
            await endToken.connect(signer1).approve(mockEnderStakingAddress, stakingAmount);

            await expect(
                mockEnderStaking.connect(signer1).stake(stakingAmount, userSign),
            ).to.be.not.revertedWithCustomError(mockEnderStaking, "NotWhitelisted");

            await mockEnderStaking.whitelist(false);
            isWhitelisted = await mockEnderStaking.isWhitelisted();
            expect(isWhitelisted).to.equal(false);
        });

        it("stake is reverted with NotWhitelisted owing to wrong signer", async () => {
            const stakingAmount = 10;
            let isWhitelisted = await mockEnderStaking.isWhitelisted();
            expect(isWhitelisted).to.equal(false);

            await mockEnderStaking.whitelist(true);
            isWhitelisted = await mockEnderStaking.isWhitelisted();
            expect(isWhitelisted).to.equal(true);

            const stakingEnable = await mockEnderStaking.stakingEnable();
            expect(stakingEnable).to.equal(true);

            const stakingContractPause = await mockEnderStaking.stakingContractPause();
            expect(stakingContractPause).to.equal(true);

            userSign = { user: signer1.address, key: "0", signature: signature1 };
            const userAddresss = await mockEnderStaking.verify(userSign);
            const signerAddress = await mockEnderStaking.contractSigner();
            expect(userAddresss).to.be.not.equal(signerAddress);

            //mint to signer1
            const depositAmountEnd = expandToDecimals(5, 18);
            await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

            const balanceAmt = await endToken.balanceOf(signer1.address);
            await endToken.connect(signer1).approve(mockEnderStakingAddress, stakingAmount);

            await expect(
                mockEnderStaking.connect(signer1).stake(stakingAmount, userSign),
            ).to.be.revertedWithCustomError(mockEnderStaking, "NotWhitelisted");

            await mockEnderStaking.whitelist(false);
            isWhitelisted = await mockEnderStaking.isWhitelisted();
            expect(isWhitelisted).to.equal(false);
        });

        it("stake is reverted with NotWhitelisted owing to wrong sender", async () => {
            const stakingAmount = 10;
            let isWhitelisted = await mockEnderStaking.isWhitelisted();
            expect(isWhitelisted).to.equal(false);

            await mockEnderStaking.whitelist(true);
            isWhitelisted = await mockEnderStaking.isWhitelisted();
            expect(isWhitelisted).to.equal(true);

            const stakingEnable = await mockEnderStaking.stakingEnable();
            expect(stakingEnable).to.equal(true);

            const stakingContractPause = await mockEnderStaking.stakingContractPause();
            expect(stakingContractPause).to.equal(true);

            const sig = await signatureDigest(
                signer,
                "stakingContract",
                mockEnderStakingAddress,
                signer1,
            );
            userSign = { user: signer1.address, key: "0", signature: sig };
            const userAddresss = await mockEnderStaking.verify(userSign);
            const signerAddress = await mockEnderStaking.contractSigner();
            expect(userAddresss).to.equal(signerAddress);

            //mint to signer1
            const depositAmountEnd = expandToDecimals(5, 18);
            await endToken.connect(owner).mint(signer1.address, depositAmountEnd);

            const balanceAmt = await endToken.balanceOf(signer1.address);
            await endToken.connect(signer1).approve(mockEnderStakingAddress, stakingAmount);

            await expect(
                mockEnderStaking.connect(signer2).stake(stakingAmount, userSign),
            ).to.be.revertedWithCustomError(mockEnderStaking, "NotWhitelisted");

            await mockEnderStaking.whitelist(false);
            isWhitelisted = await mockEnderStaking.isWhitelisted();
            expect(isWhitelisted).to.equal(false);
        });

        it("stake is reverted with not allowed staking enable", async () => {
            let stakingEnable = await enderStaking.stakingEnable();
            expect(stakingEnable).to.equal(true);

            await enderStaking.setStakingEnable(false);
            stakingEnable = await enderStaking.stakingEnable();
            expect(stakingEnable).to.equal(false);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            await expect(enderStaking.stake(10, userSign)).to.be.revertedWithCustomError(
                enderStaking,
                "NotAllowed",
            );

            await enderStaking.setStakingEnable(true);
            stakingEnable = await enderStaking.stakingEnable();
            expect(stakingEnable).to.equal(true);
        });

        it("stake is reverted with not allowed staking contract paused", async () => {
            let stakingContractPause = await enderStaking.stakingContractPause();
            expect(stakingContractPause).to.equal(true);

            await enderStaking.setStakingPause(false);
            stakingContractPause = await enderStaking.stakingContractPause();
            expect(stakingContractPause).to.equal(false);

            userSign = { user: signer1.address, key: "0", signature: signature1 };

            await expect(enderStaking.stake(10, userSign)).to.be.revertedWithCustomError(
                enderStaking,
                "NotAllowed",
            );

            await enderStaking.setStakingPause(true);
            stakingContractPause = await enderStaking.stakingContractPause();
            expect(stakingContractPause).to.equal(true);
        });

        it("unstake is reverted with not allowed unstaking enable", async () => {
            let unstakeEnable = await enderStaking.unstakeEnable();
            expect(unstakeEnable).to.equal(true);

            await enderStaking.setUnstakeEnable(false);
            unstakeEnable = await enderStaking.unstakeEnable();
            expect(unstakeEnable).to.equal(false);

            await expect(enderStaking.unstake(10)).to.be.revertedWithCustomError(
                enderStaking,
                "NotAllowed",
            );

            await enderStaking.setUnstakeEnable(true);
            unstakeEnable = await enderStaking.unstakeEnable();
            expect(unstakeEnable).to.equal(true);
        });

        it("unstake is reverted with InvalidAmount custom error", async () => {
            await expect(enderStaking.unstake(0)).to.be.revertedWithCustomError(
                enderStaking,
                "InvalidAmount",
            );
        });

        it("unstake is reverted with InvalidAmount custom error owing to balance isn't enough", async () => {
            const unstakeEnable = await enderStaking.unstakeEnable();
            expect(unstakeEnable).to.equal(true);

            const stakingContractPause = await enderStaking.stakingContractPause();
            expect(stakingContractPause).to.equal(true);

            const sEndTokenBalance = await sEndToken.balanceOf(signer1.address);

            await expect(
                enderStaking.connect(signer1).unstake(sEndTokenBalance + BigInt(1)),
            ).to.be.revertedWithCustomError(enderStaking, "InvalidAmount");
        });

        it("unstake is reverted with not allowed staking contract paused", async () => {
            let stakingContractPause = await enderStaking.stakingContractPause();
            expect(stakingContractPause).to.equal(true);

            await enderStaking.setStakingPause(false);
            stakingContractPause = await enderStaking.stakingContractPause();
            expect(stakingContractPause).to.equal(false);

            await expect(enderStaking.unstake(10)).to.be.revertedWithCustomError(
                enderStaking,
                "NotAllowed",
            );

            await enderStaking.setStakingPause(true);
            stakingContractPause = await enderStaking.stakingContractPause();
            expect(stakingContractPause).to.equal(true);
        });

        it("epochStakingReward is reverted with NotAllowed custom error owing to asset isn't stEth", async () => {
            await expect(
                enderStaking.epochStakingReward(endTokenAddress),
            ).to.be.revertedWithCustomError(enderStaking, "NotAllowed");
        });

        it("_hash function testing", async () => {
            userSign = { user: signer1.address, key: "0", signature: signature1 };

            const hashValue = await mockEnderStaking.hash(userSign);

            const typeHash = ethers.keccak256(
                ethers.toUtf8Bytes("userSign(address user,string key)"),
            );
            const keyHash = ethers.keccak256(ethers.toUtf8Bytes("0"));
            const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
                ["bytes32", "address", "bytes32"],
                [typeHash, signer1.address, keyHash],
            );
            const dataHash = ethers.keccak256(encodedData);
            const manualHash = await mockEnderStaking.hashTypedDataV4(dataHash);

            expect(hashValue).to.equal(manualHash);
        });

        it("_verify function testing", async () => {
            const sig = await signatureDigest(
                signer,
                "stakingContract",
                mockEnderStakingAddress,
                signer1,
            );
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig,
            };
            const userAddresss = await mockEnderStaking.verify(userSign);
            const signerAddress = await mockEnderStaking.contractSigner();
            expect(userAddresss).to.equal(signerAddress);
        });
    });
});
