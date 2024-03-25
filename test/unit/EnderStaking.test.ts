import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers, upgrades } from "hardhat";
import { EnderBond } from "../../typechain-types/contracts/EnderBond";
import { EndToken } from "../../typechain-types/contracts/ERC20/EndToken";
import { EnderStaking } from "../../typechain-types/contracts/EnderStaking";
import { MockEnderStaking } from "../../typechain-types/contracts/mock/MockEnderStaking";
import { SEndToken } from "../../typechain-types/contracts/ERC20/SEndToken";

const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

describe("Ender Bond deposit and withdraw", async () => {
    let owner: Wallet,
        signer: Wallet,
        signer1: Wallet,
        signer2: Wallet,
        stEthAddress: string,
        enderBondAddress: string,
        endTokenAddress: string,
        endETHAddress: string,
        sEndTokenAddress:string,
        enderTreasuryAddress: string,
        bondNFTAddress: string,
        instadappLiteAddress: string,
        enderStakingAddress: string,
        mockEnderStakingAddress: string,
        enderBondLiquidityDepositAddress: string,
        stEth,
        enderBond: EnderBond,
        enderBondLiquidityDeposit,
        endToken: EndToken,
        endETHToken,
        sEndToken: SEndToken,
        enderTreasury,
        bondNFT,
        instadappLitelidoStaking,
        enderStaking: EnderStaking,
        mockEnderStaking: MockEnderStaking,
        userSign: EnderStaking.SignDataStruct,
        signature1: string;

    before(async function () {
        const stEthFactory = await ethers.getContractFactory("StETH");
        const instadappLiteFactory = await ethers.getContractFactory("StinstaToken");
        const endTokenFactory = await ethers.getContractFactory("EndToken");
        const enderBondLiquidityBondFactory = await ethers.getContractFactory(
            "EnderBondLiquidityDeposit",
        );
        const enderBondFactory = await ethers.getContractFactory("EnderBond");
        const enderTreasuryFactory = await ethers.getContractFactory("EnderTreasury");
        const enderStakingFactory = await ethers.getContractFactory("EnderStaking");
        const sEndTokenFactory = await ethers.getContractFactory("SEndToken");
        const bondNftFactory = await ethers.getContractFactory("BondNFT");
        const mockEnderStakingFactory = await ethers.getContractFactory("MockEnderStaking");
        const EndETHToken = await ethers.getContractFactory("EnderStakeEth");

        //Owner and signers addresses
        [owner, signer, signer1, signer2] = (await ethers.getSigners()) as unknown as Wallet[];

        //delpoy stEth
        stEth = await stEthFactory.deploy();
        stEthAddress = await stEth.getAddress();

        //deploy sEnd
        sEndToken = (await upgrades.deployProxy(sEndTokenFactory, [], {
            initializer: "initialize",
        })) as unknown as SEndToken;
        sEndTokenAddress = await sEndToken.connect(owner).getAddress();

        //deploy enderBondLiquidityDeposit
        enderBondLiquidityDeposit = await upgrades.deployProxy(
            enderBondLiquidityBondFactory,
            [stEthAddress, stEthAddress, owner.address, owner.address],
            {
                initializer: "initialize",
            },
        );
        enderBondLiquidityDepositAddress = await enderBondLiquidityDeposit.getAddress();

        //deploy insta app Lido Staking
        instadappLitelidoStaking = await instadappLiteFactory.deploy(
            "InstaToken",
            "Inst",
            owner.address,
            stEthAddress,
        );
        instadappLiteAddress = await instadappLitelidoStaking.getAddress();

        //deploy endToken
        endToken = (await upgrades.deployProxy(endTokenFactory, [], {
            initializer: "initialize",
        })) as unknown as EndToken;
        endTokenAddress = await endToken.getAddress();

        // deploy endETH token
        endETHToken = await upgrades.deployProxy(EndETHToken, [], {
            initializer: "initialize",
        });
        endETHAddress = await endETHToken.getAddress();

        //deploy enderBond
        enderBond = (await upgrades.deployProxy(
            enderBondFactory,
            [endTokenAddress, endETHAddress, ethers.ZeroAddress, signer.address],
            {
                initializer: "initialize",
            },
        )) as unknown as EnderBond;
        enderBondAddress = await enderBond.getAddress();

        //set enderBond address in endToken
        await endToken.setBond(enderBondAddress);

        //deploy ender Staking contract
        enderStaking = (await upgrades.deployProxy(
            enderStakingFactory,
            [endTokenAddress, sEndTokenAddress, stEthAddress, signer.address],
            {
                initializer: "initialize",
            },
        )) as unknown as EnderStaking;
        enderStakingAddress = await enderStaking.getAddress();

        // deploy mock ender staking contract
        mockEnderStaking = (await upgrades.deployProxy(
            mockEnderStakingFactory,
            [endTokenAddress, sEndTokenAddress, stEthAddress, signer.address],
            {
                initializer: "initialize",
            },
        )) as unknown as MockEnderStaking;

        mockEnderStakingAddress = await mockEnderStaking.getAddress();

        //deploy ender Treasury contract
        enderTreasury = await upgrades.deployProxy(
            enderTreasuryFactory,
            [
                endTokenAddress,
                enderStakingAddress,
                enderBondAddress,
                instadappLiteAddress,
                ethers.ZeroAddress,
                ethers.ZeroAddress,
                70,
                30,
            ],
            {
                initializer: "initializeTreasury",
            },
        );
        enderTreasuryAddress = await enderTreasury.getAddress();

        //deploy bond NFT contract
        bondNFT = await upgrades.deployProxy(bondNftFactory, [enderBondAddress, baseURI], {
            initializer: "initialize",
        });
        await bondNFT.waitForDeployment();
        bondNFTAddress = await bondNFT.getAddress();

        //set addresses, whitelists, grant roles
        await sEndToken.setAddress(enderStakingAddress, 1);

        await enderStaking.setAddress(enderBondAddress, 1);
        await enderStaking.setAddress(enderTreasuryAddress, 2);

        await enderBond.setBondableTokens([stEthAddress], true);
        await enderBond.setAddress(enderTreasuryAddress, 1);
        await enderBond.setAddress(bondNFTAddress, 3);
        await enderBond.setAddress(sEndTokenAddress, 9);

        await sEndToken.setStatus(2);
        await sEndToken.whitelist(enderBondAddress, true);

        await endToken.grantRole(MINTER_ROLE, owner.address);
        await endToken.setFee(20);

        await endToken.setExclude([enderBondAddress], true);
        await endToken.setExclude([enderTreasuryAddress], true);
        await endToken.setExclude([enderStakingAddress], true);

        await enderBond.setAddress(enderStakingAddress, 8);
        await enderBond.setAddress(stEthAddress, 6);

        await endToken.grantRole(MINTER_ROLE, enderStakingAddress);
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            enderBondAddress,
        );
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            owner.address,
        );

        await enderBond.setBool(true);

        await endETHToken.setTreasury(enderTreasuryAddress);
        await endETHToken.grantRole(MINTER_ROLE, enderBondAddress);

        await enderTreasury.setAddress(instadappLitelidoStaking, 5);
        await enderTreasury.setStrategy([instadappLitelidoStaking], true);
        await enderTreasury.setPriorityStrategy(instadappLitelidoStaking);

        //signature
        signature1 = await signatureDigest();
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
            const depositAmountEnd = expandTo18Decimals(5);
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
            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            await expect(
                enderStaking.stake(0, userSign),
            ).to.be.revertedWithCustomError(enderStaking, "InvalidAmount");
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

            const sig = await mockSignatureDigest();
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };
            const userAddresss = await mockEnderStaking.verify(userSign);
            const signerAddress = await mockEnderStaking.contractSigner();
            expect(userAddresss).to.equal(signerAddress);

            //mint to signer1
            const depositAmountEnd = expandTo18Decimals(5);
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

            const sig = await signatureDigest();
            userSign = {
                user: signer1.address, 
                key: "0", 
                signature: sig
            };
            const userAddresss = await mockEnderStaking.verify(userSign);
            const signerAddress = await mockEnderStaking.contractSigner();
            expect(userAddresss).to.be.not.equal(signerAddress);

            //mint to signer1
            const depositAmountEnd = expandTo18Decimals(5);
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

            const sig = await mockSignatureDigest();
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };
            const userAddresss = await mockEnderStaking.verify(userSign);
            const signerAddress = await mockEnderStaking.contractSigner();
            expect(userAddresss).to.equal(signerAddress);

            //mint to signer1
            const depositAmountEnd = expandTo18Decimals(5);
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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            await expect(
                enderStaking.stake(10, userSign),
            ).to.be.revertedWithCustomError(enderStaking, "NotAllowed");

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

            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

            await expect(
                enderStaking.stake(10, userSign),
            ).to.be.revertedWithCustomError(enderStaking, "NotAllowed");

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
            userSign = {
                user: signer1.address,
                key: "0",
                signature: signature1
            };

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
            const sig = await mockSignatureDigest();
            userSign = {
                user: signer1.address,
                key: "0",
                signature: sig
            };
            const userAddresss = await mockEnderStaking.verify(userSign);
            const signerAddress = await mockEnderStaking.contractSigner();
            expect(userAddresss).to.equal(signerAddress);
        });
    });

    async function signatureDigest() {
        let sig = await signer.signTypedData(
            {
                name: "bondContract",
                version: "1",
                chainId: 31337,
                verifyingContract: enderStakingAddress,
            },
            {
                userSign: [
                    {
                        name: "user",
                        type: "address",
                    },
                    {
                        name: "key",
                        type: "string",
                    },
                ],
            },
            {
                user: signer1.address,
                key: "0",
            },
        );
        return sig;
    }

    async function mockSignatureDigest() {
        let sig = await signer.signTypedData(
            {
                name: "stakingContract",
                version: "1",
                chainId: 31337,
                verifyingContract: mockEnderStakingAddress,
            },
            {
                userSign: [
                    {
                        name: "user",
                        type: "address",
                    },
                    {
                        name: "key",
                        type: "string",
                    },
                ],
            },
            {
                user: signer1.address,
                key: "0",
            },
        );
        return sig;
    }

    function expandTo18Decimals(n: number) {
        return ethers.parseUnits(n.toString(), 18);
    }
});
