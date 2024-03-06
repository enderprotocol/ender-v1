// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");

// const { eth, goerli, unlockAccount } = require('../utils/common')

// const abiJson = require('../abi/LidoWithdrawQueue.json')
// const finalizeJson = require('../abi/LidoFinalizeABI.json');

// const addrs = process.env.ENVIORNMENT === 'prod' ? eth : goerli
// const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
// const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";

// describe("Ender Lido Bond Flow", function () {
//   let lidoFinalizer, owner, alice, bob;
//   let aliceTokenId, bobTokenId;
//   let endTokenAddress, enderBondAddress, enderTreasuryAddress, enderStrategyAddress, enderOracleAddress;
//   let stEthToken, withdrawNFT, lidoFinalContract, endToken, enderBond, bondNFT, enderTreasury, enderStrategy, enderOracle;

//   const principal = ethers.parseEther("1");

//   const maturities = [30, 365];

//   before("deploy contracts", async function () {
//     [owner, alice, bob] = await ethers.getSigners();
//     lidoFinalizer = await unlockAccount(addrs.lidoFinalizer)

//     stEthToken = await ethers.getContractAt("IERC20", addrs.stETHTokenAddr);

//     withdrawNFT = await ethers.getContractAt(abiJson, addrs.LidoWithdrawQueue)

//     lidoFinalContract = await ethers.getContractAt(finalizeJson, addrs.LidoFinalizeContract)

//     // Deploy EndToken
//     const EndToken = await ethers.getContractFactory("EndToken");
//     endToken = await upgrades.deployProxy(EndToken, [1], {
//       initializer: "initialize",
//     });
//     await endToken.waitForDeployment();
//     endTokenAddress = await endToken.getAddress();

//     // Deploy EnderBond
//     const EnderBond = await ethers.getContractFactory("EnderBond");
//     enderBond = await upgrades.deployProxy(EnderBond, [endTokenAddress, signature], {
//       initializer: "initialize",
//     });
//     await enderBond.waitForDeployment();
//     enderBondAddress = await enderBond.getAddress();

//     // Deploy BondNFT
//     const BondNFT = await ethers.getContractFactory("BondNFT");
//     bondNFT = await upgrades.deployProxy(BondNFT, [enderBondAddress, baseURI], {
//       initializer: "initialize",
//     });
//     await bondNFT.waitForDeployment();
//     const bondNFTAddr = await bondNFT.getAddress()

//     // Deploy EnderTreasury
//     const EnderTreasury = await ethers.getContractFactory("EnderTreasury");
//     enderTreasury = await upgrades.deployProxy(EnderTreasury, [endTokenAddress, enderBondAddress], {
//       initializer: "initialize",
//     });
//     await enderTreasury.waitForDeployment();
//     enderTreasuryAddress = await enderTreasury.getAddress();

//     // Deploy EnderStrategy
//     const EnderStrategy = await ethers.getContractFactory("EnderLidoStrategy");
//     enderStrategy = await upgrades.deployProxy(EnderStrategy, [enderTreasuryAddress, addrs.stETHTokenAddr], {
//       initializer: "initialize",
//     });
//     await enderStrategy.waitForDeployment();
//     enderStrategyAddress = await enderStrategy.getAddress();

//     // Deploy EnderOracle
//     const EnderOracle = await ethers.getContractFactory("EnderOracle");
//     enderOracle = await upgrades.deployProxy(EnderOracle, [], {
//       initializer: "initialize",
//     });
//     await enderOracle.waitForDeployment();
//     enderOracleAddress = await enderOracle.getAddress();

//     // set withdraw queue contract
//     await enderStrategy.setWithdrawStr(addrs.LidoWithdrawQueue)

//     // add ender strategy in treasury
//     await enderTreasury.setStrategy([enderStrategyAddress], true);

//     // set treasury and bondNFT in bond
//     await enderBond.setAddress(enderTreasuryAddress, 0)
//     await enderBond.setAddress(bondNFTAddr, 2)

//     // set bondable tokens for end token
//     await enderBond.setBondableTokens([endTokenAddress], true);

//     // set treasury in endtoken
//     await endToken.setTreasury(enderTreasuryAddress);

//     // set oracle in treasury
//     await enderTreasury.setAddress(enderOracleAddress, 2)

//     // set price feed in oracle
//     await enderOracle.setFeeds([ethers.ZeroAddress], ["0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"])

//     // get minter role
//     const minterRole = await endToken.MINTER_ROLE()

//     // grant minter role to treasury contract
//     await endToken.grantRole(minterRole, enderTreasuryAddress);

//     console.log(`End token deployed address: ${endTokenAddress}`)
//     console.log(`End bond nft address: ${bondNFTAddr}`)
//     console.log(`Ender bond address: ${enderBondAddress}`)
//     console.log(`Ender treasury address: ${enderTreasuryAddress}`)
//     console.log(`Ender Strategy address: ${enderStrategyAddress}`)
//   });

//   describe("1. deposit function test", function () {
//     it("Should not allow depositing with invalid maturity", async function () {
//       await expect(enderBond.deposit(principal, maturities[1] + 1, 0, endTokenAddress))
//         .to.be.revertedWithCustomError(enderBond, "InvalidMaturity()");
//     });

//     it("Should not allow depositing non-bondable tokens", async function () {
//       await expect(enderBond.deposit(principal, maturities[0], 0, enderTreasuryAddress))
//         .to.be.revertedWithCustomError(enderBond, "NotBondableToken()");

//       // set stETH as bondable token
//       await enderBond.connect(owner).setBondableTokens([addrs.stETHTokenAddr], true);
//     });
//   });

//   describe("2. withdraw", function () {
//     it("Pass 5 days", async function () {
//       await ethers.provider.send("evm_increaseTime", [5 * 24 * 60 * 60]);
//       await ethers.provider.send("evm_mine");
//     })

//     it("Alice can not withdraw as not finalized", async function () {
//       await expect(enderBond.connect(alice).withdraw(1))
//         .to.be.revertedWithCustomError(withdrawNFT, 'NotBondUser()');
//       await expect(enderBond.connect(alice).withdraw(1)).to.be.revertedWithCustomError(withdrawNFT, "RequestNotFoundOrNotFinalized").withArgs(aliceTokenId);
//     })

//     it("do finalization", async function () {
//       // send eth first
//       await bob.sendTransaction({
//         to: "0x388C818CA8B9251b393131C08a736A67ccB19297",
//         value: ethers.parseEther("400") // 400 ETH
//       })

//       // await lidoFinalContract.connect(lidoFinalizer).submitReportData({
//       //   consensusVersion: 1,
//       //   refSlot: 7113599,
//       //   numValidators: 256054,
//       //   clBalanceGwei: "8118732731574054",
//       //   stakingModuleIdsWithNewlyExitedValidators: [],
//       //   numExitedValidatorsByStakingModule: [],
//       //   withdrawalVaultBalance: "298539328228258243655",
//       //   elRewardsVaultBalance: "317333395944151607926",
//       //   sharesRequestedToBurn: 0,
//       //   withdrawalFinalizationBatches: [bobTokenId],
//       //   simulatedShareRate: "1136107395925588835372827049",
//       //   isBunkerMode: false,
//       //   extraDataFormat: 0,
//       //   extraDataHash: ethers.ZeroHash,
//       //   extraDataItemsCount: 0
//       // }, 1)

//       // // check nft token balance
//       // const tokenBalance = await withdrawNFT.balanceOf(enderStrategyAddress)
//       // expect(tokenBalance).to.be.eq(1)

//       // check eth balance
//     })
//   });
// });
