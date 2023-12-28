// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract enderPreLounchDeposit is 
    Initializable, 
    OwnableUpgradeable, 
    ReentrancyGuardUpgradeable {
    address public stEth;
    address public lido;
    address public admin;
    uint256 public index;
    uint256 public minDepositAmount;
    uint256 public rewardShareIndex;
    uint256 public totalStaked;
    bool public depositEnable;
    // @notice A mapping that indicates whether a token is bondable.
    mapping(address => bool) public bondableTokens;
    mapping(uint256 => uint256) public rewardSharePerUserIndexStEth;
    mapping(uint256 => uint256) public totalRewardOfUser;
    mapping(address => bool) public isWhitelisted;
    mapping(uint256 => Bond) public bonds;
    struct Bond {
        address user;
        uint256 principalAmount;
        uint256 totalAmount;
        uint256 bondFees;
        uint256 maturity;
    }
    error InvalidAmount();
    error InvalidMaturity();
    error InvalidBondFee();
    error ZeroAddress();
    error NotAllowed();
    error NotBondableToken();
    error addressNotWhitelisted();
    event depositEnableSet(bool depositEnable);
    event MinDepAmountSet(uint256 indexed newAmount);
    event BondableTokensSet(address indexed token, bool indexed isEnabled);
    event WhitelistChanged(address indexed whitelistingAddress, bool indexed action);
    event Deposit(address indexed sender, uint256 index, uint256 bondFees, uint256 principal, uint256 maturity, address token);
    event userInfo(address indexed user, uint256 index, uint256 principal, uint256 Reward, uint256 totalAmount, uint256 bondFees, uint256 maturity);

    function initialize(address _stEth, address _lido) public initializer {
        __Ownable_init();
        stEth = _stEth;
        lido = _lido;
        bondableTokens[_stEth] = true;
        minDepositAmount = 100000000000000000; 
    }

    modifier depositEnabled() {
        if (depositEnable != true) revert NotAllowed();
        _;
    }

    /**
     * @notice Updates the bondable status for a list of tokens.
     * @dev Sets the bondable status of a list of tokens. Only callable by the contract owner.
     * @param tokens The addresses of the tokens to be updated.
     * @param enabled Boolean value representing whether each token is bondable.
     */
    function setBondableTokens(address[] calldata tokens, bool enabled) external onlyOwner {
        uint256 length = tokens.length;
        for (uint256 i; i < length; ++i) {
            bondableTokens[tokens[i]] = enabled;
        emit BondableTokensSet(tokens[i], enabled);
        }
    }

    function setMinDepAmount(uint256 _amt) public onlyOwner {
        minDepositAmount = _amt;
        emit MinDepAmountSet(_amt);
    }

    function setDepositEnable(bool _depositEnable) public onlyOwner{
        depositEnable = _depositEnable;
        emit depositEnableSet(depositEnable);
    }

    function setAddress(address _addr, uint256 _type) public onlyOwner {
        if (_addr == address(0)) revert ZeroAddress();

        if (_type == 1) stEth = _addr;
        else if (_type == 2) lido = _addr;
    }

    function deposit(
        uint256 principal,
        uint256 maturity,
        uint256 bondFee,
        address token
    ) external payable nonReentrant depositEnabled {
        if (principal < minDepositAmount) revert InvalidAmount();
        if (maturity < 7 || maturity > 365) revert InvalidMaturity();
        if (token != address(0) && !bondableTokens[token]) revert NotBondableToken();
        if (bondFee <= 0 || bondFee >= 10000) revert InvalidBondFee();   
        if (!isWhitelisted[msg.sender]) revert addressNotWhitelisted();     

        // token transfer
        if (token == address(0)) {
            if (msg.value != principal) revert InvalidAmount();        
            (bool suc, ) = payable(lido).call{value: msg.value}(abi.encodeWithSignature("submit()"));     
            require(suc, "lido eth deposit failed");                                    
            IERC20(stEth).transfer(address(this), principal);       
        } else {           
            // send directly to the deposit contract            
            IERC20(token).transferFrom(msg.sender, address(this), principal);                          
        }        
        totalStaked += principal;       
        uint256 reward = IERC20(stEth).balanceOf(address(this)) - totalStaked;     
        if (reward > 0){
            calculatingSForReward();
            totalStaked += reward;
        }
        index ++;
        rewardSharePerUserIndexStEth[index] = rewardShareIndex;
        // if(bonds[msg.sender].principalAmount > 0){
        //     calculatingPendingReward(msg.sender);
        // }

        bonds[index] = Bond(
            msg.sender,
            principal,
            principal,
            bondFee,
            maturity
        );
        // IEnderStaking(endStaking).epochStakingReward(stEth);
        emit Deposit(msg.sender, index, bondFee, principal, maturity, token);
    }
    
    function calculatingSForReward() internal {
        uint256 reward = IERC20(stEth).balanceOf(address(this)) - totalStaked;
        if (reward > 0){
            rewardShareIndex = rewardShareIndex + (reward/totalStaked);
        }
    }

    // function calculatingPendingReward(address user) internal {
    //     pendingReward[user] = bonds[user].principalAmount * (rewardShareIndex - rewardSharePerUserIndexStEth[user]);
    // }
    function claimRebaseReward(uint256 index, address _bond) external onlyOwner returns(address user, uint256 principal, uint256 bonfees, uint256 maturity){
        totalRewardOfUser[index] =   (bonds[index].principalAmount * (rewardShareIndex - rewardSharePerUserIndexStEth[index]));
        bonds[index].totalAmount = bonds[index].principalAmount + totalRewardOfUser[index];
        IERC20(stEth).transfer(_bond, bonds[index].totalAmount);
        emit userInfo(user, index, bonds[index].principalAmount, totalRewardOfUser[index], bonds[index].totalAmount, bonds[index].bondFees, bonds[index].maturity);
        return (bonds[index].user, bonds[index].totalAmount, bonds[index].bondFees, bonds[index].maturity);
    }

    function whitelist(address _whitelistingAddress, bool _action) external onlyOwner{
        isWhitelisted[_whitelistingAddress] = _action;
        emit WhitelistChanged(_whitelistingAddress, _action);
    }
}
