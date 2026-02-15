/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-empty */
/* eslint-disable react/prop-types */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
import ModalDeposit from "@/components/ModalDeposit";
import { wagmiAdapter } from "@/components/Web3Provider";
import { AppContext } from "@/context/appContext";
import { openInNewTab } from "@/utils/functions";
import { getMasterchefABIByChainId } from "@/utils/masterChefABIProvider";
import { getMastChefAddressByChainId } from "@/utils/masterchefAddressProvider";
import { getTokenContractABIByChainId } from "@/utils/tokenContractABIProvider";
import { useAppKit, useAppKitNetwork } from "@reown/appkit/react";
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
// @ts-ignore
import { ElectricBorderShow } from "@/components/ElectricBorder";
import { fetchImageByAddress } from "@/utils/fetchTokenImage";
import { isAppChain } from "@/utils/helpers";
import { getSavvyTokenByChainId } from "@/utils/tokenAddressProvider";
import AnimatedNumber from "animated-number-react";
import { BigNumber, ethers, utils } from 'ethers';
import numeral from 'numeral';
import { useContext, useEffect, useMemo, useState } from "react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from "react-toastify";
import { Tooltip } from 'react-tooltip';
import useSound from 'use-sound';
import { Abi, Address } from "viem";
import { base, baseSepolia, bsc, bscTestnet, sonic, sonicTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import Web3 from "web3";
import { ActionButtonSeparator, ActionButtonWalletContainer, ActionContainer, FeeContainer, FeeValueContainer, HeaderContainer, HeaderDetailsContainer, ImageToken, PoolContainer, PoolSectionContainer, PoolSectionValueContainer, PoolSectionValueDescriptionContainer, Separator, TokenContainer, WalletContainer, WalletTitleContainer, WalletValueContainer, WalletValueDescriptionContainer, cardStyle } from "./styles";
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
  const { address, isConnected, chainId } = useAccount()

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
  const { caipNetwork } = useAppKitNetwork();

  const [play] = useSound(transactionSound);

  const [isShowTransactionEffect, setIsShowTransactionEffect] = useState(false);

  const { pool } = props;
  const { token0, token1, fee, multiplier, poolAddress, poolMasterchef, decimals } = pool;
  const totalSupply = Number(pool.farmBalance) / 10 ** Number(decimals);
  const { farmTokenUSDCPrice, fetchDataFarm } = useContext(AppContext);

  const env = import.meta.env;

  const { open } = useAppKit();

  const transactionStatusText = useMemo(() => {
    switch (statusTranscation) {
      case StatusTransaction.APPROVE:
        return 'APPROVE';
      case StatusTransaction.APPROVE_DEPOSIT:
        return 'APPROVE';
      case StatusTransaction.APPOVING_DEPOSIT:
        return 'PROCESSING APPROVE...';
      case StatusTransaction.DEPOSIT:
        return 'DEPOSIT';
      case StatusTransaction.DEPOSITING:
        return 'DEPOSITING...';
      case StatusTransaction.APPROVE_WITHDRAW:
        return 'WITHDRAW';
      case StatusTransaction.WITHDRAWING:
        return 'WITHDRAWING...';
      default:
        return '';
    }
  }, [statusTranscation]);

  const handleRewards = async () => {
    try {
      if (rewards === 0) {
        toast.dismiss();
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
      toast.dismiss();
      toast("We are processing your reward claim.", {
        type: 'success',
        position: 'top-center',
        style: {
          fontSize: 16,
          fontFamily: 'Trebuchet MS, sans-serif',
        }
      });


      //console.log("handleRewards5 -> amountToDeposit = ", amountToDeposit);
      const hash = await writeContract(wagmiAdapter.wagmiConfig, {
        abi: getMasterchefABIByChainId(chainId),
        address: getMastChefAddressByChainId(chainId) as Address,
        functionName: 'withdraw',
        args: [poolMasterchef, amountToDeposit],
        account: address,
      })

      const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash })

      if (receipt.status === 'success') {
        setBalanceWallet(BigNumber.from(0));
        fetchLpWallet();
        fetchPoolDataByWalletConnect();
        play();
        showTransactionEffect();
      } else {
        toast.dismiss();
        toast('A rewards withdrawal transaction error occurred.', {
          position: 'top-center',
          type: 'error'
        })
      }

      setDepositWithdrawValue(0);
    }
    catch (err) {
      toast.dismiss();
      toast('A rewards withdrawal transaction error occurred.', {
        position: 'top-center',
        type: 'error'
      })
    }
    finally {
      setIsLoadingDeposit(false);
    }
  }

  const handleWithdraw = async () => {
    try {
      if (depositWithdrawValueWei.lte(BigNumber.from(0))) {
        toast.dismiss();
        toast("Enter the amount of tokens you want to withdraw.", {
          type: 'warning',
          position: 'top-center',
          style: { fontSize: 16, fontFamily: 'Trebuchet MS, sans-serif' },
        });
        return;
      }
      else if (depositWithdrawValueWei.gt(totalTokensDeposited)) {
        toast.dismiss();
        toast("You don't have the amount of tokens you want to withdraw in this pool.", {
          type: 'warning',
          position: 'top-center',
          style: { fontSize: 16, fontFamily: 'Trebuchet MS, sans-serif' }
        });
        return;
      }

      setIsLoadingDeposit(true);
      //console.log("handleRewards2");
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
        showTransactionEffect();
        fetchDataFarm();
        toast.dismiss();
        toast("Withdrawal completed successfully!", {
          type: 'success',
          position: 'top-center',
          style: {
            fontSize: 16,
            fontFamily: 'Trebuchet MS, sans-serif',
          }
        });
      } else {
        toast.dismiss();
        toast('A withdrawal transaction error occurred.', {
          position: 'top-center',
          type: 'error'
        })
      }

      setIsWithdraw(false);
      setDepositWithdrawValue(0);
    }
    catch (err) {
      toast.dismiss();
      toast('A withdrawal transaction error occurred.', {
        position: 'top-center',
        type: 'error'
      })
    }
    finally {
      setIsLoadingDeposit(false);
    }
  }

  const handleAddLiquidity = () => {
    openInNewTab(`https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=${token0.id}`)
  }

  const isValidAddress = (adr: string) => {
    try {
      const web3 = new Web3()
      web3.utils.toChecksumAddress(adr)
      return true
    } catch (e) {
      return false
    }
  }

  const base64Decode = (str: string) => {
    return decodeURIComponent(escape(atob(str)));
  }

  /**
   * Make a deposit into the pool based on the chain it’s on.
   * @returns void
   */
  const handleDeposit = async () => {
    try {
      if (depositWithdrawValueWei.lte(BigNumber.from(0))) {
        toast.dismiss();
        toast("Enter the amount of tokens you want to deposit.", {
          type: 'warning',
          position: 'top-center',
          style: { fontSize: 16, fontFamily: 'Trebuchet MS, sans-serif' },
        });
        return;
      }

      else if (balanceWallet.lte(BigNumber.from(0)) || depositWithdrawValueWei.gt(balanceWallet)) {
        toast.dismiss();
        toast(
          "You do not have enough tokens in your portfolio to deposit. Click to go to the liquidity pools and get more tokens.",
          {
            type: 'warning',
            position: 'top-center',
            style: { fontSize: 16, fontFamily: 'Trebuchet MS, sans-serif' },
            onClick: () => handleAddLiquidity(),
          }
        );
        return;
      }

      setIsLoadingDeposit(true);

      let receiptApprove;

      const allowanceWei: any = await readContract(
        wagmiAdapter.wagmiConfig,
        {
          abi: getTokenContractABIByChainId(chainId),
          address: poolAddress,
          functionName: 'allowance',
          args: [
            address,
            getMastChefAddressByChainId(chainId)
          ],
          account: address,
        }
      );

      setIsLoadingDeposit(true);

      if (allowanceWei != depositWithdrawValueWei) {
        setStatusTranscation(StatusTransaction.APPOVING_DEPOSIT);

        const approveHash = await writeContract(
          wagmiAdapter.wagmiConfig,
          {
            abi: getTokenContractABIByChainId(chainId),
            address: poolAddress,
            functionName: 'approve',
            args: [getMastChefAddressByChainId(chainId), depositWithdrawValueWei],
            account: address,
          }
        );

        receiptApprove = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash: approveHash })
      }
      else {
        receiptApprove = { status: 'success' };
      }

      if (receiptApprove.status === 'success') {

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
          showTransactionEffect();
          fetchDataFarm();

          toast.dismiss();
          toast("Deposit completed successfully!", {
            type: 'success',
            position: 'top-center',
            style: { fontSize: 16, fontFamily: 'Trebuchet MS, sans-serif' },
          });
        } else {
          toast.dismiss();
          toast('A deposit transaction error occurred.', {
            position: 'top-center',
            type: 'error'
          })
        }

        setDepositWithdrawValue(0);
        setIsDeposit(false);
      }
    } catch (err) {
      toast.dismiss();
      toast('Transaction has been cancelled.', {
        position: 'top-center',
        type: 'warning'
      })

      setIsDeposit(false);
    } finally {
      setIsLoadingDeposit(false);
    }
  };

  // Update and validate the amount of tokens entered.
  const handleDeposiWithdrawValue = (value: any) => {
    try {
      if (value === '' || Number(value) < 0) return;

      setDepositWithdrawValue(value);

      const valueInWei = ethers.utils.parseUnits(value.toString(), decimals);

      setDepositWithdrawValueWei(valueInWei);
    } catch (error) {
      toast.dismiss();
      toast('Invalid input value', { type: 'error' });
    }
  };

  // Show deposit modal
  const handleIsDeposit = async (): Promise<void> => {
    setIsDeposit(!isDeposit);

    if (!isDeposit) {
      const allowanceWei: any = await readContract(
        wagmiAdapter.wagmiConfig,
        {
          abi: getTokenContractABIByChainId(chainId),
          address: poolAddress,
          functionName: 'allowance',
          args: [
            address,
            getMastChefAddressByChainId(chainId)
          ],
          account: address,
        }
      );


      const allowanceEth = ethers.utils.formatUnits(
        ethers.BigNumber.from(allowanceWei.toString()),
        decimals
      );

      setDepositWithdrawValueWei(BigNumber.from(allowanceWei));
      setDepositWithdrawValue(Number(allowanceEth));

      if (allowanceWei > 0) {
        setStatusTranscation(StatusTransaction.DEPOSIT)
      }
      else {
        setStatusTranscation(StatusTransaction.APPROVE_DEPOSIT);
      }
    }
    else {
      setStatusTranscation(null);
      setDepositWithdrawValue(0);
      setDepositWithdrawValueWei(BigNumber.from(0));
    }

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
  const fetchPoolDataByWalletConnect = async () => {
    try {
      if (isConnected) {

        const masterChefAddress = getMastChefAddressByChainId(chainId);
        const masterChefAbi = getMasterchefABIByChainId(chainId);

        const userInfo = await readContract(wagmiAdapter.wagmiConfig, {
          address: masterChefAddress as Address,
          abi: masterChefAbi as Abi,
          functionName: 'userInfo',
          args: [poolMasterchef, address as Address],
          chainId: chainId,
        });

        const userRewards = await readContract(wagmiAdapter.wagmiConfig, {
          address: masterChefAddress as Address,
          abi: masterChefAbi as Abi,
          functionName: 'pendingSavvy',
          args: [poolMasterchef, address as Address],
          chainId: chainId,
        });

        const { amount } = userInfo as any;

        const amountBN = BigNumber.from(amount);
        const farmBalanceBN = BigNumber.from(pool.farmBalance);
        const tvlFixed = Number(pool.tvl).toFixed(decimals);
        const tvlBN = utils.parseUnits(tvlFixed, Number(decimals));

        let totalStakedBN = BigNumber.from(0);

        if (!farmBalanceBN.isZero() && pool.tvl > 0) {
          totalStakedBN = amountBN.mul(tvlBN).div(farmBalanceBN);
        }

        setTotalTokensDeposited(amountBN);

        setRewards(Number(userRewards) / 10 ** 18);
        setTotalTokensDepositedBalance(totalStakedBN);
      }
    }
    catch (err) {
    }
    finally {
      setIsLoading(false);
    }
  };

  // Fetch total tokens or lp on connected wallet
  const fetchLpWallet = async () => {
    if (!isConnected) {
      setBalanceWallet(BigNumber.from(0));
      return;
    }

    try {
      const lpWallet: any = await readContract(wagmiAdapter.wagmiConfig, {
        address: poolAddress as Address,
        abi: getTokenContractABIByChainId(chainId) as Abi,
        functionName: 'balanceOf',
        args: [address as Address],
        chainId: chainId,
      });

      const balanceBN = BigNumber.from(lpWallet);

      setBalanceWallet(balanceBN);
    }
    catch (err) {
    }
  };

  function formatTokenBalanceFromWallet(): string {
    const readable = parseFloat(utils.formatUnits(balanceWallet, decimals));

    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 10,
      maximumFractionDigits: 10,
    });

    const formattedValue = formatter.format(readable);

    return `${formattedValue} LP`;
  }

  function formatTokenBalanceFromWalletUSDC(): string {
    const balanceReadable = parseFloat(utils.formatUnits(balanceWallet, decimals));

    const totalValue = (pool.tvlTotal > 0 ? ((((balanceReadable) * 100 / (Number(pool.totalSupply) / 10 ** Number(decimals)))) / 100) * pool.tvlTotal : 0);

    if (totalValue === 0 || Number.isNaN(totalValue)) {
      return `$0.00`;
    }

    // For regular USD values (>= $0.01) use normal currency formatting with 2 decimals
    if (totalValue >= 0.01) {
      const formatted = totalValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formatted;
    }

    // For very small USD values (< $0.01) show two digits starting at the
    // first non-zero decimal (so small magnitudes like 0.0000043 become
    // $0.0000043 or $0.00000430 depending on available decimals).
    const totalStr = totalValue.toFixed(18);
    const parts = totalStr.split('.');
    if (parts.length === 1) {
      return `$${parts[0]}`;
    }

    const integer = parts[0];
    const decimalsStr = parts[1] || '';

    let firstNonZero = -1;
    for (let i = 0; i < decimalsStr.length; i++) {
      if (decimalsStr[i] !== '0') {
        firstNonZero = i;
        break;
      }
    }

    if (firstNonZero === -1) {
      return `$${integer}.00`;
    }

    let displayLen = firstNonZero + 2; // show 2 digits starting at first non-zero
    if (displayLen > decimalsStr.length) displayLen = decimalsStr.length;

    const truncated = decimalsStr.slice(0, displayLen).replace(/0+$/g, '');

    const finalDecimals = truncated.length === 0 ? decimalsStr.slice(0, Math.min(2, decimalsStr.length)) : truncated;

    const prefix = totalValue > 0 && totalValue < 0.01 ? '~ ' : '';
    return `${prefix}$${integer}.${finalDecimals}`;
  }

  function formatTokenBalanceFromFarm(): string {
    const readableStr = utils.formatUnits(totalTokensDeposited, pool.decimals);
    const readable = parseFloat(readableStr);

    if (readable === 0 || Number.isNaN(readable)) {
      return `0 LP`;
    }

    // For regular values (>= 0.001) use compact notation with 3 decimals
    if (readable >= 0.01) {
      const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const formattedValue = formatter.format(readable);
      return `${formattedValue} LP`;
    }

    // For very small values (< 0.001) show enough decimal places so
    // that the first 3 non-zero decimal digits are visible (e.g. 0.00000444)
    const parts = readableStr.split('.');
    if (parts.length === 1) {
      return `${parts[0]} LP`;
    }

    const integer = parts[0];
    const decimals = parts[1] || '';

    let nonZeroCount = 0;
    let lastIndex = -1;

    for (let i = 0; i < decimals.length; i++) {
      if (decimals[i] !== '0') nonZeroCount++;
      if (nonZeroCount >= 3) {
        lastIndex = i;
        break;
      }
    }

    const displayDecimals = lastIndex >= 0 ? lastIndex + 1 : decimals.length;
    let truncated = decimals.slice(0, displayDecimals);
    truncated = truncated.replace(/0+$/g, '');
    if (truncated.length === 0) {
      truncated = decimals.slice(0, Math.min(3, decimals.length));
    }

    const prefix = readable > 0 && readable < 0.001 ? '~ ' : '';

    return `${prefix}${integer}.${truncated} LP`;
  }

  function formatTokenBalanceFromFarmUSDC(
  ): string {
    const totalValue = parseFloat(utils.formatUnits(totalTokensDepositedBalance, pool.decimals));

    if (totalValue === 0 || Number.isNaN(totalValue)) {
      return `$0.00`;
    }

    // For regular USD values (>= $0.01) format normally with 2 decimals
    if (totalValue >= 0.01) {
      const formatted = totalValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formatted;
    }

    // For very small USD values (< $0.01) show enough decimal places so
    // the first 3 non-zero decimal digits are visible (e.g. $0.00000444)
    const totalStr = totalValue.toFixed(18);
    const parts = totalStr.split('.');
    if (parts.length === 1) {
      return `$${parts[0]}`;
    }

    const integer = parts[0];
    const decimals = parts[1] || '';

    let nonZeroCount = 0;
    let lastIndex = -1;
    for (let i = 0; i < decimals.length; i++) {
      if (decimals[i] !== '0') nonZeroCount++;
      if (nonZeroCount >= 3) {
        lastIndex = i;
        break;
      }
    }

    const displayDecimals = lastIndex >= 0 ? lastIndex + 1 : decimals.length;
    let truncated = decimals.slice(0, displayDecimals);
    truncated = truncated.replace(/0+$/g, '');
    if (truncated.length === 0) {
      truncated = decimals.slice(0, Math.min(3, decimals.length));
    }

    const prefix = totalValue > 0 && totalValue < 0.01 ? '~ ' : '';
    return `${prefix}$${integer}.${truncated}`;
  }


  function formatPercentageFromFarm(
  ): string {
    const providerNum = BigNumber.isBigNumber(totalTokensDeposited)
      ? parseFloat(utils.formatUnits(totalTokensDeposited, Number(decimals)))
      : Number(totalTokensDeposited);

    const supplyNum = BigNumber.isBigNumber(totalSupply)
      ? parseFloat(utils.formatUnits(totalSupply, Number(decimals)))
      : Number(totalSupply);

    if (supplyNum <= 0 || providerNum <= 0 || isNaN(supplyNum) || isNaN(providerNum)) {
      return '0%';
    }

    const rawPercentage = (providerNum * 100) / supplyNum;

    const factor = Math.pow(10, Number(decimals));
    const truncated = Math.floor(rawPercentage * factor) / factor;

    return `${truncated.toFixed(2)}%`;
  }

  function fromWeiWithDecimals(valueInWei: BigNumber): string {
    return ethers.utils.formatUnits(valueInWei, pool.decimals);
  }

  const openNetworkModal = () => {
    open({ view: 'Networks' });
  };

  const showTransactionEffect = (): void => {
    setIsShowTransactionEffect(true);

    setTimeout(() => {
      setIsShowTransactionEffect(false);
    }, 3400)
  }

  const handleGoToLp = (): void => {
    if (caipNetwork?.id === sonicTestnet.id) {
      if (token0.id.toLowerCase() === getSavvyTokenByChainId(Number(chainId)).toLowerCase() || token1.id.toLowerCase() === getSavvyTokenByChainId(Number(chainId)).toLowerCase()) {
        window.open(`https://equalizer.exchange/liquidity/${poolAddress}/add`, '_blank');
      }
      else {
        window.open(`https://www.shadow.so/liquidity/${poolAddress}/add`, '_blank');
      }
    }
    else if (caipNetwork?.id === bscTestnet.id) {
      window.open(`https://pancakeswap.finance/liquidity/pool/bsc/${poolAddress}`, '_blank');
    }
    else if (caipNetwork?.id === baseSepolia.id) {
      window.open(`https://app.uniswap.org/positions/v2/base/${poolAddress}`, '_blank');
    }
    if (caipNetwork?.id === sonic.id) {
      if (token0.id.toLowerCase() === getSavvyTokenByChainId(Number(chainId)).toLowerCase() || token1.id.toLowerCase() === getSavvyTokenByChainId(Number(chainId)).toLowerCase()) {
        window.open(`https://equalizer.exchange/liquidity/${poolAddress}/add`, '_blank');
      }
      else {
        window.open(`https://www.shadow.so/liquidity/${poolAddress}/add`, '_blank');
      }
    }
    else if (caipNetwork?.id === bsc.id) {
      window.open(`https://pancakeswap.finance/liquidity/pool/bsc/${poolAddress}`, '_blank');
    }
    else if (caipNetwork?.id === base.id) {
      window.open(`https://app.uniswap.org/positions/v2/base/${poolAddress}`, '_blank');
    }
    else {
      window.open(`https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=${getSavvyTokenByChainId(Number(bscTestnet.id))}`, '_blank');
    }
  }

  useEffect(() => {
    fetchLpWallet();
    fetchPoolDataByWalletConnect();
  }, [isConnected, address, pool, chainId]);


  return <ElectricBorderShow
    color="#7df9ff"
    speed={1}
    chaos={0.5}
    thickness={2}
    style={{ borderRadius: 16 }}
    isShow={isShowTransactionEffect}
  > <div style={cardStyle}>
      <ModalDeposit show={isDeposit} title={`DEPOSIT ${token0.symbol.toUpperCase()}/${token1.symbol.toUpperCase()}`}
        balance={`${formatTokenBalanceFromWallet()} / ${formatTokenBalanceFromWalletUSDC()}`} handleDeposit={handleDeposit}
        handleShow={handleIsDeposit} value={depositWithdrawValue} handleValue={handleDeposiWithdrawValue} decimals={decimals} buttonTitle={transactionStatusText} balanceValue={fromWeiWithDecimals(balanceWallet)} isLoading={isLoadingDeposit} />
      <ModalDeposit show={isWithdraw} title={`WITHDRAW LP ${token0.symbol.toUpperCase()} / ${token1.symbol.toUpperCase()}`}
        balance={`${formatTokenBalanceFromFarm()} / ${formatTokenBalanceFromFarmUSDC()}`} handleDeposit={handleWithdraw}
        handleShow={handleIsWithdraw} value={depositWithdrawValue} handleValue={handleDeposiWithdrawValue} decimals={decimals} buttonTitle={transactionStatusText} balanceValue={fromWeiWithDecimals(totalTokensDeposited)} isLoading={isLoadingDeposit} />
      <HeaderContainer>
        <ImageToken src={fetchImageByAddress(token0.id)} onError={e => {
          e.currentTarget.src = '/images/icons/icon-token.png';
        }} />
        <ImageToken style={{ marginLeft: 35 }} src={fetchImageByAddress(token1.id)} onError={e => {
          e.currentTarget.src = '/images/icons/icon-token.png';
        }} />
        <HeaderDetailsContainer style={{ zIndex: 999 }}>
          <div className='clickable-title-div' style={{ display: 'flex', alignContent: 'center', justifyContent: 'start', alignItems: 'center' }} onClick={() => { handleGoToLp(); }}>
            <h3 className='text-white sm:text-18 text-18 font-bold' style={{ textShadow: '1px 1px 1px #fff', textAlign: 'start', marginRight: 8, display: 'flex', alignItems: 'center' }}>
              {`${token0.symbol.toUpperCase()}/${token1.symbol.toUpperCase()}`}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); handleGoToLp(); }}
              aria-label="Open liquidity page"
              title="Open liquidity page"
              style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fff' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </div>
          <TokenContainer>
            <h3 className='text-white sm:text-14 text-14 font-normal'>
              {`${token0.name != null && token0.name != '' ? token0.name ?? token0.symbol : token0.symbol}/${token1.name != null && token1.name != '' ? token1.name ?? token1.symbol : token1.symbol}`}
            </h3>
          </TokenContainer>
          <div style={{ display: 'flex' }}>
            <a className="fee">        <FeeContainer>
              <FeeValueContainer style={{ display: 'flex' }}>
                <h3 className='text-white sm:text-14 text-14 font-normal'>
                  {fee > 0 ? `${fee}% Deposit/Withdraw Fee` : 'No fees!'}
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
                <h3 className='text-16 sm:text-16 font-bold bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,215,0,0.8)] drop-shadow-[0_0_18px_rgba(255,200,0,0.6)]'>
                  APR:
                </h3>
              </PoolSectionValueDescriptionContainer>
              <Separator />
              <PoolSectionValueDescriptionContainer>
                <h3 className='text-16 sm:text-16 font-bold bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,215,0,0.8)] drop-shadow-[0_0_18px_rgba(255,200,0,0.6)]'>
                  {isLoading ? <SkeletonTheme baseColor="#202020" highlightColor="#444">
                    <Skeleton count={1} height={5} width={45} />
                  </SkeletonTheme> :
                    pool.apr === 0 ? 'Infinity' :
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
                  TVL:
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
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4,
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
                </SkeletonTheme> : `${formatTokenBalanceFromFarm()}`}
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
                    {formatTokenBalanceFromFarmUSDC()}
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
                  {`$${env.VITE_APP_SAVVY_NAME?.toUpperCase()}`}
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
        navigator.clipboard.writeText(token0.id);
        toast.dismiss();
        toast('Copied address', {
          position: 'top-center'
        })
      }}>
        <h3 className='text-white sm:text-14 text-14 font-normal' style={{ marginRight: 10 }}>
          {token0 ? token0.symbol.toUpperCase() : ''}: {pool.token0 ? `${token0.id.substring(0, 10)}...${token0.id.substring(token0.id.length - 10, token0.id.length)}` : ''}
        </h3>
      </div>
      <div className="clickable-div" style={{ display: 'flex', alignItems: 'center', marginTop: 4 }} onClick={() => {
        navigator.clipboard.writeText(token1.id);
        toast.dismiss();
        toast('Copied address', {
          position: 'top-center'
        })
      }}>
        <h3 className='text-white sm:text-14 text-14 font-normal' style={{ marginRight: 10 }}>
          {token1 ? token1.symbol.toUpperCase() : ''}: {pool.token1 ? `${token1.id.substring(0, 10)}...${token1.id.substring(token1.id.length - 10, token1.id.length)}` : ''}
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
            <button className='clickable-div' onClick={isAppChain(Number(chainId)) ? handleIsDeposit : openNetworkModal} disabled={isLoadingDeposit} type="button" style={{
              width: '100%', padding: 10, borderRadius: 10, border: 'none',
              background: 'linear-gradient(to right, #29317D, #019CAD)'
            }}><h3 color={'white'} style={{ color: '#fff' }}>
                {isAppChain(Number(chainId)) ? 'DEPOSIT' : 'WRONG CHAIN'}
              </h3></button>
          </div>
          <ActionButtonSeparator />
          <div style={{ flex: 1 }}>
            <button className='clickable-div' onClick={isAppChain(Number(chainId)) ? handleIsWithdraw : openNetworkModal} disabled={isLoadingDeposit} type="button" style={{
              width: '100%', padding: 10, borderRadius: 10, border: 'none',
              background: 'linear-gradient(to right, #29317D, #FFA62E)'
            }}><h3 color={'white'} style={{ color: '#fff' }}>
                {isAppChain(Number(chainId)) ? 'WITHDRAW' : 'WRONG CHAIN'}
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
  </ElectricBorderShow>
}

export default FarmPoolCard;