import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export function createFixtureWithParameter(param: any, actor: Function) {
    return async function fixture() {
        return actor(param);
    };
}

export async function signatureDigest(
    signature: HardhatEthersSigner,
    verifyContractAddress: string,
    user: HardhatEthersSigner,
) {
    let sig = await signature.signTypedData(
        {
            name: "bondContract",
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
