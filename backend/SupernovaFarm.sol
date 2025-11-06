// SPDX-License-Identifier: MITSupernovaFarm

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "SupernovaToken.sol";

contract SupernovaFarm is Ownable(msg.sender), ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of supernova
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accSupernovaTokenPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accSupernovaTokenPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken; // Address of LP token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. supernova to distribute per block.
        uint256 lastRewardBlock; // Last block number that supernova distribution occurs.
        uint256 accSupernovaTokenPerShare; // Accumulated supernova per share, times 1e12. See below.
        uint16 depositFeeBP; // Deposit fee in basis points
    }

    // The supernova TOKEN!
    SupernovaToken public supernova;
    // Dev address.
    address public devaddr;
    // supernova tokens created per block.
    uint256 public supernovaPerBlock;
    // Bonus muliplier for early supernova makers.
    uint256 public constant BONUS_MULTIPLIER = 1;
    // Deposit Fee address
    address public feeAddress;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when supernova mining starts.
    uint256 public startBlock;

    // implementation for future updates and features.
    address public implementation;

    // Total withdraw of supernova rewards
    uint256 public totalSupernovaRewardsWithdraw = 0;

    // displaying unique wallet addresses count and last depositors on frontend
    address[] public depositAddresses;
    mapping(address => bool) depositAddressesMapping;
    uint public totalDeposits;
    // displaying unique wallet addresses count and last depositors on frontend

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    constructor(
        SupernovaToken _supernova,
        address _devaddr,
        address _feeAddress1,
        uint256 _supernovaPerBlock,
        uint256 _startBlock
    ) {
        supernova = _supernova;
        devaddr = _devaddr;
        feeAddress = _feeAddress1;
        supernovaPerBlock = _supernovaPerBlock;
        startBlock = _startBlock;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(
        uint256 _allocPoint,
        IERC20 _lpToken,
        uint16 _depositFeeBP,
        bool _withUpdate
    ) public onlyOwner {
        require(
            _depositFeeBP <= 10000,
            "add: invalid deposit fee basis points"
        );
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock
            ? block.number
            : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                accSupernovaTokenPerShare: 0,
                depositFeeBP: _depositFeeBP
            })
        );
    }

        function InitializePoolsBeforeAddingLiquidity() public onlyOwner{     
        add(1500, supernova, 0, false);

        // TBNB
        add(500, ERC20(0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd), 300, false);
        // CAKE
        add(500, ERC20(0x8d008B313C1d6C7fE2982F62d32Da7507cF43551), 300, false);
        // DAI
        add(500, ERC20(0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867), 300, false);
        // USDC
        add(500, ERC20(0x64544969ed7EBf5f083679233325356EbE738930), 300, false);

        // TBNB-CAKE
        add(500, ERC20(0xd08759B57BBd0158fEAC17457Ce5871B45e85bD9), 300, false);
    }

    function InitializePoolsAfterAddingLiquidity(ERC20[] calldata lpAddresses) public onlyOwner{
        for (uint i = 0; i < lpAddresses.length; i++) 
        {
            add(1500, lpAddresses[i], 0, false);
        }
    }

    // Update the given pool's supernova allocation point and deposit fee. Can only be called by the owner.
    function set(
        uint256 _pid,
        uint256 _allocPoint,
        uint16 _depositFeeBP,
        bool _withUpdate
    ) public onlyOwner {
        require(
            _depositFeeBP <= 10000,
            "set: invalid deposit fee basis points"
        );
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(
            _allocPoint
        );
        poolInfo[_pid].allocPoint = _allocPoint;
        poolInfo[_pid].depositFeeBP = _depositFeeBP;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(
        uint256 _from,
        uint256 _to
    ) public pure returns (uint256) {
        return _to.sub(_from).mul(BONUS_MULTIPLIER);
    }

    // View function to see pending supernova on frontend.
    function pendingSupernova(
        uint256 _pid,
        address _user
    ) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accSupernovaTokenPerShare = pool.accSupernovaTokenPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(
                pool.lastRewardBlock,
                block.number
            );
            uint256 supernovaReward = multiplier
                .mul(supernovaPerBlock)
                .mul(pool.allocPoint)
                .div(totalAllocPoint);
            accSupernovaTokenPerShare = accSupernovaTokenPerShare.add(
                supernovaReward.mul(1e12).div(lpSupply)
            );
        }
        return user.amount.mul(accSupernovaTokenPerShare).div(1e12).sub(user.rewardDebt);
    }

    // upgradeable contract pattern for implementing new features without compromising the contract's state/storage (pools data).
    // expected new feature:
    // any token owner can create a pool an issue rewards in his own token.
    // so users can create their own tokens and use the supernova.farm infrastructure to issue rewards in their
    // own native token
    // (currently in development)
    // see https://supernovafarm.gitbook.io/docs/roadmap
    function _delegate() private {
        (bool ok, ) = implementation.delegatecall(msg.data);
        require(ok, "delegatecall failed");
    }

    fallback() external payable {
        require(msg.sender == devaddr, "not authorized");
        _delegate();
    }

    receive() external payable {
        require(msg.sender == devaddr, "not authorized");
        _delegate();
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() private {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) private {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0 || pool.allocPoint == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 supernovaReward = multiplier
            .mul(supernovaPerBlock)
            .mul(pool.allocPoint)
            .div(totalAllocPoint);
        // MODIFICATION
        //supernova.mint(devaddr, supernovaReward.div(10));
        //supernova.mint(address(this), supernovaReward);
        // MODIFICATION
        pool.accSupernovaTokenPerShare = pool.accSupernovaTokenPerShare.add(
            supernovaReward.mul(1e12).div(lpSupply)
        );
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to MasterChef for supernova allocation.
    function deposit(uint256 _pid, uint256 _amount) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        if (user.amount > 0) {
            uint256 pending = user
                .amount
                .mul(pool.accSupernovaTokenPerShare)
                .div(1e12)
                .sub(user.rewardDebt);
            if (pending > 0) {
                // MODIFICATION
                supernova.mint(msg.sender, pending);
                totalSupernovaRewardsWithdraw = totalSupernovaRewardsWithdraw.add(pending);
                //safeSupernovaTokenTransfer(msg.sender, pending);
                // MODIFICATION
            }
        }
        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(
                address(msg.sender),
                address(this),
                _amount
            );

            AddAddressToDepositAddressesMappingAndArrayIfDoesntExist(msg.sender);
            totalDeposits++;

            if (pool.depositFeeBP > 0) {
                uint256 depositFee = _amount.mul(pool.depositFeeBP).div(10000);

                pool.lpToken.safeTransfer(feeAddress, depositFee);

                user.amount = user.amount.add(_amount).sub(depositFee);
            } else {
                user.amount = user.amount.add(_amount);
            }
        }
        user.rewardDebt = user.amount.mul(pool.accSupernovaTokenPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // defines up to which block the reward referral
    // referral system will be in operation
    uint public maxReferralBlockNumber;

    // defines in percentage the total fees 
    // that will be directed to those 
    // who make referrals for reward
    uint public feeToReferral = 0;

    function setMaxReferralBlockNumber(
        uint newBlockNumber
    ) public onlyOwner {
        maxReferralBlockNumber = newBlockNumber;
    }

    function setFeeToReferrral(
        uint newFeToReferral
    ) public onlyOwner {
        feeToReferral = newFeToReferral;
    }

    // Deposit LP tokens to MasterChef for supernova allocation.
    // with referral handling.
    function depositReferral(
        uint256 _pid,
        uint256 _amount,
        address referral
    ) public nonReentrant {
        require(msg.sender != referral, "Can't self refer!");

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        if (user.amount > 0) {
            uint256 pending = user
                .amount
                .mul(pool.accSupernovaTokenPerShare)
                .div(1e12)
                .sub(user.rewardDebt);
            if (pending > 0) {
                // MODIFICATION
                supernova.mint(msg.sender, pending);
                totalSupernovaRewardsWithdraw = totalSupernovaRewardsWithdraw.add(pending);
                //safeSupernovaTokenTransfer(msg.sender, pending);
                // MODIFICATION
            }
        }
        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(
                address(msg.sender),
                address(this),
                _amount
            );

            AddAddressToDepositAddressesMappingAndArrayIfDoesntExist(msg.sender);
            totalDeposits++;
            
            if (pool.depositFeeBP > 0) {
                uint256 depositFee = _amount.mul(pool.depositFeeBP).div(10000);
   
                // Checks whether the current block is still 
                // within the blocks where rewards must be
                // distributed to distribute the fee between 
                // feeAddress and referral from feeToReferral
                if (block.number < maxReferralBlockNumber) {         
                    uint256 feeOfFeeAddress = depositFee;

                    if(feeToReferral > 0) {
                       if(feeToReferral < 100) {
                           feeOfFeeAddress = depositFee.mul(100 - feeToReferral).div(100);
                       }
                       else {
                        feeOfFeeAddress = 0;
                       }
                   }

                    uint256 feeOfReferralAddress = depositFee.sub(feeOfFeeAddress);
                
                    pool.lpToken.safeTransfer(feeAddress, feeOfFeeAddress);
                    pool.lpToken.safeTransfer(referral, feeOfReferralAddress);
                }
                else {
                    pool.lpToken.safeTransfer(feeAddress, depositFee);
                }

                user.amount = user.amount.add(_amount).sub(depositFee);
            } else {
                user.amount = user.amount.add(_amount);
            }
        }
        user.rewardDebt = user.amount.mul(pool.accSupernovaTokenPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accSupernovaTokenPerShare).div(1e12).sub(
            user.rewardDebt
        );
        if (pending > 0) {
            // MODIFICATION
            supernova.mint(msg.sender, pending);
            totalSupernovaRewardsWithdraw = totalSupernovaRewardsWithdraw.add(pending);
            //safeSupernovaTokenTransfer(msg.sender, pending);
            // MODIFICATION
        }
        if (_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount.mul(pool.accSupernovaTokenPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        uint256 amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        pool.lpToken.safeTransfer(address(msg.sender), amount);
        emit EmergencyWithdraw(msg.sender, _pid, amount);
    }

    // Safe supernova transfer function, just in case if rounding error causes pool to not have enough supernova.
    function safeSupernovaTokenTransfer(address _to, uint256 _amount) internal {
        uint256 supernovaBal = supernova.balanceOf(address(this));
        if (_amount > supernovaBal) {
            supernova.transfer(_to, supernovaBal);
        } else {
            supernova.transfer(_to, _amount);
        }
    }

    function upgradeImplementation(address _implementation) external {
        require(
            msg.sender == devaddr,
            "not authorized, please contact the developer of this smart contract for updating the current implementation and adding new features."
        );

        implementation = _implementation;
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "dev: wut?");
        devaddr = _devaddr;
    }

    function setFeeAddress1(address _feeAddress1) public {
        require(msg.sender == feeAddress, "setFeeAddress1: FORBIDDEN");
        feeAddress = _feeAddress1;
    }

    function updateEmissionRate(uint256 _supernovaPerBlock) public onlyOwner {
        massUpdatePools();
        supernovaPerBlock = _supernovaPerBlock;
    }

        // displaying unique wallet addresses count on frontend and last depositors
    function AddNAddressesForTestingStability(int count) public onlyOwner {
        for (int i; i < count; i++) 
        {
           address addr = address(bytes20(keccak256(abi.encode(block.timestamp, i * i * i * i * i))));
           AddAddressToDepositAddressesMappingAndArrayIfDoesntExist(addr);
        }
    }

    function AddressExistsInDepositAddressesMapping(address addy) public view returns (bool){
        return depositAddressesMapping[addy] == true;
    }
    
    function AddAddressToDepositAddressesMappingAndArrayIfDoesntExist(address addy) private {
        if(depositAddressesMapping[addy] == false){
            depositAddressesMapping[addy] = true;
            depositAddresses.push(addy);
        }
    }

    // function GetDepositAddresses() public view returns (address[] memory){
    //     return depositAddresses;
    // }

    function GetDepositAddressesRange(uint startIndex, uint count) public view returns (address[] memory){
        address[] memory addys = new address[](count);
        
        uint currentIndex = startIndex;

        for (uint i = 0; i < count; i++) 
        {
            addys[i] = depositAddresses[currentIndex];
            currentIndex++;
        }

        return addys;
    }

    function GetDepositAddressesCount() public view returns (uint256){
        
        return depositAddresses.length;
    }
}
