const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

// const { EigenLayerStrategyManagerAddress, LidoAgentAddress } = require("../utils/common")
const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";

describe("EnderTreasury", function () {
    const EigenLayerStrategyManagerAddress = "0x858646372CC42E1A627fcE94aa7A7033e7CF075A";
    const LidoAgentAddress = "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c";

    // const libraAddress = "0x04919f277cfFB234CE2660769404FbFcC3673d85";
    const eigenLayerAddress = "0x85df364E61C35aBd0384DBb33598b6cCd2d90588";

    let owner, wallet1, signer1;
    let endTokenAddress,
        enderStakingAddress,
        enderBondAddress,
        mockEnderBondAddress,
        enderTreasuryAddress,
        enderELStrategyAddress,
        enderLidoStrategyAddress,
        instadappLiteAddress,
        stEthAddress,
        sEndTokenAddress,
        libraAddress;
    let endToken,
        enderStaking,
        enderBond,
        mockEnderBond,
        enderTreasury,
        enderELStrategy,
        enderLidoStrategy,
        instadappLitelidoStaking,
        stEth,
        sEnd,
        libra;

    beforeEach(async function () {
        [owner, wallet1, signer1] = await ethers.getSigners();

        const StEth = await ethers.getContractFactory("StETH");
        const EnderStaking = await ethers.getContractFactory("EnderStaking");
        const SEnd = await ethers.getContractFactory("SEndToken");
        const Lybra = await ethers.getContractFactory("mockLybra");

        stEth = await StEth.deploy();
        stEthAddress = await stEth.getAddress();

        sEnd = await upgrades.deployProxy(SEnd, [], {
            initializer: "initialize",
        });
        sEndTokenAddress = await sEnd.connect(owner).getAddress();

        // Deploy EndToken
        const EndToken = await ethers.getContractFactory("EndToken");
        endToken = await upgrades.deployProxy(EndToken, [], {
            initializer: "initialize",
        });
        await endToken.waitForDeployment();
        endTokenAddress = await endToken.getAddress();

        const InstadappLite = await ethers.getContractFactory("StinstaToken");
        instadappLitelidoStaking = await InstadappLite.deploy(
            "InstaToken",
            "Inst",
            owner.address,
            stEthAddress,
        );
        instadappLiteAddress = await instadappLitelidoStaking.getAddress();

        enderStaking = await upgrades.deployProxy(
            EnderStaking,
            [endTokenAddress, sEndTokenAddress, stEthAddress, wallet1.address],
            {
                initializer: "initialize",
            },
        );

        enderStakingAddress = await enderStaking.getAddress();

        libra = await Lybra.deploy(stEthAddress);
        libraAddress = await libra.getAddress();

        // Deploy EnderBond
        const EnderBond = await ethers.getContractFactory("EnderBond");
        enderBond = await upgrades.deployProxy(
            EnderBond,
            [endTokenAddress, ethers.ZeroAddress, wallet1.address],
            {
                initializer: "initialize",
            },
        );
        await enderBond.waitForDeployment();
        enderBondAddress = await enderBond.getAddress();

        // Deploy MockEnderBond
        const MockEnderBond = await ethers.getContractFactory("MockEnderBond");
        mockEnderBond = await upgrades.deployProxy(
            MockEnderBond,
            [endTokenAddress, ethers.ZeroAddress, wallet1.address],
            {
                initializer: "initialize",
            },
        );
        await mockEnderBond.waitForDeployment();
        mockEnderBondAddress = await mockEnderBond.getAddress();

        // Deploy EnderTreasury
        const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
        enderTreasury = await upgrades.deployProxy(
            EnderTreasury,
            [
                endTokenAddress,
                enderStakingAddress,
                enderBondAddress, // type 2
                instadappLiteAddress,
                libraAddress,
                eigenLayerAddress,
                70,
                30,
            ],
            {
                initializer: "initializeTreasury",
            },
        );

        enderTreasuryAddress = await enderTreasury.getAddress();

        enderStaking.setAddress(enderBondAddress, 1);
        enderStaking.setAddress(enderTreasuryAddress, 2);
        enderBond.setAddress(enderTreasuryAddress, 1); // set treasury
        enderBond.setAddress(enderStakingAddress, 8); // set staking

        mockEnderBond.setAddress(enderTreasuryAddress, 1); // set treasury
        mockEnderBond.setAddress(enderStakingAddress, 8); // set staking

        // Deploy EnderELStrategy
        const EnderELStrategy = await ethers.getContractFactory("EnderELStrategy");
        enderELStrategy = await upgrades.deployProxy(
            EnderELStrategy,
            [enderTreasuryAddress, EigenLayerStrategyManagerAddress],
            {
                initializer: "initialize",
            },
        );
        await enderELStrategy.waitForDeployment();
        enderELStrategyAddress = await enderELStrategy.getAddress();
    });

    describe("initialize", function () {
        it("should fail on second initialization attempt", async function () {
            // Attempt to re-initialize
            await expect(
                enderTreasury.initializeTreasury(
                    endTokenAddress,
                    enderStakingAddress,
                    enderBondAddress, // type 2
                    instadappLiteAddress,
                    libraAddress,
                    eigenLayerAddress,
                    70,
                    30
                )
            ).to.be.revertedWith("Initializable: contract is already initialized");
        });

        it("Error deployment with wrong params", async function () {
            const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
           
            await expect(
                upgrades.deployProxy(
                    EnderTreasury,
                    [
                        endTokenAddress,
                        enderStakingAddress,
                        enderBondAddress, // type 2
                        instadappLiteAddress,
                        libraAddress,
                        eigenLayerAddress,
                        60,
                        40,
                    ],
                    {
                        initializer: "initializeTreasury",
                    },
                )
            ).to.be.revertedWithCustomError(enderTreasury, "InvalidRatio") ;
        });

        it("Should set the right owner", async function () {
            expect(await enderTreasury.owner()).to.equal(owner.address);
        });
    });

    describe("setBond", function () {
        it("Should not allow non-owner to set the end token address", async function () {
            await expect(
                enderTreasury.connect(wallet1).setAddress(enderBondAddress, 0),
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should revert if the bond contract address is the zero address", async function () {
            await expect(
                enderTreasury.connect(owner).setAddress(ethers.ZeroAddress, 0),
            ).to.be.revertedWithCustomError(enderTreasury, "ZeroAddress");

            await expect(enderTreasury.getAddressByType(0)).to.be.revertedWithCustomError(
                enderTreasury,
                "ZeroAddress",
            );
        });

        it("Should set nominal yield correctly", async function () {
            const oldNominalYield = await enderTreasury.nominalYield();
            const newNominalYield = 700;
            await enderTreasury.connect(owner).setNominalYield(newNominalYield);
            expect(await enderTreasury.nominalYield()).to.equal(newNominalYield);

            await enderTreasury.connect(owner).setNominalYield(oldNominalYield);

            await expect(
                enderTreasury.connect(wallet1).setNominalYield(oldNominalYield),
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should set address correctly", async function () {
            const tmpAddress = "0x2bf3937b8BcccE4B65650F122Bb3f1976B937B2f";

            await enderTreasury.connect(owner).setAddress(tmpAddress, 1);
            expect(await enderTreasury.getAddressByType(1)).to.equal(tmpAddress);

            await enderTreasury.connect(owner).setAddress(endTokenAddress, 1);
            expect(await enderTreasury.getAddressByType(1)).to.equal(endTokenAddress);

            await enderTreasury.connect(owner).setAddress(tmpAddress, 2);
            expect(await enderTreasury.getAddressByType(2)).to.equal(tmpAddress);

            await enderTreasury.connect(owner).setAddress(enderBondAddress, 2);
            expect(await enderTreasury.getAddressByType(2)).to.equal(enderBondAddress);

            // 3,4,5,6 are not used yet
            await enderTreasury.connect(owner).setAddress(tmpAddress, 3);
            expect(await enderTreasury.getAddressByType(3)).to.equal(tmpAddress);

            await enderTreasury.connect(owner).setAddress(tmpAddress, 4);
            expect(await enderTreasury.getAddressByType(4)).to.equal(tmpAddress);

            await enderTreasury.connect(owner).setAddress(tmpAddress, 5);
            expect(await enderTreasury.getAddressByType(5)).to.equal(tmpAddress);

            await enderTreasury.connect(owner).setAddress(tmpAddress, 6);
            expect(await enderTreasury.getAddressByType(6)).to.equal(tmpAddress);
        });

        it("Should set bond yield base rate correctly", async function () {
            const oldBondYieldBaseRate = await enderTreasury.bondYieldBaseRate();

            await enderTreasury.connect(owner).setBondYieldBaseRate(BigInt(20));
            expect(await enderTreasury.bondYieldBaseRate()).to.equal(BigInt(20));

            await enderTreasury.connect(owner).setBondYieldBaseRate(oldBondYieldBaseRate);
            expect(await enderTreasury.bondYieldBaseRate()).to.equal(oldBondYieldBaseRate);

            await expect(
                enderTreasury.connect(wallet1).setBondYieldBaseRate(oldBondYieldBaseRate),
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await expect(
                enderTreasury.connect(owner).setBondYieldBaseRate(BigInt(0)),
            ).to.be.revertedWithCustomError(enderTreasury, "InvalidBaseRate");
        });
    });

    describe("setStrategy", function () {
        it("Should set the strategy correctly when called by the owner", async function () {
            const strategies = [enderELStrategyAddress];
            await enderTreasury.connect(owner).setStrategy(strategies, true);

            expect(await enderTreasury.strategies(enderELStrategyAddress)).to.equal(true);
        });

        it("Should revert when called by non-owner", async function () {
            // a random address to test ownership revert
            const strategies = ["0xA2fFDf332d92715e88a958A705948ADF75d07d01"];
            await expect(
                enderTreasury.connect(wallet1).setStrategy(strategies, true),
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should revert when strategies address array input is empty", async function () {
            await expect(
                enderTreasury.connect(owner).setStrategy([], true),
            ).to.be.revertedWithCustomError(enderTreasury, "InvalidStrategy");
        });

        it("Should set multiple strategies correctly", async function () {
            const strategies = [enderELStrategyAddress, instadappLiteAddress];
            await enderTreasury.connect(owner).setStrategy(strategies, false);
            expect(await enderTreasury.strategies(enderELStrategyAddress)).to.equal(false);
            expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(false);

            await enderTreasury.connect(owner).setStrategy(strategies, true);
            expect(await enderTreasury.strategies(enderELStrategyAddress)).to.equal(true);
            expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(true);
        });

        it("Should set priority strategy correctly", async function () {
            await expect(
                enderTreasury.connect(wallet1).setPriorityStrategy(enderELStrategyAddress),
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await enderTreasury.connect(owner).setPriorityStrategy(enderELStrategyAddress);
            expect(await enderTreasury.priorityStrategy()).to.equal(enderELStrategyAddress);

            await enderTreasury.connect(owner).setPriorityStrategy(instadappLiteAddress);
            expect(await enderTreasury.priorityStrategy()).to.equal(instadappLiteAddress);
        });
    });

    describe("receive", function () {
        it("Should accept ether", async function () {
            const initialBalance = await ethers.provider.getBalance(enderTreasuryAddress);
            await owner.sendTransaction({
                to: enderTreasuryAddress,
                value: ethers.parseEther("1.0"),
            });
            const finalBalance = await ethers.provider.getBalance(enderTreasuryAddress);
            expect(finalBalance).to.equal(initialBalance + ethers.parseEther("1.0"));
        });
    });

    describe("withdraw", function () {
        it("Should revert when called by non-owner", async function () {
            await expect(
                enderTreasury
                    .connect(wallet1)
                    .withdrawBondFee(stEthAddress, ethers.parseEther("1.0")),
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should return ETHDenomination", async function () {
            const ethDenomination = await enderTreasury.ETHDenomination(stEthAddress);
            const endTokenBalance = await endToken.totalSupply();

            console.log("ethDenomination: ", ethDenomination);

            expect(ethDenomination[0]).to.equal(BigInt(0));
            expect(ethDenomination[1]).to.equal(endTokenBalance);
        });

        it("Should calculate deposit return correctly", async function () {
            const depositReturn = await enderTreasury.calculateDepositReturn(stEthAddress);
            expect(depositReturn).to.equal(BigInt(0));
        });
    });

    describe("Should revert for function with modifier", function () {
        it("Should revert when called by non-bond", async function () {
            const amount = ethers.parseEther("1.0");

            await expect(
                enderTreasury.connect(wallet1).depositTreasury(
                    {
                        account: wallet1.address,
                        stakingToken: stEthAddress,
                        tokenAmt: amount,
                    },
                    amount,
                ),
            ).to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

            await expect(
                enderTreasury.connect(wallet1).withdraw(
                    {
                        account: wallet1.address,
                        stakingToken: stEthAddress,
                        tokenAmt: amount,
                    },
                    amount,
                ),
            ).to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

            await expect(
                enderTreasury.connect(wallet1).collect(wallet1.address, amount),
            ).to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

            await expect(
                enderTreasury.connect(wallet1).mintEndToUser(wallet1.address, amount),
            ).to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

            await expect(
                enderTreasury.connect(wallet1).stakeRebasingReward(wallet1.address),
            ).to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

            const wrongStrategyAddress = "0x2D4C407BBe49438ED859fe965b140dcF1aaB71a9";
            await expect(
                enderTreasury
                    .connect(wallet1)
                    .depositInStrategy(stEthAddress, wrongStrategyAddress, amount),
            ).to.be.revertedWithCustomError(enderTreasury, "NotAllowed");

            await expect(
                enderTreasury
                    .connect(wallet1)
                    .withdrawFromStrategy(stEthAddress, wrongStrategyAddress, amount),
            ).to.be.revertedWithCustomError(enderTreasury, "NotAllowed");
        });
    });

    describe("Should deposit and withdraw correctly", async function () {
        beforeEach(async () =>{
            await stEth.connect(owner).submit({
                value: ethers.parseEther("200"),
            });
            await stEth.connect(owner).transfer(enderTreasuryAddress, ethers.parseEther("50"));
        });

        it("Should set strategy correctly", async function () {
            await stEth.connect(owner).approve(instadappLiteAddress, ethers.parseEther("50"));
            await instadappLitelidoStaking.connect(owner).deposit(ethers.parseEther("50"));

            // change the owner to the treasury
            await enderTreasury.connect(owner).setAddress(owner.address, 2);
            expect(await enderTreasury.getAddressByType(2)).to.equal(owner.address);

            const strategies = [enderELStrategyAddress, instadappLiteAddress];

            await enderTreasury.connect(owner).setStrategy(strategies, true);
            expect(await enderTreasury.strategies(enderELStrategyAddress)).to.equal(true);
            expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(true);
        });

        it("Invalid deposit in strategy", async function () {
            const asset = stEthAddress;
            const strategy = instadappLiteAddress;
            const amount = ethers.parseEther("2.0");

            const invalidAmount = ethers.parseEther("0");

            expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(true);

            await expect(
                enderTreasury.connect(owner).depositInStrategy(asset, strategy, invalidAmount),
            ).to.be.revertedWithCustomError(enderTreasury, "ZeroAmount");

            const invalidAsset = ethers.ZeroAddress;
            await expect(
                enderTreasury.connect(owner).depositInStrategy(invalidAsset, strategy, amount),
            ).to.be.revertedWithCustomError(enderTreasury, "ZeroAddress");

            await expect(
                enderTreasury.setStrategy([ethers.ZeroAddress], true)
            ).to.emit(enderTreasury, "StrategyUpdated").withArgs(ethers.ZeroAddress, true);

            await expect(
                enderTreasury.depositInStrategy(asset, ethers.ZeroAddress, amount)
            ).to.be.revertedWithCustomError(enderTreasury, "ZeroAddress");

            await expect(
                enderTreasury.setStrategy([ethers.ZeroAddress], false)
            ).to.emit(enderTreasury, "StrategyUpdated").withArgs(ethers.ZeroAddress, false);
        });

        it("Should deposit in strategy correctly", async function () {
            const asset = stEthAddress;
            const instaDappStrategy = instadappLiteAddress;
            const libraStrategy = libraAddress;
            const amount = ethers.parseEther("2.0");            

            const beforeInstaDappDepositValuations = await enderTreasury.instaDappDepositValuations();
            const beforeTotalDepositInStrategy = await enderTreasury.totalDepositInStrategy();

            await enderTreasury.connect(owner).depositInStrategy(asset, instaDappStrategy, amount);

            let instaDappDepositValuations = await enderTreasury.instaDappDepositValuations();
            expect(instaDappDepositValuations).to.equal(beforeInstaDappDepositValuations + amount);

            let totalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            expect(totalDepositInStrategy).to.equal(beforeTotalDepositInStrategy + amount);

            await enderTreasury.connect(owner).depositInStrategy(asset, libraStrategy, amount);

            totalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            expect(totalDepositInStrategy).to.equal(beforeTotalDepositInStrategy + amount * 2n);
        });

        it("Invalid withdraw from strategy", async function () {
            const asset = stEthAddress;
            const strategy = instadappLiteAddress;
            const amount = ethers.parseEther("2.0");

            const invalidAmount = ethers.parseEther("0");

            expect(await enderTreasury.strategies(instadappLiteAddress)).to.equal(true);

            await expect(
                enderTreasury.connect(owner).withdrawFromStrategy(asset, strategy, invalidAmount),
            ).to.be.revertedWithCustomError(enderTreasury, "ZeroAmount");

            const invalidAsset = ethers.ZeroAddress;
            await expect(
                enderTreasury.connect(owner).withdrawFromStrategy(invalidAsset, strategy, amount),
            ).to.be.revertedWithCustomError(enderTreasury, "ZeroAddress");

            await expect(
                enderTreasury.setStrategy([ethers.ZeroAddress], true)
            ).to.emit(enderTreasury, "StrategyUpdated").withArgs(ethers.ZeroAddress, true);

            await expect(
                enderTreasury.withdrawFromStrategy(asset, ethers.ZeroAddress, amount)
            ).to.be.revertedWithCustomError(enderTreasury, "ZeroAddress");

            await expect(
                enderTreasury.setStrategy([ethers.ZeroAddress], false)
            ).to.emit(enderTreasury, "StrategyUpdated").withArgs(ethers.ZeroAddress, false);
        });

        it("Should withdraw from strategy correctly", async function () {
            const instaDappStrategy = instadappLiteAddress;
            const libraStrategy = libraAddress;
            const amount = ethers.parseEther("2.0");

            await stEth.connect(owner).transfer(instaDappStrategy, ethers.parseEther("10"));
            await stEth.connect(owner).transfer(libraStrategy, ethers.parseEther("10"));

            await enderTreasury.connect(owner).depositInStrategy(stEthAddress, instaDappStrategy, amount);
            await enderTreasury.connect(owner).depositInStrategy(stEthAddress, libraStrategy, amount);

            const beforeInstaDappWithdrawlValuations = await enderTreasury.instaDappWithdrawlValuations();

            await stEth.increaseAllowance(instadappLiteAddress, ethers.parseEther("100"));
            await instadappLitelidoStaking.deposit(amount);

            const withdrawAmt = await instadappLitelidoStaking.viewStinstaTokensValue(amount);
            await instadappLitelidoStaking.withdrawStinstaTokens(withdrawAmt);
            filter = instadappLitelidoStaking.filters.WithdrawStinstaTokens;
            const events = await instadappLitelidoStaking.queryFilter(filter, -1);
            const event1 = events[0];
            const args1 = event1.args;
            const returnAmt = args1.amount;

            await enderTreasury
                .connect(owner)
                .withdrawFromStrategy(stEthAddress, instaDappStrategy, amount);
            
            const instaDappWithdrawlValuations = await enderTreasury.instaDappWithdrawlValuations();            
            expect(instaDappWithdrawlValuations).to.equal(beforeInstaDappWithdrawlValuations + returnAmt);

            const beforeTotalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            await enderTreasury.connect(owner).withdrawFromStrategy(stEthAddress, libraStrategy, amount);

            const totalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            expect(totalDepositInStrategy).to.equal(beforeTotalDepositInStrategy-amount);
        });

        it("Should withdraw from strategy with zero returnAmount", async function () {
            const anotherStrategy = owner.address;
            const amount = ethers.parseEther("2.0");

            await stEth.connect(owner).transfer(anotherStrategy, ethers.parseEther("10"));
            await enderTreasury.setStrategy([anotherStrategy], true);

            await enderTreasury.connect(owner).depositInStrategy(stEthAddress, anotherStrategy, amount);

            const beforeTotalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            const beforeTotalRewardsFromStrategy = await enderTreasury.totalRewardsFromStrategy(stEthAddress);
            await enderTreasury.connect(owner).withdrawFromStrategy(stEthAddress, anotherStrategy, amount);

            const totalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            expect(totalDepositInStrategy).to.equal(beforeTotalDepositInStrategy-amount);

            const totalRewardsFromStrategy = await enderTreasury.totalRewardsFromStrategy(stEthAddress);
            expect(totalRewardsFromStrategy).to.eq(beforeTotalRewardsFromStrategy);

            await enderTreasury.setStrategy([anotherStrategy], false);
        });

        it("Should deposit and withdraw correctly", async function () {
            const amount = ethers.parseEther("1");
            const amount2 = ethers.parseEther("2");

            await enderTreasury.setAddress(owner.address, 2);

            const beforeEpochDepoistAmount = await enderTreasury.epochDeposit();
            const beforeFundsInfoAmount = await enderTreasury.fundsInfo(stEthAddress);

            await enderTreasury.connect(owner).depositTreasury(
                {
                    account: owner.address,
                    stakingToken: stEthAddress,
                    tokenAmt: amount,
                },
                BigInt(0),
            );

            const epochDepoistAmount = await enderTreasury.epochDeposit();
            expect(epochDepoistAmount).to.equal(beforeEpochDepoistAmount + amount);

            const fundsInfoAmount = await enderTreasury.fundsInfo(stEthAddress);
            expect(fundsInfoAmount).to.equal(beforeFundsInfoAmount + amount);

            // set 1 stEth to treasury, so it can be withdrawn
            const asset = stEthAddress;
            const instaDappStrategy = instadappLiteAddress;

            const beforeInstaDappDepositValuations = await enderTreasury.instaDappDepositValuations();
            await enderTreasury.connect(owner).depositInStrategy(asset, instaDappStrategy, amount);

            const instaDappDepositValuations = await enderTreasury.instaDappDepositValuations();
            expect(instaDappDepositValuations).to.equal(beforeInstaDappDepositValuations + amount);

            let totalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            expect(totalDepositInStrategy).to.equal(amount);

            /// eigenLayer test start
            await enderTreasury.setAddress(eigenLayerAddress, 6);
            await enderTreasury.setStrategy([eigenLayerAddress], true);

            let beforeTotalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            await expect(enderTreasury.depositInStrategy(asset, eigenLayerAddress, amount))
                .to.be.emit(enderTreasury, "StrategyDeposit")
                .withArgs(asset, eigenLayerAddress, amount);
            totalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            expect(totalDepositInStrategy).to.eq(beforeTotalDepositInStrategy + amount);
            await enderTreasury.setStrategy([eigenLayerAddress], false);
            /// eigenLayer test end

            /// another strategy test for depositInStrategy
            const anotherStrategy = owner.address;
            await enderTreasury.setStrategy([anotherStrategy], true);

            beforeTotalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            await expect(enderTreasury.depositInStrategy(asset, anotherStrategy, amount))
                .to.be.emit(enderTreasury, "StrategyDeposit")
                .withArgs(asset, anotherStrategy, amount);
            totalDepositInStrategy = await enderTreasury.totalDepositInStrategy();
            expect(totalDepositInStrategy).to.eq(beforeTotalDepositInStrategy + amount);
            await enderTreasury.setStrategy([anotherStrategy], false);
            /// another strategy test end for depositInStrategy

            await enderTreasury.connect(owner).depositTreasury(
                {
                    account: owner.address,
                    stakingToken: stEthAddress,
                    tokenAmt: amount,
                },
                amount,
            );

            const epochDepoistAmount2 = await enderTreasury.epochDeposit();
            expect(epochDepoistAmount2).to.equal(amount2);

            const fundsInfoAmount2 = await enderTreasury.fundsInfo(stEthAddress);
            expect(fundsInfoAmount2).to.equal(amount2);

            await enderTreasury.connect(owner).withdraw(
                {
                    account: owner.address,
                    stakingToken: stEthAddress,
                    tokenAmt: amount,
                },
                amount,
            );

            await expect(
                enderTreasury.connect(owner).withdraw(
                    {
                        account: owner.address,
                        stakingToken: ethers.ZeroAddress,
                        tokenAmt: amount,
                    },
                    0,
                )
            ).to.be.revertedWithCustomError(enderTreasury, "TransferFailed");

            await owner.sendTransaction({
                to: enderTreasuryAddress,
                value: amount
            });

            await enderTreasury.connect(owner).withdraw(
                {
                    account: owner.address,
                    stakingToken: ethers.ZeroAddress,
                    tokenAmt: amount,
                },
                0,
            );

            await enderTreasury.setAddress(enderBondAddress, 2);
        });

        it("Should collect correctly", async function () {
            const amount = ethers.parseEther("1");
            await endToken.connect(owner).mint(enderTreasuryAddress, amount);
            await endToken.mint(enderBondAddress, amount);
            await enderTreasury.setAddress(owner.address, 2);

            await expect(
                enderTreasury.collect(owner.address, amount)
            ).to.emit(enderTreasury, "Collect").withArgs(owner.address, amount);

            await enderTreasury.setAddress(enderBondAddress, 2);
        });

        it("Should withdrawBondFee correctly", async function () {
            const amount = ethers.parseEther("0.01");

            await enderTreasury.setAddress(mockEnderBondAddress, 2);
            await mockEnderBond.initAvailableBondFee(amount);

            const beforeAmt = await stEth.balanceOf(owner.address);
            await enderTreasury.connect(owner).withdrawBondFee(stEthAddress, amount);
            const afterAmt = await stEth.balanceOf(owner.address);

            expect(afterAmt).to.eq(beforeAmt + amount);
            expect(await mockEnderBond.availableBondFee()).to.eq(0);

            await mockEnderBond.initAvailableBondFee(amount - BigInt(2));
            await enderTreasury.connect(owner).withdrawBondFee(stEthAddress, amount);
            expect(await mockEnderBond.availableBondFee()).to.eq(amount - BigInt(2));
        });

        // this one always before stakeRebasingReward
        it("Should set it back correctly", async function () {
            await enderTreasury.connect(owner).setAddress(enderBondAddress, 2);
            expect(await enderTreasury.getAddressByType(2)).to.equal(enderBondAddress);
        });
    });

    describe("setAddress / getAddress function test", function() {
        it("setAddress is reverted with InvalidAddress custom error when address type is invalid", async () => {
            await expect(enderTreasury.setAddress(signer1.address, 0))
                .to.be.revertedWithCustomError(enderTreasury, "InvalidAddress");
            
            await expect(enderTreasury.setAddress(signer1.address, 7))
                .to.be.revertedWithCustomError(enderTreasury, "InvalidAddress");
        });

        it("getAddress is reverted with InvalidType custom error when type is invalid", async () => {
            await expect(enderTreasury.getAddressByType(7))
                .to.be.revertedWithCustomError(enderTreasury, "InvalidType");
        });
    });

    describe("mintEndToUser function test", function() {
        it("Should mintEndToUser correctly", async function () {
            const amount = ethers.parseEther("1");
            const beforeBalance = await endToken.balanceOf(signer1.address);

            await enderTreasury.setAddress(owner.address, 2);

            await expect(
                enderTreasury.mintEndToUser(signer1.address, amount)
            ).to.emit(enderTreasury, "MintEndToUser")
            .withArgs(signer1.address, amount);

            const afterBalance = await endToken.balanceOf(signer1.address);
            expect(afterBalance).to.eq(beforeBalance + amount);

            await enderTreasury.setAddress(enderBondAddress, 2);
        });
    });
});
