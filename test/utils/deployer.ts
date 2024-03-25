import {
    EnderBond,
    EnderStakeEth,
    EndToken,
    MockLido,
    SEndToken,
    StETH,
} from "../../typechain-types";
import { ethers, upgrades } from "hardhat";
import { baseURI, MINTER_ROLE } from "./constants";
export class Deployer {
    async lido(): Promise<MockLido> {
        const lidoFactory = await ethers.getContractFactory("MockLido");
        return (await lidoFactory.deploy()) as unknown as MockLido;
    }
    async stEth(): Promise<StETH> {
        const stEthTokenFactory = await ethers.getContractFactory("StETH");
        return (await stEthTokenFactory.deploy()) as unknown as StETH;
    }

    async endToken(): Promise<EndToken> {
        const endTokenFactory = await ethers.getContractFactory("EndToken");
        return (await upgrades.deployProxy(endTokenFactory, [], {
            initializer: "initialize",
        })) as unknown as EndToken;
    }

    async sEndToken(): Promise<SEndToken> {
        const sEndTokenFactory = await ethers.getContractFactory("SEndToken");
        const sEndToken = (await upgrades.deployProxy(sEndTokenFactory, [], {
            initializer: "initialize",
        })) as unknown as SEndToken;
        return sEndToken;
    }

    async enderStakeEth(): Promise<EnderStakeEth> {
        const enderStakeEthFactory = await ethers.getContractFactory("EnderStakeEth");
        const enderStakeEth = (await upgrades.deployProxy(enderStakeEthFactory, [], {
            initializer: "initialize",
        })) as unknown as EnderStakeEth;
        return enderStakeEth;
    }

    async prepareEndBondTest({ owner, signer }: { owner: string; signer: string }) {
        if (!ethers.isAddress(signer)) {
            throw new Error("invalid address");
        }
        const lido = await this.lido();
        const stEth = await this.stEth();
        const sEndToken = await this.sEndToken();
        const endToken = await this.endToken();
        const enderStakeEth = await this.enderStakeEth();
        const endTokenAddr = await endToken.getAddress();
        const sEndTokenAddr = await sEndToken.getAddress();
        const stEthAddr = await stEth.getAddress();
        const enderStakeEthAddr = await enderStakeEth.getAddress();
        const lidoAddr = await lido.getAddress();

        const endBonderFactory = await ethers.getContractFactory("EnderBond");
        const enderBond = (await upgrades.deployProxy(
            endBonderFactory,
            [endTokenAddr, enderStakeEthAddr, lidoAddr, signer],
            {
                initializer: "initialize",
            },
        )) as unknown as EnderBond;
        const enderBondAddress = await enderBond.getAddress();
        await enderStakeEth.grantRole(MINTER_ROLE, enderBondAddress);

        //set mockEnderBond address in endToken
        await endToken.setBond(await enderBond.getAddress());

        //deploy ender Staking contract
        const enderStakingFactory = await ethers.getContractFactory("EnderStaking");
        const enderStaking = await upgrades.deployProxy(
            enderStakingFactory,
            [endTokenAddr, sEndTokenAddr, stEthAddr, signer],
            {
                initializer: "initialize",
            },
        );
        const enderStakingAddress = await enderStaking.getAddress();

        //deploy ender Treasury contract
        const enderTreasuryFactory = await ethers.getContractFactory("EnderTreasury");

        //deploy insta app Lido Staking
        const instadappLiteFactory = await ethers.getContractFactory("StinstaToken");
        const instadappLitelidoStaking = await instadappLiteFactory.deploy(
            "InstaToken",
            "Inst",
            owner,
            stEthAddr,
        );
        const instadappLiteAddress = await instadappLitelidoStaking.getAddress();

        const enderTreasury = await upgrades.deployProxy(
            enderTreasuryFactory,
            [
                endTokenAddr,
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
        const enderTreasuryAddress = await enderTreasury.getAddress();
        await enderStakeEth.setTreasury(enderTreasuryAddress);

        //deploy bond NFT contract
        const bondNftFactory = await ethers.getContractFactory("BondNFT");
        const bondNFT = await upgrades.deployProxy(bondNftFactory, [enderBondAddress, baseURI], {
            initializer: "initialize",
        });
        await bondNFT.waitForDeployment();
        const bondNFTAddress = await bondNFT.getAddress();

        //set addresses, whitelists, grant roles
        await sEndToken.setAddress(enderStakingAddress, 1);

        await enderStaking.setAddress(enderBondAddress, 1);
        await enderStaking.setAddress(enderTreasuryAddress, 2);
        await enderStaking.setAddress(stEthAddr, 6);

        await enderBond.setBondableTokens([stEthAddr], true);
        await enderBond.setAddress(enderTreasuryAddress, 1);
        await enderBond.setAddress(bondNFTAddress, 3);
        await enderBond.setAddress(sEndTokenAddr, 9);

        await sEndToken.setStatus(2);
        await sEndToken.whitelist(enderBondAddress, true);

        await endToken.grantRole(MINTER_ROLE, owner);
        await endToken.setFee(20);

        await endToken.setExclude([enderBondAddress], true);
        await endToken.setExclude([enderTreasuryAddress], true);
        await endToken.setExclude([enderStakingAddress], true);

        await enderBond.setAddress(enderStakingAddress, 8);
        await enderBond.setAddress(stEthAddr, 6);

        await endToken.grantRole(MINTER_ROLE, enderStakingAddress);
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            enderBondAddress,
        );
        await endToken.grantRole(
            "0xe13c49f41ace7b3f26b0cf23ab168b4c48591998827e86cfa78a62930e4d6953",
            owner,
        );

        await enderBond.setBool(true);
        return { lido, stEth, endToken, enderBond };
    }
}
