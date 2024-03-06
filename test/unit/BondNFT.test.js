// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");
// const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
// const baseURI = "https://endworld-backend-git-dev-metagaming.vercel.app/nft/metadata/";

// describe("BondNFT", function () {
//   let owner, wallet1;
//   let endTokenAddress, enderBondAddress, bondNFTAddress;
//   let endToken, enderBond, bondNFT;

//   before(async function () {
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
//     bondNFTAddress = await bondNFT.getAddress();

//     [owner, wallet1] = await ethers.getSigners();
//   });

//   describe("initialize", function () {
//     it("Should set token name and symbol", async function () {
//       expect(await bondNFT.name()).to.equal("Ender Bond NFT");
//       expect(await bondNFT.symbol()).to.equal("END-BOND");
//     });

//     it("Should set the right owner", async function () {
//       expect(await bondNFT.owner()).to.equal(owner.address);
//     });

//     it("Should set the right bond contract", async function () {
//       expect(await bondNFT.bond()).to.equal(enderBondAddress);
//     });
//   });

//   describe("mint", function () {
//     it("Should allow bond contract to mint", async function () {
//       await bondNFT.connect(owner).setBondContract(owner.address);
//       const initialBalance = await bondNFT.balanceOf(wallet1.address);
//       await bondNFT.connect(owner).mint(wallet1.address);
//       const finalBalance = await bondNFT.balanceOf(wallet1.address);
//       expect(finalBalance).to.equal(initialBalance + ethers.toBigInt(1));
//     });

//     it("Should not allow non-bond contract to mint", async function () {
//       await bondNFT.connect(owner).setBondContract(bondNFTAddress);
//       await expect(bondNFT.connect(owner).mint(wallet1.address))
//         .to.be.revertedWithCustomError(bondNFT, "NotBondContract()");
//     });

//     it("Should increase token ID when mint new nft", async function () {
//       const initialTokenId = await bondNFT.totalSupply();
//       await bondNFT.connect(owner).setBondContract(owner.address);
//       await bondNFT.connect(owner).mint(wallet1.address);
//       const finalTokenId = await bondNFT.totalSupply();
//       expect(finalTokenId).to.equal(initialTokenId + ethers.toBigInt(1));
//     });

//     it("Should return correct token ID", async function () {
//       await bondNFT.connect(owner).setBondContract(owner.address);
//       const initialBalance = await bondNFT.balanceOf(wallet1.address);
//       await bondNFT.connect(owner).mint(wallet1.address);
//       const finalBalance = await bondNFT.balanceOf(wallet1.address);
//       expect(finalBalance).to.equal(initialBalance + ethers.toBigInt(1));
//     });
//   });

//   describe("setBondContract", function () {
//     it("Should allow owner to set the bond contract address", async function () {
//       await bondNFT.connect(owner).setBondContract(bondNFTAddress);
//       expect(await bondNFT.bond()).to.equal(bondNFTAddress);
//     });

//     it("Should not allow non-owner to set the bond contract address", async function () {
//       await expect(bondNFT.connect(wallet1).setBondContract(bondNFTAddress))
//         .to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("Should revert if the bond address is the zero address", async function () {
//       await expect(bondNFT.connect(owner).setBondContract(ethers.ZeroAddress))
//         .to.be.revertedWithCustomError(bondNFT, "ZeroAddress()");
//     });

//     it("Should emit a BondContractChanged event", async function () {
//       await expect(bondNFT.setBondContract(bondNFTAddress))
//         .to.emit(bondNFT, 'BondContractChanged')
//         .withArgs(bondNFTAddress);
//     });
//   });
// });
