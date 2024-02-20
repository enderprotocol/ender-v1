# Technical Documentation for EnderBond Contract

 ## Overview

The EnderBond contract is a Solidity smart contract designed to implement bonding functionality for multiple tokens on the Ethereum blockchain. The contract allows users to deposit their assets into a bond, which locks the funds for a specified period and provides potential rewards. 
### Contract Structure

The EnderBond contract is structured as follows:

- Initialization: The contract is initialized with parameters like the END token address, Lido contract address, and Oracle contract address. The owner of the contract can set other parameters like the minimum deposit amount, transaction fees, and bond yield base rate.

- Address Management: The contract includes functions to set and retrieve addresses related to various external contracts and services, such as the EnderTreasury, END token, BondNFT, EnderSignature, Lido, and more.

- Bondable Tokens: The contract maintains a mapping of bondable tokens, allowing the owner to specify which tokens can be used for bonding.

- Deposit: Users can deposit funds into a bond using the `deposit` function. They can specify the principal amount, maturity date (lock time), bond fee, and the token they want to deposit (including ETH). The contract checks for various conditions, such as the minimum deposit amount, bondable token status, and bond fee validity.

- Withdraw: Once a bond has matured, users can withdraw their funds by calling the `withdraw` function. This function performs checks to ensure that the bond has not already been withdrawn, the maturity date has passed, and the caller owns the bond.

- Reward Distribution: The contract handles reward distribution based on various factors. Users can collect rewards using the `calculateStakingReward` and `claimRefractionRewards` functions.

- Epoch Updates: The contract includes functions for updating reward shares and bond yield shares at the beginning of each epoch. These functions calculate and set the reward shares based on the amount of rewards and principles.

- Fees and Index Management: The contract deducts transaction fees from transfers and maintains various indexes for tracking reward shares and yield shares.

- Fallback Function: The contract includes a fallback function to accept ETH transfers.

### Key Concepts

- Bondable Tokens: Tokens that can be used for bonding are specified in the `bondableTokens` mapping.

- Bond Fee: Users can set a bond fee when depositing funds, which affects the rewards and yields.

- Maturity: The maturity date is the lock time for the bond. Funds can only be withdrawn after this date.

- Reward Shares: Users earn rewards based on the reward shares, which are updated at the beginning of each epoch.

- Yield Share: The bond yield share index represents the growth of rewards over time based on bond principles and yield rates.

- Staking Rewards: Users can earn rewards for staking their bonds using the `calculateStakingReward` function.

- Refraction Rewards: Users can earn rewards for bonding and holding assets using the `claimRefractionRewards` function.

### External Contracts and Interfaces

The EnderBond contract interacts with various external contracts and interfaces, including:

- EnderTreasury: The EnderTreasury contract is used to handle the deposit and withdrawal of funds, including the management of rewards.

- BondNFT: The BondNFT contract is used for minting and managing NFTs that represent bonds.


- Lido: The Lido contract is used to manage ETH deposits.

- EnderOracle: The EnderOracle contract provides price data for ETH and END tokens.




function initialize(address endToken_, address _lido, address _oracle) public initializer


   - Description: Initializes the contract with essential parameters.
   - Parameters:
     - `endToken_`: The address of the END token.
     - `_lido`: The address of the Lido contract.
     - `_oracle`: The address of the EnderOracle contract.

   function setAddress(address _addr, uint256 _type) public onlyOwner 

   - Description: Allows the contract owner to update various contract addresses.
   - Parameters:
     - `_addr`: The address to be updated.
     - `_type`: Type of address to update (1 for EnderTreasury, 2 for END token, 3 for BondNFT, 4 for EnderSignature, 5 for Lido, 6 for stEth).

   function setMinDepAmount(uint256 _amt) public onlyOwner

   - Description: Sets the minimum deposit amount required for users.
   - Parameters:
     - `_amt`: The new minimum deposit amount.

   function setTxFees(uint256 _txFees) public onlyOwner {

   - Description: Sets the transaction fees for bond deposits.
   - Parameters:
     - `_txFees`: The new transaction fees value.

 function setBondYieldBaseRate(uint256 _bondYieldBaseRate) public onlyOwner

   - Description: Sets the base rate for bond yield calculations.
   - Parameters:
     - `_bondYieldBaseRate`: The new bond yield base rate.

 function getAddress(uint256 _type) external view returns (address addr) {


   - Description: Retrieves an address based on its type.
   - Parameters:
     - `_type`: The type of address to retrieve.

function setBondFeeEnabled(bool _enabled) public onlyOwner

   - Description: Enables or disables the bond fee feature.
   - Parameters:
     - `_enabled`: A boolean indicating whether bond fees are enabled.

function setBondFeeEnabled(bool _enabled) public onlyOwner

   - Description: Sets the bondable status of a list of tokens.
   - Parameters:
     - `tokens`: An array of token addresses to update.
     - `enabled`: A boolean indicating whether the tokens should be bondable or not.


function getInterest(uint256 maturity) public view returns (uint256 rate)

Description: This function calculates the interest rate based on the provided maturity value. The interest rate is used in various calculations within the contract. It adjusts the base interest rate using a `maturityModifier` based on specific maturity conditions.

Parameters:
- `maturity` (uint256): The maturity date of a bond in days for which the interest rate is to be calculated.

function deposit(
       uint256 principal,
       uint256 maturity,
       uint256 bondFee,
       address token
   ) external payable nonReentrant returns (uint256 tokenId)

Description-
  The deposit function in your code is responsible for allowing users to deposit funds into the system. The function can accept either Ether (ETH) or a custom token (referred to as stEth). Here's a detailed description of what the function does:


### Input Parameters:

uint256 principal: The amount the user wants to deposit.
uint256 maturity: The maturity period in days, which must be between 7 and 365 days.
uint256 bondFee: The fee percentage associated with the bond deposit, ranging from 0 to 100.
address token: The address of the token being deposited (0x0 for ETH).

### Pre-Checks:

The function begins by checking if the provided principal is greater than or equal to a minimum deposit amount (minDepositAmount). If it's not, it reverts, indicating that the amount is invalid.
It checks whether the maturity is within the valid range of 7 to 365 days and reverts if not.
If a specific token is provided (token is not 0x0), it checks if the token is allowed for bonding (bondableTokens). If not, it reverts, indicating that the token is not bondable.
It validates that the bondFee is within the allowed range of 0 to 100. If it's not, the function reverts.

### Token Transfer:

If the deposit is in Ether (ETH), it checks if the msg.value (the amount of Ether sent with the transaction) matches the specified principal. If not, it reverts.
It then transfers the Ether to the contract's lido address and submits it.
If the deposit is in a token other than ETH, it transfers the specified principal from the user's address to the contract's endTreasury address.

### Deposit Handling:

The function calls a private _deposit function, passing the principal, maturity, token, and bondFee as arguments.
It mints a new non-fungible token (NFT) and assigns it to the user. This NFT represents the user's bond in the system.
It calculates and records various financial metrics and indexes for the bond, including rewards, shares, and principal amounts.

### Calculation and Indexing:

The function calculates and records the rewardSharePerUserIndex, rewardSharePerUserIndexSend, and userBondYieldShareIndex, which are used to track the user's claimed amounts and share in rewards.
It updates the total deposit and total reward principal values.

### Interest and Principal Calculation:

The function calculates the interest based on the maturity period.
It calculates the depositPrincipal, which is a portion of the deposit that contributes to the yield. This value is based on the interest, bond fee, and the provided principal.

### Storage and Record Keeping:

It stores various bond-related information, such as the bond's principal, creation timestamp, maturity period, associated token, bond fee, deposit principal, and reward principle.
Finally, the function emits a Deposit event to notify that a deposit has been made.





  function withdraw(uint256 tokenId) external nonReentrant

### Withdraw Function:

The withdraw function and its accompanying _withdraw private function allow users to withdraw their funds and rewards associated with a specific bond identified by its tokenId.



 - Parameters:
      - `tokenId`: The ID of the bond token to be withdrawn.

Withdraw(uint256 tokenId):

This public function enables external users to initiate the withdrawal process for a specific bond, identified by its tokenId.

_withdraw(uint256 _tokenId) [Private]:

This private function performs the actual withdrawal process for the given tokenId. It's used internally by the withdraw function.

### Withdrawal Process:

Here's what happens during the withdrawal process:

The function retrieves the bond information associated with the provided tokenId.

Several conditions are checked to ensure a valid withdrawal:

If the bond has already been withdrawn (bond.withdrawn), it reverts, indicating that the bond has already been withdrawn.
It verifies that the owner of the bond NFT (represented by the _tokenId) is the same as the caller of the function (msg.sender). If not, it reverts, indicating that the caller is not the bond owner.
It checks if the current timestamp is less than the bond's maturity date (bond.startTime + bond.maturity). If not, it reverts, indicating that the bond has not matured yet.

If all conditions are met, the function updates the bond's status by marking it as withdrawn (bond.withdrawn = true), indicating that the bond has been successfully withdrawn.

It initiates the withdrawal from the endTreasury contract, passing an EndRequest struct with relevant information, including the user's address, the bond's associated token, and the principal amount. Additionally, it triggers the getLoopCount function, which is used to calculate the amount required for that particular maturity.

The function calculates the reward the user will receive for the bond using the calculateBondRewardAmount function.

It updates the dayBondYieldShareIndex for the maturity date of the bond with the userBondYieldShareIndex associated with the bond. This index is implemented to prevent the user from withdrawing extra rewards after the withdrawal.

The function transfers the calculated reward to the user's address using the mintEndToUser function from the endTreasury contract.

It checks if the user needs to claim refraction rewards or staking rewards manually. If the rewardShareIndex does not match rewardSharePerUserIndex[_tokenId], the user need not to claim refraction rewards using the claimRefractionRewards function. Similarly, if rewardSharePerUserIndexSend[_tokenId] does not match rewardShareIndexSend, the user need not to claim staking rewards using the calculateStakingReward function.

The function updates various accounting variables, including subtracting the userBondPrincipalAmount associated with the bond from totalBondPrincipalAmount.

It sets the userBondPrincipalAmount for the _tokenId to zero and deletes the userBondYieldShareIndex associated with it.

It adjusts the amountRequired by subtracting the principal amount of the bond.



function getLoopCount() public returns (uint256 amountRequired)

    - Description: Used to calculate the required loop count for managing available funds.

   function deductFeesFromTransfer(uint256 _tokenId) public

    - Description: Deducts transaction fees from transfers for NFT transfer.

function epochRewardShareIndex(uint256 _reward) external


    - Description: Updates the reward share for a given end Token reward amount at the beginning of an epoch.
    - Parameters:
      - `_reward`: The reward to be added to the reward share.

 function epochRewardShareIndexForSend(uint256 _reward, uint256 _totalPrinciple) public


    - Description: Updates the reward share for Send token at the beginning of an epoch.
    - Parameters:
      - `_reward`: The reward to be added to the reward share.
      - `_totalPrinciple`: The total principle amount used for calculating the Send token reward share.

   function epochBondYieldShareIndex() external onlyOwner

    - Description: Calculates and updates the bond yield share index at the beginning of an epoch.

function calculateRefractionData(
       uint256 _principle,
       uint256 _maturity,
       uint256 _tokenId
   ) public view returns (uint256 avgRefractionIndex, uint256 rewardPrinciple)

  - Description: Calculates avgRefractionIndex and rewardPrincilple for a bond.
    - Parameters:
      - `_principle`: The principal amount of the bond.
      - `_maturity`: The maturity of the bond.
      - `_tokenId`: The unique identifier of the bond.





function calculateStakingPendingReward(
       uint _principle,
       uint256 _maturity,
       uint256 _tokenId
   ) public view returns (uint256 pendingRewardSend, uint256 avgRefractionIndex, uint256 rewardPrincipleSend)


    - Description: Calculates pending rewards for Send T0kens ,avgRefractionIndex  and rewardPrinciple for Send Token for a bond.
    - Parameters:
      - `_principle`: The principal amount of the bond.
      - `_maturity`: The maturity of the bond.
      - `_tokenId`: The unique identifier of the bond.

function calculateStakingReward(uint256 _tokenId) public {


    - Description: Allows users to claim staking rewards for a specific bond.
    - Parameters:
      - `_tokenId`: The unique identifier of the bond.

function claimRefractionRewards(uint256 _tokenId) public

    - Description: Allows users to claim refraction rewards for a specific bond.
    - Parameters:
      - `_tokenId`: The unique identifier of the bond.

function calculateBondRewardAmount(uint256 _tokenId) internal view returns (uint256 _reward)


    - Description: Calculates the reward amount for a given bond token.
    - Parameters:
      - `_tokenId`: The unique identifier of the bond.

   receive() external payable


    - Description: Fallback function to accept ETH transfers.




 ## EnderTreasury Smart Contract
 
The "EnderTreasury" smart contract is designed to manage various financial activities related to the Ender platform. It interacts with different strategies to handle deposits, withdrawals, and yields.

 ### State Variables

- strategies: A mapping that stores addresses of valid strategies.
- fundsInfo: A mapping to keep track of funds deposited in various staking assets.
- totalAssetStakedInStrategy: A mapping to store the total assets staked in different strategies.
- totalRewardsFromStrategy: A mapping to track total rewards obtained from different strategies.
- strategyToReceiptToken: A mapping to associate strategy contracts with receipt tokens.
- endToken: The address of the END token contract.
- enderBond: The address of the Ender bond contract.
- enderDepositor: The address of the Ender depositor contract (not set explicitly in the provided code).
- enderStaking: The address of the Ender staking contract.
- instadapp, lybraFinance, eigenLayer: Addresses of different strategies.
- enderOracle: An instance of the IEnderOracle contract.
- bondYieldBaseRate: A variable to store the base yield rate for Ender bonds.
- balanceLastEpoch: The balance of assets at the end of the last epoch.
- nominalYield: A variable representing the nominal yield.
- availableFundsPercentage: The percentage of available funds.
- reserveFundsPercentage: The percentage of reserve funds.
- epochDeposit: The sum of deposits during the current epoch.
- epochWithdrawal: The sum of withdrawals during the current epoch.

### Events

- AddressUpdated(address indexed newAddr, uint256 addrType): An event triggered when an address is updated.
- BondYieldBaseRateUpdated(uint256 bondYieldBaseRate): An event triggered when the bond yield base rate is updated.

 function initializeTreasury(
       address _endToken,
       address _enderStaking,
       address _bond,
       address _instadapp,
       address _lybraFinance,
       address _eigenLayer,
       uint256 _availableFundsPercentage,
       uint256 _reserveFundsPercentage,
       address _oracle
   ) external initializer


Description:
This function initializes the contract with key parameters, including addresses of various contracts, percentages, and the Ender Oracle.

Parameters:
- _endToken (address): Address of the END token contract.
- _enderStaking (address): Address of the Ender staking contract.
- _bond (address): Address of the Ender bond contract.
- _instadapp (address): Address of the Instadapp strategy contract.
- _lybraFinance (address): Address of the LybraFinance strategy contract.
- _eigenLayer (address): Address of the EigenLayer strategy contract.
- _availableFundsPercentage (uint256): Percentage of available funds.
- _reserveFundsPercentage (uint256): Percentage of reserve funds.
- _oracle (address): Address of the Ender Oracle contract.

   function setAddress(address _addr, uint256 _type) public onlyOwner {

 
Description:
This function allows the contract owner to set various contract addresses based on their types.

Parameters:
- addr (address): The new address to be set.
- type (uint256): The type of the address (used to identify the contract).

function setBondYieldBaseRate(uint256 _newBaseRate) public onlyOwner


Description:
This function enables the contract owner to set the base yield rate for Ender bonds.

Parameters:
- _newBaseRate (uint256): The new bond yield base rate to be set.

   function getAddress(uint256 _type) external view returns (address addr)


Description:
This function allows querying specific contract addresses based on their types.

Parameters:
- _type (uint256): The type of the address to query.

function setStrategy(address[] calldata _strs, bool _flag) external onlyOwner


Description:
This function allows the contract owner to set strategies as active or inactive.

Parameters:
- strs (address[]): An array of strategy addresses to be updated.
- flag (bool): A boolean flag indicating whether the strategies are active (true) or inactive (false).



   function setNominalYield(uint256 _nominalYield) public onlyOwner


Description:
This function allows the contract owner to set the nominal yield.

Parameters:
- _nominalYield (uint256): The new nominal yield to be set.


function getYieldMultiplier(uint256 bondFee) public pure returns (uint256 yieldMultiplier)


Description:
This function calculates a yield multiplier based on the provided bond fee.

Parameters:
- bondFee (uint256): The bond fee for which to calculate the yield multiplier.

function depositTreasury(EndRequest memory param, uint256 amountRequired) external onlyBond


Description:
This function allows authorized accounts to deposit assets into the treasury. It's typically used by the Ender bond contract.

Parameters:
- param (EndRequest): A struct that contains information about the deposit request, including the staking token and the token amount.
- amountRequired (uint256): The amount required to be deposited.



   function _transferFunds(address _account, address _token, uint256 _amount) private


Description:
This internal function is used to transfer funds (ETH or tokens) to a specified account or recipient.

Parameters:
- account (address): The recipient's address.
- token (address): The address of the token to transfer (address(0) for ETH).
- amount (uint256): The amount of tokens or ETH to transfer.



   function stakeRebasingReward(address _tokenAddress) public returns (uint256 rebaseReward)


Description:
This function calculates rebasing rewards for users who have staked assets.

Parameters:
- _tokenAddress (address): The address of the staked token for which to calculate rebasing rewards.


function depositInStrategy(address _asset, address _strategy, uint256 _depositAmt) public validStrategy(strategy)

Description:
This function allows authorized accounts to deposit assets into specific strategies.

Parameters:
- asset (address): The address of the underlying staked asset (e.g., stETH).
- strategy (address): The address of the strategy in which the deposit should be made.
- _depositAmt (uint256): The amount of the asset to be deposited in the strategy.

   function withdrawFromStrategy(
       address _asset,
       address _strategy,
       uint256 _withdrawAmt
   ) public validStrategy(_strategy) returns (uint256 _returnAmount)


Description:
This function allows authorized accounts to withdraw assets from specific strategies.

Parameters:
- _asset (address): The address of the underlying staked asset (e.g., stETH).
- _strategy (address): The address of the strategy from which the withdrawal should occur.
- _withdrawAmt (uint256): The amount of assets to be withdrawn from the strategy.

 function withdraw(EndRequest memory param, uint256 amountRequired) external onlyBond

Description:
This function allows authorized accounts to withdraw assets from the treasury. It's typically used by the Ender bond contract.

Parameters:
- param (EndRequest): A struct that contains information about the withdrawal request, including the staking token and the token amount.
- amountRequired (uint256): The amount required to be withdrawn.
  function collect(address account, uint256 amount) external onlyBond


Description:
This function allows authorized accounts to collect END tokens as bond rewards.

Parameters:
- account (address): The address to which the END tokens should be transferred.
- amount (uint256): The amount of END tokens to transfer.

   function mintEndToUser(address _to, uint256 _amount) external onlyBond


Description:
This function allows authorized accounts to mint END tokens and transfer them to a specified user.

Parameters:
- to (address): The recipient's address.
- amount (uint256): The amount of END tokens to mint and transfer.

  function calculateTotalReturn(address _stEthAddress) internal view returns (uint256 totalReturn)


Description:
This internal function calculates the total return for a given asset.

Parameters:
- _stEthAddress (address): The address of the asset (e.g., stETH token).

  function calculateDepositReturn(address _stEthAddress) public view returns (uint256 depositReturn)


Description:
This function calculates the deposit return based on the total return and available funds.

Parameters:
- _stEthAddress (address): The address of the asset (e.g., stETH token).



 receive() external payable virtual override {}

Description:
This is a fallback function that allows the contract to receive Ether. It's payable.






## Technical Documentation for EnderStaking Contract

### Contract Structure

The EnderStaking contract is structured as follows:

### Initialization

function initialize(address _end, address _sEnd) external initializer

  - Description: Initializes the contract with essential parameters, including the END token and sEnd token addresses.

### Ownership Control:

   function setAddress(address _addr, uint256 _type) public onlyOwner

  - Description: Allows the contract owner to set various contract addresses.
  - Parameters:
    - addr: The address to be updated.
    - _type: Type of address to update (e.g., enderBond, enderTreasury, endToken, sEndToken, keeper, stEth).

  function setBondRewardPercentage(uint256 percent) external onlyOwner
  - Description: Sets the bond reward percentage.
  - Parameters:
    - percent: The new bond reward percentage.

### Staking and Withdrawal

function stake(uint256 amount) external

  - Description: Allows users to stake END tokens and receive sEnd tokens as a result.
  - Parameters:
    - amount: The amount of END tokens to stake.

   function withdraw(uint256 amount) external

  - Description: Allows users to withdraw their staked END tokens along with rewards in sEnd tokens.
  - Parameters:
    - amount: The amount of END tokens to withdraw.






### Epoch Staking Reward

   function epochStakingReward(address _asset) public

  - Description: Calculates and distributes rewards to the bond contract and the EnderStaking contract.
  - Parameters:
    - _asset: The asset for which rewards are calculated.

### Token Conversion and Rebase
function calculateSEndTokens(uint256 _endAmount) public view returns (uint256 sEndTokens)

  - Description: Converts END tokens to sEnd tokens based on the rebasing index.
  - Parameters:
    - _endAmount: The amount of END tokens to convert.

function calculateRebaseIndex() internal {

  - Description: Calculates and updates the rebasing index based on the balance of END and sEnd tokens in the contract.

   function claimRebaseValue(uint256 _sendAMount) internal view returns (uint256 reward)

  - Description: Calculates the reward amount in END tokens based on the rebasing index.
  - Parameters:
    - _sendAmount: The amount of sEnd tokens to claim.




