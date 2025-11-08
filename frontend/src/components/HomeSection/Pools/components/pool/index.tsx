/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-empty */
/* eslint-disable react/prop-types */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
import { wagmiAdapter } from "@/components/Web3Provider";
import { AppContext } from "@/context/appContext";
import { useAppKitNetwork } from "@reown/appkit/react";
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { BigNumber, ethers, utils } from 'ethers';
import numeral from 'numeral';
import { useContext, useEffect, useMemo, useState } from "react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from "react-toastify";
import { Tooltip } from 'react-tooltip';
import { Address } from "viem";
import { useAccount } from "wagmi";
import Web3 from "web3";
import { ActionButtonSeparator, ActionButtonWalletContainer, ActionContainer, FeeContainer, FeeValueContainer, HeaderContainer, HeaderDetailsContainer, ImageToken, PoolContainer, PoolSectionContainer, PoolSectionValueContainer, PoolSectionValueDescriptionContainer, Separator, TokenContainer, WalletContainer, WalletTitleContainer, WalletValueContainer, WalletValueDescriptionContainer, cardStyle } from "./styles";
import useSound from 'use-sound';
import { getMasterchefABIByChainId } from "../../../../../utils/masterChefABIProvider";
import { getMastChefAddressByChainId } from "@/utils/masterchefAddressProvider";
import { openInNewTab } from "@/utils/functions";
import { getTokenContractABIByChainId } from "@/utils/tokenContractABIProvider";
import { getRpcProviderByChainId } from "@/utils/rpcProviderUtils";
import ModalDeposit from "@/components/ModalDeposit";
import { fetchImageByAddress } from "@/utils/fetchTokenImage";
const transactionSound = '/sounds/transaction.mp3';

enum StatusTransaction {
  APPROVE = 0,
  APPROVE_DEPOSIT = 1,
  APPOVING_DEPOSIT = 2,
  DEPOSIT = 3,
  DEPOSITING = 4,
  APPROVE_WITHDRAW = 5,
  WITHDRAWING = 6,
}

const FarmPoolCard = (props: { pool: any; }) => {
  const { address, isConnected } = useAccount()
  const { chainId } = useAppKitNetwork();

  const [isLoading, setIsLoading] = useState(true);
  const [totalTokensDeposited, setTotalTokensDeposited] = useState<BigNumber>(BigNumber.from(0));
  const [rewards, setRewards] = useState(0);
  const [balanceWallet, setBalanceWallet] = useState<BigNumber>(BigNumber.from(0));
  const [depositWithdrawValueWei, setDepositWithdrawValueWei] = useState<BigNumber>(BigNumber.from(0));
  const [depositWithdrawValue, setDepositWithdrawValue] = useState<Number>(0);
  const [isDeposit, setIsDeposit] = useState(false);
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [totalTokensDepositedBalance, setTotalTokensDepositedBalance] = useState<BigNumber>(BigNumber.from(0));
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);
  const [statusTranscation, setStatusTranscation] = useState<StatusTransaction | null>(null);

  const { pool } = props;
  const totalSupply = Number(pool.farmBalance) / 10 ** 18;
  const { token, fee, multiplier, poolAddress, poolMasterchef } = pool;
  const { farmTokenUSDCPrice } = useContext(AppContext);

  const [play] = useSound(transactionSound);

  const transactionStatusText = useMemo(() => {
    switch (statusTranscation) {
      case StatusTransaction.APPROVE:
        return 'APPROVE';
      case StatusTransaction.APPROVE_DEPOSIT:
        return 'APPROVE DEPOSIT';
      case StatusTransaction.APPOVING_DEPOSIT:
        return 'PROCESSING APPROVE DEPOSIT...';
      case StatusTransaction.DEPOSIT:
        return 'WAITING DEPOSIT...';
      case StatusTransaction.DEPOSITING:
        return 'DEPOSITING...';
      case StatusTransaction.APPROVE_WITHDRAW:
        return 'APPROVE WITHDRAW';
      case StatusTransaction.WITHDRAWING:
        return 'PROCESSING WITHDRAW...';
      default:
        return '';
    }
  }, [statusTranscation]);

  const handleRewards = async (): Promise<void> => {
    try {
      if (rewards === 0) {
        toast("You don't have rewards to withdraw.", {
          type: 'warning',
          position: 'top-center',
          style: {
            fontSize: 16,
            fontFamily: 'Trebuchet MS, sans-serif',
          }
        });
        return
      }

      const amountToDeposit = 0;

      setIsLoadingDeposit(true);

      toast("We are processing your reward claim.", {
        type: 'success',
        position: 'top-center',
        style: {
          fontSize: 16,
          fontFamily: 'Trebuchet MS, sans-serif',
        }
      });

      const hash = await writeContract(wagmiAdapter.wagmiConfig, {
        abi: getMasterchefABIByChainId(chainId),
        address: getMastChefAddressByChainId(chainId) as Address,
        functionName: 'deposit',
        args: [poolMasterchef, amountToDeposit],
        account: address,
      })

      const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash })

      if (receipt.status === 'success') {
        setBalanceWallet(BigNumber.from(0));
        fetchLpWallet();
        fetchPoolDataByWalletConnect();
        play();
      } else {
        toast.dismiss();
        toast('Transaction has been cancelled.', {
          position: 'top-center',
          type: 'warning'
        })
      }
      setDepositWithdrawValueWei(BigNumber.from(0));
    }
    catch (err) {
      toast.dismiss();
      toast('Transaction has been cancelled.', {
        position: 'top-center',
        type: 'warning'
      })
    }
    finally {
      setIsLoadingDeposit(false);
    }
  }

  const handleWithdraw = async (): Promise<void> => {
    try {
      if (depositWithdrawValueWei.lte(BigNumber.from(0))) {
        toast("Enter the amount of tokens you want to deposit.", {
          type: 'warning',
          position: 'top-center',
          style: { fontSize: 16, fontFamily: 'Trebuchet MS, sans-serif' },
        });
        return;
      }
      else if (depositWithdrawValueWei.gt(totalTokensDeposited)) {
        toast("You don't have the amount of tokens you want to withdraw in this pool.", {
          type: 'warning',
          position: 'top-center',
          style: { fontSize: 16, fontFamily: 'Trebuchet MS, sans-serif' }
        });
        return;
      }

      setIsLoadingDeposit(true);
      setStatusTranscation(StatusTransaction.WITHDRAWING);

      const hash = await writeContract(wagmiAdapter.wagmiConfig, {
        abi: getMasterchefABIByChainId(chainId),
        address: getMastChefAddressByChainId(chainId) as Address,
        functionName: 'withdraw',
        args: [poolMasterchef, depositWithdrawValueWei],
        account: address,
      })


      const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash })

      if (receipt.status === 'success') {
        fetchLpWallet();
        fetchPoolDataByWalletConnect();
        play();

        toast("Withdrawal completed successfully!", {
          type: 'success',
          position: 'top-center',
          style: {
            fontSize: 16,
            fontFamily: 'Trebuchet MS, sans-serif',
          }
        });
      } else {
        toast('Transaction has been cancelled.', {
          position: 'top-center',
          type: 'warning'
        })
      }

      setIsWithdraw(false);
      setDepositWithdrawValueWei(BigNumber.from(0));
    }
    catch (err) {
      toast('Transaction has been cancelled.', {
        position: 'top-center',
        type: 'warning'
      })
      setIsWithdraw(false);
    }
    finally {
      setIsLoadingDeposit(false);
    }
  }

  const isValidAddress = (adr: string): boolean => {
    try {
      const web3 = new Web3()
      web3.utils.toChecksumAddress(adr)
      return true
    } catch (e) {
      return false
    }
  }

  const base64Decode = (str: string): string => {
    return decodeURIComponent(escape(atob(str)));
  }

  /**
   * Make a deposit into the pool based on the chain it’s on.
   * @returns void
   */
  const handleDeposit = async (): Promise<void> => {
    try {
      if (depositWithdrawValueWei.lte(BigNumber.from(0))) {
        toast("Enter the amount of tokens you want to deposit.", {
          type: 'warning',
          position: 'top-center',
          style: { fontSize: 16, fontFamily: 'Trebuchet MS, sans-serif' },
        });
        return;
      }

      else if (balanceWallet.lte(BigNumber.from(0)) || depositWithdrawValueWei.gt(balanceWallet)) {
        toast(
          "You do not have enough tokens in your portfolio to deposit.",
          {
            type: 'warning',
            position: 'top-center',
            style: { fontSize: 16, fontFamily: 'Trebuchet MS, sans-serif' },
          }
        );
        return;
      }

      setIsLoadingDeposit(true);
      setStatusTranscation(StatusTransaction.APPOVING_DEPOSIT);

      await writeContract(
        wagmiAdapter.wagmiConfig,
        {
          abi: getTokenContractABIByChainId(chainId),
          address: poolAddress,
          functionName: 'approve',
          args: [getMastChefAddressByChainId(chainId), depositWithdrawValueWei],
          account: address,
        }
      );

      const urlParams = new URLSearchParams(location.search);
      const addressValue = urlParams.get('refer');
      let hasReferral = false;
      let referralAddress = '';

      if (addressValue) {
        const decoded = base64Decode(addressValue);
        if (isValidAddress(decoded)) {
          hasReferral = true;
          referralAddress = decoded;
        }
      }

      setStatusTranscation(StatusTransaction.DEPOSIT);

      const hash = await writeContract(wagmiAdapter.wagmiConfig, {
        abi: getMasterchefABIByChainId(chainId),
        address: getMastChefAddressByChainId(chainId) as Address,
        functionName: hasReferral ? 'depositReferral' : 'deposit',
        args: hasReferral
          ? [poolMasterchef, depositWithdrawValueWei, referralAddress]
          : [poolMasterchef, depositWithdrawValueWei],
        account: address,
      })

      const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash })

      if (receipt.status === 'success') {
        fetchLpWallet();
        fetchPoolDataByWalletConnect();

        play();

        toast("Deposit completed successfully!", {
          type: 'success',
          position: 'top-center',
          style: { fontSize: 16, fontFamily: 'Trebuchet MS, sans-serif' },
        });
      }
      else {
        toast('Transaction has been cancelled.', {
          position: 'top-center',
          type: 'warning'
        });
      }

      setIsDeposit(false);
      setDepositWithdrawValueWei(BigNumber.from(0));
      setDepositWithdrawValue(0);
    } catch (err) {
      toast('Transaction has been cancelled.', {
        position: 'top-center',
        type: 'warning'
      })

      setIsDeposit(false);
    } finally {
      setIsLoadingDeposit(false);
    }
  };

  const handleDeposiWithdrawValue = (value: any): void => {
    try {
      if (value === '' || Number(value) < 0) return;

      setDepositWithdrawValue(value);

      const valueInWei = ethers.utils.parseUnits(value.toString(), token.decimals);

      setDepositWithdrawValueWei(valueInWei);
    } catch (error) {
      toast('Invalid input value', { type: 'error' });
    }
  };

  // Show deposit modal
  const handleIsDeposit = (): void => {
    if (!isDeposit) {
      setStatusTranscation(StatusTransaction.APPROVE_DEPOSIT);
    }
    else {
      setStatusTranscation(null);
    }
    setDepositWithdrawValue(0);
    setDepositWithdrawValueWei(BigNumber.from(0));
    setIsDeposit(!isDeposit);

    setIsLoading(false);
  }

  // Show withdraw modal
  const handleIsWithdraw = () => {
    if (!isWithdraw) {
      setStatusTranscation(StatusTransaction.APPROVE_WITHDRAW);
    }
    else {
      setStatusTranscation(null);
    }
    setDepositWithdrawValue(0);
    setDepositWithdrawValueWei(BigNumber.from(0));
    setIsWithdraw(!isWithdraw);

    setIsLoading(false);
  }

  // Fetch the pool data based on the connected wallet
  const fetchPoolDataByWalletConnect = async (): Promise<void> => {
    try {
      const web3 = new Web3(getRpcProviderByChainId(chainId));

      const masterChefContract = new web3.eth.Contract(getMasterchefABIByChainId(chainId), getMastChefAddressByChainId(chainId));

      if (isConnected) {
        const userInfo = await masterChefContract.methods.userInfo(poolMasterchef, address).call();
        const userRewards = await masterChefContract.methods.pendingSupernova(poolMasterchef, address).call();
        const { amount } = userInfo as any;

        const amountBN = BigNumber.from(amount);
        const farmBalanceBN = BigNumber.from(pool.farmBalance);
        const tvlBN = utils.parseUnits(pool.tvl.toString(), 18);

        let totalStakedBN = BigNumber.from(0);

        if (!farmBalanceBN.isZero() && pool.tvl > 0) {
          totalStakedBN = amountBN.mul(tvlBN).div(farmBalanceBN);
        }

        setTotalTokensDeposited(amountBN);

        setRewards(Number(userRewards) / 10 ** 18);
        setTotalTokensDepositedBalance(totalStakedBN)
      }
    }
    catch (err) {
    }
    finally {
      setIsLoading(false);
    }
  }

  // Fetch total tokens or lp on connected wallet
  const fetchLpWallet = async (): Promise<void> => {
    if (!isConnected) {
      setBalanceWallet(BigNumber.from(0));
      return;
    }

    try {
      const web3 = new Web3(getRpcProviderByChainId(chainId));
      const tokenContract = new web3.eth.Contract(getTokenContractABIByChainId(chainId), poolAddress);

      let tokenWallet = await tokenContract.methods.balanceOf(address).call();

      const balanceBN = BigNumber.from(tokenWallet);

      setBalanceWallet(balanceBN);
    } catch (err) {
      console.error(err);
      setBalanceWallet(BigNumber.from(0));
    }
  };

  function formatTokenBalanceFromWallet(): string {
    const readable = parseFloat(utils.formatUnits(balanceWallet, token.decimals));

    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    const formattedValue = formatter.format(readable);

    return `${formattedValue} $${token.symbol.toUpperCase()}`;
  }

  function formatTokenBalanceFromWalletUSDC(): string {
    const balanceReadable = parseFloat(utils.formatUnits(balanceWallet, token.decimals));

    const totalValue = balanceReadable * token.price;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(totalValue);
  }

  function formatTokenBalanceFromFarm(): string {
    const readable = parseFloat(utils.formatUnits(totalTokensDeposited, token.decimals));

    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    const formattedValue = formatter.format(readable);

    return `${formattedValue} $${token.symbol.toUpperCase()}`;
  }

  function formatTokenBalanceFromFarmUSDC(
  ): string {
    const balanceReadable = parseFloat(utils.formatUnits(totalTokensDepositedBalance, token.decimals));

    const prefix = balanceReadable > 0 && balanceReadable < 0.01 ? '~ ' : '';

    const formatted = balanceReadable.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `${prefix}${formatted}`;
  }

  function formatPercentageFromFarm(
  ): string {
    const providerNum = BigNumber.isBigNumber(totalTokensDeposited)
      ? parseFloat(utils.formatUnits(totalTokensDeposited, 18))
      : Number(totalTokensDeposited);

    const supplyNum = BigNumber.isBigNumber(totalSupply)
      ? parseFloat(utils.formatUnits(totalSupply, 18))
      : Number(totalSupply);

    if (supplyNum <= 0 || providerNum <= 0 || isNaN(supplyNum) || isNaN(providerNum)) {
      return '0%';
    }

    const rawPercentage = (providerNum * 100) / supplyNum;

    const factor = Math.pow(10, token.decimals);
    const truncated = Math.floor(rawPercentage * factor) / factor;

    return `${truncated.toFixed(2)}%`;
  }

  function fromWeiWithDecimals(valueInWei: BigNumber): string {
    return ethers.utils.formatUnits(valueInWei, token.decimais);
  }

  useEffect(() => {
    fetchLpWallet();
    fetchPoolDataByWalletConnect();
  }, [isConnected, address, pool, chainId]);


  return <div style={cardStyle}>
    <ModalDeposit show={isDeposit} title={`DEPOSIT $${token.symbol.toUpperCase()}`}
      balance={`${formatTokenBalanceFromWallet()} / ${(formatTokenBalanceFromWalletUSDC())}`} handleDeposit={handleDeposit}
      handleShow={handleIsDeposit} value={depositWithdrawValue} handleValue={handleDeposiWithdrawValue} decimals={token.decimals} buttonTitle={transactionStatusText} balanceValue={fromWeiWithDecimals(balanceWallet)} isLoading={isLoadingDeposit} />
    <ModalDeposit show={isWithdraw} title={`WITHDRAW $${token.symbol.toUpperCase()}`}
      balance={`${formatTokenBalanceFromFarm()} / ${(formatTokenBalanceFromFarmUSDC())}`} handleDeposit={handleWithdraw}
      handleShow={handleIsWithdraw} value={depositWithdrawValue} handleValue={handleDeposiWithdrawValue} decimals={token.decimals} buttonTitle={transactionStatusText} balanceValue={fromWeiWithDecimals(totalTokensDeposited)} isLoading={isLoadingDeposit} />
    <HeaderContainer>
      <ImageToken src={fetchImageByAddress(token.id)} />
      <HeaderDetailsContainer style={{ zIndex: 999 }}>
        <div onClick={() => { }} style={{ display: 'flex', alignContent: 'center', justifyContent: 'start' }}>
          <h3 className='text-white sm:text-18 text-18 font-bold' style={{ textShadow: '1px 1px 1px #fff', textAlign: 'start', marginRight: 4 }}>
            {token.symbol.toUpperCase()}
          </h3>
        </div>
        <TokenContainer>
          <h3 className='text-white sm:text-14 text-14 font-normal'>
            {token.name}
          </h3>
        </TokenContainer>
        <div style={{ display: 'flex' }}>
          <a className="fee">        <FeeContainer>
            <FeeValueContainer style={{ display: 'flex' }}>
              <h3 className='text-white sm:text-14 text-14 font-normal'>
                {fee > 0 ? `${fee}% Fee` : 'No fees!'}
              </h3>
            </FeeValueContainer>
          </FeeContainer></a>
          <Tooltip style={{ zIndex: 999 }} anchorSelect=".fee" place="top">
            {`This is the fee reserved for the developer, it is a way to support and encourage the farm.`}
          </Tooltip>
        </div>
      </HeaderDetailsContainer>
      <Separator />
    </HeaderContainer>
    <PoolContainer style={{ zIndex: 999 }}>
      <PoolSectionContainer>
        <PoolSectionValueContainer>
          <a className="totalSupply" style={{ display: 'flex', flex: 1 }}>
            <PoolSectionValueDescriptionContainer>
              <h3 className='text-white sm:text-16 text-16 font-bold'>
                APR:
              </h3>
            </PoolSectionValueDescriptionContainer>
            <Separator />
            <PoolSectionValueDescriptionContainer>
              <h3 className='text-white sm:text-16 text-16 font-bold'>
                {isLoading ? <SkeletonTheme baseColor="#202020" highlightColor="#444">
                  <Skeleton count={1} height={5} width={45} />
                </SkeletonTheme> :
                  <AnimatedNumber
                    includeComma
                    transitions={(index: any) => ({
                      type: "spring",
                      duration: 4,
                    })}
                    value={pool.apr}
                    formatValue={(value: any) => `${Number(value).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).replace('$', '')}%`}
                  />}
              </h3>
            </PoolSectionValueDescriptionContainer>
          </a>
          <Tooltip style={{ zIndex: 999 }} anchorSelect=".totalSupply" place="top">
            {`APR (Annual Percentage Rate) is the annual return rate of an investment in cryptocurrencies, calculated without considering compound interest. It's commonly used in yield farming and staking to indicate simple earnings.`}
          </Tooltip>
        </PoolSectionValueContainer>
      </PoolSectionContainer>
      <PoolSectionContainer>
        <PoolSectionValueContainer>
          <a className="mutiplier" style={{ display: 'flex', flex: 1 }}>
            <PoolSectionValueDescriptionContainer>
              <h3 className='text-white sm:text-16 text-16 font-bold'>
                Multiplier:
              </h3>
            </PoolSectionValueDescriptionContainer>
            <Separator />
            <PoolSectionValueDescriptionContainer>
              <h3 className='text-white sm:text-16 text-16 font-bold'>
                {isLoading ? <SkeletonTheme baseColor="#202020" highlightColor="#444">
                  <Skeleton count={1} height={5} width={45} />
                </SkeletonTheme> : `${multiplier}x`}
              </h3>
            </PoolSectionValueDescriptionContainer></a>
        </PoolSectionValueContainer>
        <Tooltip style={{ zIndex: 999 }} anchorSelect=".mutiplier" place="top">
          {`Multiplier defines the importance of a given pool in relation to others in the distribution of rewards.`}
        </Tooltip>
      </PoolSectionContainer>
      <PoolSectionContainer>
        <PoolSectionValueContainer>
          <a className="tvl" style={{ display: 'flex', flex: 1, zIndex: 999 }}>
            <PoolSectionValueDescriptionContainer>
              <h3 className='text-white sm:text-16 text-16 font-bold'>
                Total Value Locked (TVL):
              </h3>
            </PoolSectionValueDescriptionContainer>
            <Separator />
            <PoolSectionValueDescriptionContainer>
              <h3 className='text-white sm:text-16 text-16 font-bold'>
                {isLoading ? <SkeletonTheme baseColor="#202020" highlightColor="#444">
                  <Skeleton count={1} height={5} width={45} />
                </SkeletonTheme> : <div style={{ display: 'flex' }}>
                  <AnimatedNumber
                    includeComma
                    transitions={(index: any) => ({
                      type: "spring",
                      duration: 4,
                    })}
                    value={pool.tvl > 0.01 ? pool.tvl : 0}
                    formatValue={(value: any) => `${pool.tvl > 0 && pool.tvl < 0.01 ? '~ ' : ''}${Number(value).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  />
                </div>}
              </h3>
            </PoolSectionValueDescriptionContainer></a>
          <Tooltip style={{ zIndex: 999 }} anchorSelect=".tvl" place="top">
            {`TVL (Total Value Locked) refers to the total amount of assets, usually in dollars, locked in a DeFi platform's smart contracts. It represents the overall liquidity and trust in the protocol.`}
          </Tooltip>
        </PoolSectionValueContainer>
      </PoolSectionContainer>
      <img src={'/images/timeline/border.png'} style={{ width: 370, height: 100, marginTop: -35, marginLeft: -15 }} />
      <div style={{ display: 'flex', paddingTop: 20, marginTop: -60, }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 className='text-white sm:text-14 text-14 font-bold'>
              You staked
            </h3>
            <h3 className='logo-2' style={{ color: '#fff' }}>
              {isLoading ? <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <Skeleton count={1} height={5} width={45} />
              </SkeletonTheme> : `${formatPercentageFromFarm()}`}
            </h3>
            <h3 className='logo-2' style={{ color: '#fff' }}>
              {isLoading ? <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <Skeleton count={1} height={5} width={45} />
              </SkeletonTheme> :
                <div style={{ display: 'flex' }}>
                  <AnimatedNumber
                    includeComma
                    transitions={(index: any) => ({
                      type: "spring",
                      duration: 4,
                    })}
                    value={totalTokensDepositedBalance}
                    formatValue={(value: any) => formatTokenBalanceFromFarmUSDC()}
                  />
                </div>}
            </h3>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <h3 className='text-white sm:text-14 text-14 font-bold'>
            Your rewards
          </h3>
          <h3 className={rewards > 0 ? 'logo-3' : ''} style={{ color: '#228345', textShadow: '1px 1px 1px #fff' }}>
            {isLoading ? <SkeletonTheme baseColor="#202020" highlightColor="#444">
              <Skeleton count={1} height={5} width={45} />
            </SkeletonTheme> :
              <div style={{ display: 'flex' }}>
                &nbsp;
                <AnimatedNumber
                  includeComma
                  transitions={(index: any) => ({
                    type: "spring",
                    duration: 4,
                  })}
                  value={rewards}
                  formatValue={(value: any) => {
                    const formatter = new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    });

                    return formatter.format(value);
                  }}
                />
                &nbsp;
                {`$${process.env.NEXT_PUBLIC_APP_NAME?.toUpperCase()}`}
                &nbsp;
                <AnimatedNumber
                  includeComma
                  transitions={(index: any) => ({
                    type: "spring",
                    duration: 4,
                  })}
                  value={Number(rewards * farmTokenUSDCPrice)}
                  formatValue={(value: any) => `$${numeral(value).format('0.00a')}`}
                />
              </div>
            }
          </h3>
          {!isLoading &&
            <button
              disabled={rewards === 0 || isLoadingDeposit}
              className='clickable-rewards-div bg-transparent border-none'
              onClick={handleRewards}
            >
              {isLoading ? (
                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                  <Skeleton count={1} height={5} width={45} />
                </SkeletonTheme>
              ) : (
                <h3
                  className={`${rewards > 0 ? 'logo-2 ' : ''} font-bold text-[16px] ${rewards === 0 ? 'line-through text-[#bfbfbf]' : 'text-[#99E39E] underline'
                    }`}
                  style={{ background: 'transparent', border: 'none' }}
                >
                  CLAIM REWARDS
                </h3>
              )}
            </button>
          }
        </div>
      </div>
    </PoolContainer>
    <div className="clickable-div" style={{ display: 'flex', alignItems: 'center', marginTop: 20 }} onClick={() => {
      navigator.clipboard.writeText(token.id);
      toast('Copied address', {
        position: 'top-center'
      })
    }}>
      <h3 className='text-white sm:text-14 text-14 font-normal' style={{ marginRight: 10 }}>
        {token ? token.symbol.toUpperCase() : ''}: {pool.token ? `${token.id.substring(0, 10)}...${token.id.substring(token.id.length - 10, token.id.length)}` : ''}
      </h3>
    </div>
    <WalletContainer>
      <WalletTitleContainer style={{ display: 'flex' }}>
        <h3 className='text-white sm:text-14 text-14 font-normal' style={{ flex: 1 }}>
          Your wallet tokens balance
        </h3>
      </WalletTitleContainer>
      <WalletValueContainer>
        <WalletValueDescriptionContainer>
          <h3 className='text-white sm:text-14 text-14 font-normal'>
            {`${formatTokenBalanceFromWallet()} / ${formatTokenBalanceFromWalletUSDC()}`}
          </h3>
        </WalletValueDescriptionContainer>
      </WalletValueContainer>
    </WalletContainer>
    {isConnected ?
      <ActionContainer>
        <div style={{ flex: 1 }}>
          <button className='clickable-div' onClick={handleIsDeposit} disabled={isLoadingDeposit} type="button" style={{
            width: '100%', padding: 10, borderRadius: 10, border: 'none',
            background: 'linear-gradient(to right, #29317D, #019CAD)'
          }}><h3 color={'white'} style={{ color: '#fff' }}>
              DEPOSIT
            </h3></button>
        </div>
        <ActionButtonSeparator />
        <div style={{ flex: 1 }}>
          <button className='clickable-div' onClick={handleIsWithdraw} disabled={isLoadingDeposit} type="button" style={{
            width: '100%', padding: 10, borderRadius: 10, border: 'none',
            background: 'linear-gradient(to right, #29317D, #FFA62E)'
          }}><h3 color={'white'} style={{ color: '#fff' }}>
              WITHDRAW
            </h3></button>
        </div>
      </ActionContainer> : <ActionButtonWalletContainer>
        <appkit-button size="sm" label='' loadingLabel=''></appkit-button>
      </ActionButtonWalletContainer>}
    <style>
      {`
  :root {
    --shadow-color: #FF9E9E;
    --shadow-color-light: white;
  }

  @keyframes shadowMove {
    0%, 100% {
      box-shadow: 2px 2px 7px rgba(61, 184, 93, 1);
    }
    25% {
      box-shadow: 7px 2px 7px rgba(255, 166, 46, 1), 2px 2px 7px rgba(255, 166, 46, 1);
    }
    50% {
      box-shadow: 2px 7px 7px rgba(255, 166, 46, 1), 2px 2px 7px rgba(255, 166, 46, 1);
    }
    75% {
      box-shadow: -7px 2px 7px rgba(255, 166, 46, 1), 2px 2px 7px rgba(255, 166, 46, 1);
    }
  }

  @keyframes neon {
    0% {
      text-shadow: 
        -1px -1px 1px var(--shadow-color-light),
        -1px 1px 1px var(--shadow-color-light),
        1px -1px 1px var(--shadow-color-light),
        1px 1px 1px var(--shadow-color-light),
        0 0 3px var(--shadow-color-light),
        0 0 10px var(--shadow-color-light),
        0 0 20px var(--shadow-color-light);
    }
    50% {
      text-shadow: 
        -1px -1px 1px var(--shadow-color-light),
        -1px 1px 1px var(--shadow-color-light),
        1px -1px 1px var(--shadow-color-light),
        1px 1px 1px var(--shadow-color-light),
        0 0 5px var(--shadow-color-light),
        0 0 15px var(--shadow-color-light),
        0 0 25px var(--shadow-color-light);
    }
  }

  .clickable-div, 
  .clickable-rewards-div, 
  .clickable-title-div {
    transition: transform 0.1s, background-color 0.1s;
    cursor: pointer;
    border-radius: 15px;
  }

  .clickable-div:hover {
    transform: scale(0.95);
    background-color: #152B48;
    padding-right: 10px;
    padding-left: 10px;
  }

  .clickable-title-div:hover {
    transform: scale(0.95);
    background-color: #152B48;
  }

  .logo-3 {
    color: white;
    animation: neon 3s infinite;
    transform: translateZ(0);
  }
`}
    </style>
  </div>
}

export default FarmPoolCard;