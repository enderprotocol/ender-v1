import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Numeric } from "ethers";
import { ethers } from "hardhat";
import { EnderBond } from "../../typechain-types/contracts/EnderBond";

export function createFixtureWithParameter(param: any, actor: Function) {
    return async function fixture() {
        return actor(param);
    };
}

export async function signatureDigest(
    signature: HardhatEthersSigner,
    name: string,
    verifyContractAddress: string,
    user: HardhatEthersSigner,
) {
    let sig = await signature.signTypedData(
        {
            name: name, //"bondContract",
            version: "1",
            chainId: 31337,
            verifyingContract: verifyContractAddress,
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
            user: user.address,
            key: "0",
        },
    );
    return sig;
}

export function expandToDecimals(n: Number, index: Numeric) {
    return ethers.parseUnits(n.toString(), index);
}

export async function increaseTime(seconds: number) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine");
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function depositAndSetup(
    enderBond: EnderBond,
    tokenAddress: string,
    signer: HardhatEthersSigner,
    depositAmount: bigint,
    maturity: number,
    bondFee: number,
    signData: EnderBond.SignDataStruct,
) {
    await enderBond
        .connect(signer)
        .deposit(signer, depositAmount, maturity, bondFee, tokenAddress, signData);
    const filter = enderBond.filters.Deposit;
    const events = await enderBond.queryFilter(filter, -1);

    const event1 = events[0];

    const args1 = event1.args;
    const tokenId = args1.tokenId;

    return tokenId;
}
