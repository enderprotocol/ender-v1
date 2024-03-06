// const { expect } = require("chai");
// const { ethers, upgrades } = require("hardhat");
// const signature = "0xA2fFDf332d92715e88a958A705948ADF75d07d01";
// const MINTER_ROLE = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
// const ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'

// describe("EndToken", function () {
//   let owner, wallet1;
//   let endTokenAddress, enderBondAddress, enderTreasuryAddress;
//   let endToken, enderBond, enderTreasury;

//   before(async function () {
//     // Deploy EndToken

//     console.log("Before Deployemt");
//     const EndToken = await ethers.getContractFactory("EndToken2");
//     endToken = await upgrades.deployProxy(EndToken,{
//       initializer: "initialize",
//     });

//     console.log("Before Deployemt");

//     await endToken.waitForDeployment();
//     endTokenAddress = await endToken.getAddress();

   
//     // get minter role
//     // const minterRole = await endToken.MINTER_ROLE()

//     // grant minter role to treasury contract
//     // await endToken.grantRole(minterRole, enderTreasuryAddress);
    
//     [owner, wallet1] = await ethers.getSigners();
//     // await endToken.grantRole(minterRole, owner.address);
//   });

//   describe.only("Testing", function () {
//     it("Should set token name and symbol", async function () {
//       expect(await endToken.name()).to.equal("End Token");
//       expect(await endToken.symbol()).to.equal("END");
//     });

//     it("Should assign the total supply of tokens to the owner", async function () {
//       const ownerBalance = await endToken.balanceOf(owner.address);
//       expect(await endToken.totalSupply()).to.equal(ownerBalance);
//     });

//     it.only("mintAndVest", async function(){
//       await endToken.mint(wallet1.address,12000);
//       console.log("walleet1Address", wallet1.address);
//       console.log("ownerAddress", owner.address);
//       console.log("endTokenAddress",endToken.target);
//       const totalSupply = await endToken.totalSupply();
//       console.log("totalSupplyOfContract",totalSupply);

//       // 15552000 - 6 months 
//       // 7776000 - 3 months
//       //23328000 - 9 months 
//       //31536000 - 1 Year 
//       await increaseTime(31536000);
//       await endToken.getMintedEnd();
//       await increaseTime(7776000);
      
//       await endToken.getMintedEnd();
//       await increaseTime(7776000);

//       await endToken.getMintedEnd();

//       await increaseTime(7776000);

//       await endToken.getMintedEnd();

//       await increaseTime(7776000);

//       await endToken.getMintedEnd();

//       await increaseTime(7776000);
//       await endToken.getMintedEnd();


//       const balanceOfContractAfter = await endToken.balanceOf(endToken.target);
//       console.log("balance Of Contract After",balanceOfContractAfter);
      
//       const balanceOfOwner = await endToken.balanceOf(owner.address);
//       console.log(balanceOfOwner);

//     })

//     async function increaseTime(seconds) {
//         await ethers.provider.send("evm_increaseTime", [seconds]);
//         await ethers.provider.send("evm_mine");
//       }
//   });

//   describe("decimals", function () {
//     it("Should return 9 as decimals", async function () {
//       expect(await endToken.decimals()).to.equal(9);
//     });
//   });

//   describe("mint", function () {
//     it("Should not allow non-treasury to mint and update totalMint", async function () {
//       await endToken.connect(owner).setTreasury(enderTreasuryAddress);
//       const amount = 100;
//       await expect(endToken.connect(owner).mint(wallet1.address, amount))
//         .to.be.revertedWithCustomError(endToken, "NotTreasuryContract()");
//     });

//     it("Should allow mint when treasury is non zero address", async function () {
//       await endToken.connect(owner).setTreasury(owner.address);
//       if (await endToken.treasury() != ethers.ZeroAddress) {
//         const amount = 100;
//         const initialBalance = await endToken.balanceOf(owner.address);
//         await endToken.connect(owner).mint(owner.address, amount);
//         const finalBalance = await endToken.balanceOf(owner.address);
//         expect(finalBalance).to.equal(initialBalance + ethers.toBigInt(amount));
//       }
//     });

//     it("Should skip function when treasury is zero address", async function () {
//       await endToken.connect(owner).setTreasury(owner.address);
//       if (await endToken.treasury() == ethers.ZeroAddress) {
//         const amount = 100;
//         const initialBalance = await endToken.balanceOf(owner.address);
//         await endToken.connect(owner).mint(amount);
//         const finalBalance = await endToken.balanceOf(owner.address);
//         expect(finalBalance).to.equal(initialBalance);
//       }
//     });
//   });

//   describe("setTreasuryContract", function () {
//     it("Should allow owner to set the treasury contract address", async function () {
//       await endToken.connect(owner).setTreasury(enderTreasuryAddress);
//       expect(await endToken.treasury()).to.equal(enderTreasuryAddress);
//     });

//     it("Should not allow non-owner to set the treasury contract address", async function () {
//       await expect(endToken.connect(wallet1).setTreasury(enderTreasuryAddress))
//         .to.be.revertedWith(`AccessControl: account ${wallet1.address.toLowerCase()} is missing role ${ADMIN_ROLE}`);
//     });

//     it("Should revert if the treasury address is the zero address", async function () {
//       await expect(endToken.connect(owner).setTreasury(ethers.ZeroAddress)).to.be.revertedWithCustomError(endToken, "ZeroAddress()");
//     });

//     it("Should emit a TreasuryContractChanged event", async function () {
//       await expect(endToken.setTreasury(enderTreasuryAddress))
//         .to.emit(endToken, 'TreasuryContractChanged')
//         .withArgs(enderTreasuryAddress);
//     });
//   });
// });
