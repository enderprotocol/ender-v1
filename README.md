# Ender Protocol: Liquid Staking Power Metaverse Protocol 

The Ender Protocol is poised to revolutionize the decentralized finance landscape by merging distinctive facets of the industry: NFT bond issuance, strategic treasury management, a novel liquid staking power mechanism, and an integrated lending/borrowing platform, all culminating into a seamless connection with a Metaverse ecosystem. 

At the heart of this ecosystem, the protocol's native token, ΞND, multitasks as a metaversal utility token while anchoring staking and governance processes. One of the standout innovations is the liquid staking power mechanism, which paves the way for the tokenization and open-market tradability of staking yields, bridging the gap between traditional staking methods and DeFi liquidity needs.

## Liquid Staking Power

The Ender Protocol revolutionizes the DeFi landscape by integrating liquid staking tokens, such as Lido's stETH, into its bond collateral framework. This not only provides bondholders with a segment of the staking yield but also redirects a fraction of the rewards to fortify the value of END tokens through a unique rebasing mechanism. As a result, the END token inherently embodies "staking power" value derived from the Liquid Staking yield of bonded assets. 

By doing so, the protocol pioneers a groundbreaking Liquid Staking Derivative, which empowers bond depositors to monetize their staking yield in the open market. The flexibility embedded in this system can potentially enable them to fetch a premium for their staking yield. Simultaneously, this mechanism infuses liquidity into the staking power, paving the way for a plethora of financial maneuvers like arbitrage opportunities, market making, and a myriad of other possibilities. This vision paints a horizon where the potential is endless, redefining the paradigms of decentralized finance.

## Bond Issuance

At the heart of the Ender Protocol is the issuance of bonds with deposits of Liquid Staking Tokens. Users deposit assets like ETH, stETH, LSDs, and potentially the protocol LP token, into the protocol as collateral. In return, they receive bonds minted as NFTs. These bonds come with a predetermined maturity date and accrue yield over time, paid in END tokens. Once matured, users can redeem the deposited underlying assets. 
Bond depositors do not face any risk to their principal capital from the value of the protocol token. The protocol aims to incentivize depositors to choose longer maturity dates and continually make deposits. To encourage this, several mechanisms are designed to provide benefits for continued commitment and ongoing contributions to the protocol. 

Adding further flexibility and sustainability to the Ender Protocol is the feature allowing for rebonding or extending a bond upon its maturity. This function presents an alternative to the normal redemption process; depositors may choose to re-bond their matured bond rather than withdrawing the underlying assets from the treasury. 
This option essentially takes the same deposit from the matured bond to issue a new bond. While this operation does not merely extend the existing bond, it creates a new bond with the same deposit, streamlining the process for users while ensuring the continued retention of assets within the treasury. 

In this way, the matured bond is redeemed, but the assets are not withdrawn. A new bond is then issued to replace the matured one and delivered to the user. It's important to note that these matured bonds will have additional utility, which will be elaborated on later. This user-friendly feature both incentivizes ongoing commitment to the protocol and promotes the protocol's asset sustainability. 

Furthermore, to augment the protocol's self-sustainability, an optional, user-defined bond mint fee feature will be incorporated. This system allows users to voluntarily set a mint fee when issuing a bond, in turn, offering them a proportionate boost in their END token yield. For every 1% bond mint fee set, the user receives a 1% increase in yield. This means that setting a bond mint fee of 100% will effectively double the yield, granting 2x the rewards. 

This self-set mint fee system serves as a perpetual funding mechanism for the protocol. One way to consider this is the direct minting of END tokens for the underlying deposit into the treasury, backing the tokens minted, but over the maturity period of the bond.

## Treasury Management

The Ender Protocol features a treasury responsible for accumulating and managing the assets deposited by users through bond issuance. This treasury oversees the staking yield adjustment which rewards END token stakers with additional END tokens. Employing various strategies, the treasury aims to gradually accumulate permanent assets in addition to the fluctuating inflows and outflows from bonds as more bonds are issued and reach maturity. The assets gathered through bonds will be deployed to generate yield wherever possible, with the ultimate goal of amassing assets in the treasury through continuous protocol utilization. To facilitate the funding and development of the Ender Protocol, the treasury includes a mint function for END tokens. 

This rolling mint is capped to a limit of 15% of the circulating supply per year, with the first year having a vesting period of 3-months for 1⁄3 of the mint percentage, another 1⁄3 at 6-months, and the final 1⁄3 at the end of the year, with the option to wait until the full year before minting, and an additional 1% cliff each year in perpetuity. The capped limit decreases by 1% each year for fifteen years down to zero, with the 1% in perpetuity remaining

Due to the limit being based on the current circulating supply, minting tokens later rather than sooner will result in a larger mintable amount, as the circulating supply increases over time. This structure encourages a strategic approach to token minting on a year-to-year basis, optimizing the growth and development of the Ender Protocol.

## Refraction Tax Mechanism

The Ender Protocol introduces an innovative mechanic known as the "refraction" tax, imposed on all END token transfers within the system. Similar to a reflection tax, it is called a refraction because tokens are refracted to bondholders instead of token holders. This creates a passive income stream for bondholders and encourages users to hold or purchase bonds. The refraction tax mechanism fuels bond issuance and increased asset deposits, initiating the flywheel effect. Simultaneously, it discourages END token holders from excessively trading tokens and promotes staking. By targeting only unmatured bonds for redistribution, the protocol further incentivizes users to maintain their bond positions until maturity. 

Additionally, the protocol features a "refraction index" that adjusts the tax distribution to bondholders based on the length and maturity of each individual bond. Based on the refraction index, bonds with longer durations and greater maturities receive a larger proportion of the refraction tax, with the tax proportion increasing as the bond matures. This innovative approach increases the appeal of holding bonds with longer terms and higher maturities, further incentivizing users to participate in the bond ecosystem and contribute to the overall growth and stability of the Ender Protocol.

## Rebase Token (END)

The Ender Protocol employs a rebasing token, END, which undergoes periodic rebases to adjust the token supply based on the protocol's treasury yield. END token holders can stake their tokens to earn rewards from the treasury yield through the rebasing of the tokens. 

The rebase mechanism can be dynamically adjusted to optimally incentivize staking and maintain a balance between inflation and sustainable yields generated by the treasury. The way the rebase rate is determined is by taking the difference between the bond deposit yield of the Liquid Staking Tokens and the Bond Yield which is set at a lower rate, leaving the difference to be captured through the staking process of the END token, through the rebasing. 

The protocol's primary objective is to ensure balanced growth to prevent runaway inflation or hyperinflation of the token supply. Due to the fact that the protocol has a deposit base of Liquid Staking Tokens generating yield, by setting the bond yield lower than the deposit yield, we can freely adjust the staking rebasing rate based on the treasury asset accumulation, such that the tokens are backed by the deposit yields to a close proximity of one to one, even over-backing the tokens, which would drive up the price. By achieving this balance, the token value can experience a steady increase in value, attracting more buyers and stakers while maintaining an appealing and sustainable yield through staking, supported by the treasury's yield-generating activities. 

To prevent gaming of the rebasing mechanism, the rebase trigger is determined through a combination of random factors and an algorithmic approach, ensuring a fair and unpredictable rebase occurrence.

## NFT-based Bond Trading

Bonds are issued as NFTs and can be freely traded on the open market. The NFT collection of the bonds incorporates a creator royalty fee for all bond trading, with the fees distributed equally between the treasury and current bond holders. This mechanism reinforces the flywheel effect by promoting bond issuance and encouraging bondholders to retain their bonds. At the same time, it generates an income stream for the treasury and END token stakers, creating a counterbalance to the refraction tax imposed on the END token transfers. 

The NFT bonds will be listed on prominent NFT marketplaces, such as OpenSea and Blur, which offer incentives for traders to engage in collection trading and provide liquidity. This exposure stimulates trading activity and enhances the appeal of bond issuance, ultimately increasing the treasury and END token valuation.

## Bond Liquidity Pool

In addition to the inherent liquidity from NFT marketplaces, users can deposit ETH into a bond liquidity pool that serves as a market maker by placing floor bids for each individual bond NFT in the collection. The bids are made separately for each NFT bond due to their prices being based on the varying underlying asset values. The system calculates the underlying asset value of each bond and places a bid below it at a discount, ensuring a profit upon bond maturity. This mechanism guarantees liquidity for bond sellers and profits for the market maker, with the liquidity backstop acting as the buyer of last resort. 

Depositors receive END tokens as an incentive for their contribution. As purchased bonds mature, the treasury retains all the profits. Any airdrops or token incentives provided by these platforms as the protocol bids on the collection are also kept by the treasury. 

The pool features a utilization rate, which prevents ETH depositors from withdrawing their funds if there is insufficient ETH in the pool due to outstanding bonds waiting to mature. In such cases, depositors must wait until the bonds mature and the pool's ETH balance is replenished. To attract more depositors when the pool's utilization is high, the system increases the END token rewards for depositing, up to a capped maximum determined by the potential profit from unmatured bonds. 

Depending on the liquidity available for the bonds listed on the marketplace, the token incentive for depositing into the pool will be adjusted accordingly. If there is sufficient liquidity available for the bond sellers, the token incentive will be decreased to minimize the inflation rate.

## Lending/Borrowing Platform

A lending/borrowing platform allows users to collateralize their bond NFTs to receive loans, where lenders can supply stablecoins for the bonds collateralized to borrow from. Lenders receive yield from the bonds, which is drawn directly from the underlying assets of the bonds. When NFT bonds are deposited, the underlying assets can be extracted and used to pay interest on the loan obligations directly to the lenders. 

In the event of a borrower's liquidation, the deployer contract will be able to extract the underlying value of the bonds to repay the lender. This is the only circumstance in which the underlying assets may be retrieved before the bond maturity. The liquidation process will be subject to a liquidation fee, which is paid to both the lender and the treasury. This mechanism ensures that the lender's interests are protected while also contributing to the treasury's income. 

The proposed architecture for our Lending & Borrowing system aligns with the model employed by Blur's Blend platform: Perpetual Lending With NFT Collateral. This model facilitates P2P lending on a perpetual basis and features liquidation through Dutch Auctions without the need for oracles. It integrates seamlessly with our proposed Bond Liquidity Pool (BLP), where the ETH deposited can also serve as lending capital for borrowers who provide NFTs as collateral on our lending platform. 

However, we recognize the need for further research and analysis before fully committing to this model. Its significant advantage lies in supporting the floating floor price of NFTs, which are typically speculative and subjective in nature. This characteristic presents a challenge for many NFT lending protocols like BendDAO, a Pooled Lending Protocol akin to Aave, modified to support NFTs with hard-to-determine floor prices. 

Yet, our NFTs differ in that their floor price can be determined readily by the underlying assets deposited into the bonds, rendering the price of these NFTs explicit as they are backed by their fungible token counterparts. This clarity, however, does not preclude the potential speculative value attached to these bond NFTs due to their maturity value utility. Therefore, there is a chance for a price that exceeds the underlying floor price backed by these NFTs. 

To accommodate such a scenario, we must innovate a hybrid approach that effectively evaluates the price of these NFTs, potentially higher than the asset-value backed price. Consequently, a system akin to Blend, capable of pricing these exotic assets, would be required. We propose a potential fusion of Pool Lending Protocol and Blend's Peer-to-Peer approach. This model would utilize Dutch Auction to price the potentially higher-than-underlying-value floor price, while also considering the principal floor price. 

It is important to note that the development of this model necessitates further research. Therefore, the evolution of this approach is ongoing and subject to change as we strive for an optimal implementation.

## Metaverse Ecosystem Integration

A unique aspect of the Ender Protocol is its integration with a Metaverse ecosystem, allowing bond NFTs to maintain utility even after maturity. Users can retain these NFTs and later use them to mint Metaverse NFTs, such as land deeds, or rather, world portals. 

To implement this feature, a new smart contract for the Metaverse NFT ecosystem will be developed. This contract will accept matured bond NFTs and mint corresponding Metaverse Realm Portal NFTs based on the bond's original maturity duration and the value of the deposited assets. 

The rarity of the minted Realm Portal NFTs will depend on the bond's maturity duration, with longer maturities yielding rarer NFTs. The size and value of the world within the portal will be determined by the initial value of assets deposited in the bond. 

These Metaverse realm portals will be part of an immersive ENDgame ecosystem where players can explore vast worlds and planets, mine resources, and encounter creatures. The Metaverse will draw similarities from Minecraft but be built on the blockchain. 

The END token will serve a dual purpose, functioning in both the Ender Protocol's financial mechanisms and as a utility token within the Metaverse called The ENDgame. This added utility enhances the token's value for holders, as they can use END tokens to access various in-game features, purchase virtual goods and services, and engage in the interactive ENDgame ecosystem. 

A significant aspect to note is the minting of Ender Portals using matured bond NFTs, which will also necessitate a mint fee, payable in END tokens as opposed to the standard ETH. This fee will be proportional to the size and tier or rarity of the bond NFT, which is determined by the initial deposit amount and maturity time. 
This minting process essentially functions as a buyback or rather, clawback mechanism, channeling more END tokens back into the protocol's treasury. This counterbalances the selling pressure of token issuance stemming from the bond NFTs, contributing to the sustainability of the protocol. 

## Improvement & development

The Ender Protocol team is dedicated to the continuous improvement and development of the platform. Some potential future developments and enhancements to the protocol include:
  1. Integration with additional blockchain networks and assets: Expanding the range of assets that can be deposited and used as collateral within the Ender Protocol ecosystem.
  2. Optimizing the refraction tax mechanism: Fine-tuning the refraction tax rate to maximize its effectiveness in incentivizing bondholders and promoting the long-term health of the protocol.
  3. Enhancements to the rebase token mechanics: Investigating and implementing potential improvements to the rebasing mechanism to ensure its long-term stability and value generation for token holders.
  4. Improved liquidity and trading infrastructure for NFT-based bond trading: Developing and integrating advanced trading tools and interfaces to facilitate seamless and efficient trading of bond NFTs within the Ender Protocol ecosystem.
  5. Expansion of the lending/borrowing platform: Exploring and integrating additional lending and borrowing products and services to provide users with a wider range of financial instruments and opportunities.
  6. Governance and community involvement: Implementing a decentralized governance system that allows END token holders to participate in the decision-making process and have a direct impact on the future development of the Ender Protocol.
  7. Security and reliability: Continuously working on enhancing the security and reliability of the Ender Protocol through rigorous testing, audits, and updates to ensure the safety of user funds and the overall stability of the platform.

## 📜 Contract Addresses

 - For [Goerli Testnet](./docs/deployments/rinkeby.md).
 - For [Ethereum Mainnet] - Coming soon

## 🔗 Links

- [Deck](https://linktr.ee/metagaming.io)
- [Treasury Model](https://ayf5.short.gy/treasurymodel)
- [Ender Protocol](https://www.enderprotocol.io/)
- [Endworld RPG Game](https://www.endworld.io/)
- [Twitter](https://twitter.com/EnderProtocol?s=20)
- [Discord](http://discord.gg/PHRmsaaVNr)

