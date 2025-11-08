/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable react/prop-types */

'use client'

import { wagmiAdapter } from '@/components/Web3Provider';
import { getPairContractV2ABIByChainId } from '@/utils/pairContractABIProvider';
import { getTokenContractABIByChainId } from '@/utils/tokenContractABIProvider';
import { useAppKitNetwork } from '@reown/appkit/react';
import { watchBlocks } from '@wagmi/core';
import { createContext, useEffect, useRef, useState } from "react";
import Web3 from "web3";
import { getBlocksPerYearByChainId } from '../utils/blocksPerYearProvider';
import { safeCall } from '../utils/functions';
import { getMasterchefABIByChainId } from '../utils/masterChefABIProvider';
import { getMastChefAddressByChainId } from '../utils/masterchefAddressProvider';
import { getRouterABIByChainId } from '../utils/routerABIProvider';
import { getRouterAddressByChainId } from '../utils/routerProvider';
import { getRpcProviderByChainId } from '../utils/rpcProviderUtils';
import { getSavvyTokenByChainId, getStableTokenByChainId, getUSDTTokenByChainId } from '../utils/tokenAddressProvider';
import { PoolLP, PoolSingle } from './interfaces';
import { base, bsc, bscTestnet } from 'viem/chains';

interface AppContextType {
  stableTokenUSDCPrice: number;
  farmTokenPrice: number;
  farmTokenUSDCPrice: number;
  marketCap: number;
  tvl: number;
  farmTokenPerBlock: number;
  isLoading: boolean;
  circulatingSupply: number;
  isLoadingTvl: boolean;
  poolsFarm: PoolLP[];
  poolsTokenFarm: PoolSingle[];
  isLoadingPoolsFarm: boolean;
}

export const AppContext = createContext<AppContextType>({
  stableTokenUSDCPrice: 0,
  farmTokenPrice: 0,
  farmTokenUSDCPrice: 0,
  marketCap: 0,
  tvl: 0,
  farmTokenPerBlock: 0,
  isLoading: false,
  circulatingSupply: 0,
  isLoadingTvl: false,
  poolsFarm: [],
  poolsTokenFarm: [],
  isLoadingPoolsFarm: false,
});

const AppContextProvider = ({ children }: any) => {
  const [stableTokenUSDCPrice, setStableTokenUSDCPrice] = useState(0);
  const [farmTokenPrice, setFarmTokenPrice] = useState(0);
  const [farmTokenUSDCPrice, setFarmTokenUSDCPrice] = useState(0);
  const [tvl, setTvl] = useState(0);
  const [farmTokenPerBlock, setFarmTokenPerBlock] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTvl, setIsLoadingTvl] = useState(true);
  const [circulatingSupply, setCirculatingSupply] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  const [poolList, setPoolList] = useState([]);;
  const [poolsFarm, setPoolsFarm] = useState<PoolLP[]>([]);
  const [poolsTokenFarm, setPoolsTokenFarm] = useState<PoolSingle[]>([]);
  const [isLoadingPoolsFarm, setIsLoadingPoolsFarm] = useState(true);
  const { chainId } = useAppKitNetwork();
  const web3Ref = useRef(new Web3(getRpcProviderByChainId(Number(chainId))));
  const chainIdRef = useRef(chainId);

  const fetchPoolsFromMasterchef = async (savvyTokenPriceUSDC = 0, stableTokenPriceUSDC = 0) => {
    setIsLoadingPoolsFarm(true);

    try {
      const chainId = Number(chainIdRef.current);
      const masterChefAddress = getMastChefAddressByChainId(chainId);
      const masterChefContract = new web3Ref.current.eth.Contract(
        getMasterchefABIByChainId(chainId),
        masterChefAddress
      );

      const poolLength = Number(await safeCall(masterChefContract.methods.poolLength(), 0));

      const novaPerBlock = Number(await safeCall(masterChefContract.methods.supernovaPerBlock(), 0)) / 10 ** 18;
      const totalAllocPoint = Number(await safeCall(masterChefContract.methods.totalAllocPoint(), 1));

      setFarmTokenPerBlock(novaPerBlock);

      const poolPromises = Array.from({ length: poolLength }, (_, i) =>
        (async () => {
          try {
            const poolInfo = await safeCall(masterChefContract.methods.poolInfo(i));
            if (!poolInfo) return null;

            const { allocPoint = 0, depositFeeBP = 0, lpToken } = poolInfo;
            if (!lpToken) return null;

            const tokenContract = new web3Ref.current.eth.Contract(getTokenContractABIByChainId(chainId), lpToken);
            const symbol = (await safeCall(tokenContract.methods.symbol(), '')).toUpperCase();

            // LP Pool
            if (symbol === '' || symbol.endsWith('-LP') || symbol.includes('LP') || symbol.includes('UNI-V2')) {
              const pairContract = new web3Ref.current.eth.Contract(getPairContractV2ABIByChainId(chainId), lpToken);

              // Fetch base if of pair contract
              const [token0Address, token1Address, reserves, farmBalance, totalSupply, decimals] = await Promise.all([
                safeCall(pairContract.methods.token0()),
                safeCall(pairContract.methods.token1()),
                safeCall(pairContract.methods.getReserves(), [0, 0]),
                safeCall(pairContract.methods.balanceOf(masterChefAddress), 0),
                safeCall(pairContract.methods.totalSupply(), 1),
                safeCall(pairContract.methods.decimals(), 18),
              ]);

              // If both token is null break
              if (!token0Address || !token1Address) return null;

              const token0 = new web3Ref.current.eth.Contract(getTokenContractABIByChainId(chainId), token0Address);
              const token1 = new web3Ref.current.eth.Contract(getTokenContractABIByChainId(chainId), token1Address);

              // Basic if of tokens
              const [decimals0, symbol0, name0] = await Promise.all([
                Number(await safeCall(token0.methods.decimals(), 18)),
                safeCall(token0.methods.symbol(), ''),
                safeCall(token0.methods.name(), ''),
              ]);

              const [decimals1, symbol1, name1] = await Promise.all([
                Number(await safeCall(token1.methods.decimals(), 18)),
                safeCall(token1.methods.symbol(), ''),
                safeCall(token1.methods.name(), ''),
              ]);

              // Fetch prices of tokens in pair
              const [price0, price1] = await Promise.all([
                fetchTokenPriceV2(token0Address, savvyTokenPriceUSDC, stableTokenPriceUSDC).catch(() => 0),
                fetchTokenPriceV2(token1Address, savvyTokenPriceUSDC, stableTokenPriceUSDC).catch(() => 0),
              ]);

              // Calculate TVL pool
              const tvlTotal = (Number(price0) * Number(reserves[0]) / 10 ** decimals0) +
                (Number(price1) * Number(reserves[1]) / 10 ** decimals1);

              const tvlFarm = ((Number(farmBalance) / 10 ** 18) * tvlTotal) / (Number(totalSupply) / 10 ** 18 || 1);

              console.log(`token ${name0} \ ${name1}\n${price0} \ ${price1} \ Tvl: ${tvlFarm}`)

              // Calculate APR of pool
              const blocksPerYear: number = getBlocksPerYearByChainId(chainId);
              const poolTokensPerBlock = novaPerBlock * (Number(allocPoint) / totalAllocPoint);
              const totalRewardPricePerYear = savvyTokenPriceUSDC * poolTokensPerBlock * blocksPerYear;
              const apr = tvlFarm > 0 ? (totalRewardPricePerYear / tvlFarm) * 100 : 0;

              return {
                token0: { id: token0Address, symbol: symbol0, name: name0, decimals: decimals0, reserves: reserves[0], price: price0 },
                token1: { id: token1Address, symbol: symbol1, name: name1, decimals: decimals1, reserves: reserves[1], price: price1 },
                fee: Number(depositFeeBP) / 100,
                multiplier: Number(allocPoint) / 100,
                poolAddress: lpToken,
                poolMasterchef: i,
                farmBalance,
                totalSupply,
                tvl: tvlFarm,
                tvlTotal,
                decimals,
                apr,
              };
            }

            // Single-sided pool
            // Basic info of token
            const [decimals, farmBalance, symbolToken, nameToken, price] = await Promise.all([
              Number(await safeCall(tokenContract.methods.decimals(), 18)),
              safeCall(tokenContract.methods.balanceOf(masterChefAddress), 0),
              safeCall(tokenContract.methods.symbol(), ''),
              safeCall(tokenContract.methods.name(), ''),
              fetchTokenPriceV2(lpToken, savvyTokenPriceUSDC, stableTokenPriceUSDC).catch(() => 0),
            ]);

            // Calculate TVL pool
            const tvl = (Number(farmBalance) / 10 ** decimals) * price;

            //Calculate APR pool
            const blocksPerYear = getBlocksPerYearByChainId(chainId);
            const poolTokensPerBlock = novaPerBlock * (Number(allocPoint) / totalAllocPoint);
            const totalRewardPricePerYear = savvyTokenPriceUSDC * poolTokensPerBlock * blocksPerYear;
            const apr = tvl > 0 ? (totalRewardPricePerYear / tvl) * 100 : 0;

            return {
              token: { id: lpToken, symbol: symbolToken, name: nameToken, decimals, price },
              fee: Number(depositFeeBP) / 100,
              multiplier: Number(allocPoint) / 100,
              poolAddress: lpToken,
              poolMasterchef: i,
              farmBalance,
              tvl,
              apr,
            };
          } catch {
            return null;
          }
        })()
      );

      // Run all the functions in parallel
      const poolList = await Promise.all(poolPromises);

      const poolsLp: PoolLP[] = poolList.filter(p => p && p.token0) as PoolLP[];
      const poolsSingleSided: PoolSingle[] = poolList.filter(p => p && !p.token0)
        .filter((v, i, self) => i === self.findIndex(t => t?.token?.name === v?.token?.name)) as PoolSingle[];

      // Total farm TVL
      const totalTvl = [...poolsLp, ...poolsSingleSided].reduce((acc, pool) => acc + (pool?.tvl || 0), 0);

      // Set farm info
      setPoolsFarm(poolsLp);
      setPoolsTokenFarm(poolsSingleSided);
      setTvl(totalTvl);

      return poolsLp;
    } catch (err) {
      console.error('Error fetching pools:', err);
      return [];
    } finally {
      setIsLoadingPoolsFarm(false);
      setIsLoadingTvl(false);
    }
  };


  // Fetch token price v2
  const fetchTokenPriceV2 = async (address: string, savvyPriceUSDC = farmTokenUSDCPrice, stableTokenPriceUSDC = stableTokenUSDCPrice) => {
    try {
      if (getSavvyTokenByChainId(chainId).toLowerCase() == address.toLowerCase()) return savvyPriceUSDC;
      if (getStableTokenByChainId(chainId).toLowerCase() == address.toLowerCase()) return stableTokenPriceUSDC;

      const price = await calcTokenPrice(address, stableTokenPriceUSDC);
      return price;
    } catch (err) {
      return 0;
    }
  }

  // Fetch all data farm
  const fetchDataFarm = async () => {
    try {
      // Prices of stable token prices in USDC
      console.log("carregando os precos da chain " + chainIdRef.current)
      switch (chainIdRef.current) {
        case bsc.id:
        case bscTestnet.id:
        case base.id: {
          // Prices of stable token prices in USDC
          const [stableTokenPriceUSD, savvyTokenStablePrice] = await Promise.all([
            calcStableTokenPriceInUSDCPancake(),
            calcTokenPriceInStableTokenPancake(getSavvyTokenByChainId(Number(chainIdRef.current)))
          ]);

          const farmTokenUSDC = savvyTokenStablePrice * stableTokenPriceUSD;

          console.log("Preço stable token usdc " + stableTokenPriceUSD);
          console.log("Preço savvy token em stable token " + savvyTokenStablePrice);
          console.log("Preço savvy token usdc " + farmTokenUSDC);

          setStableTokenUSDCPrice(stableTokenPriceUSD);
          setFarmTokenPrice(savvyTokenStablePrice);
          setFarmTokenUSDCPrice(farmTokenUSDC);


          fetchCirculatingSupply(farmTokenUSDC);
          await fetchPoolsFromMasterchef(farmTokenUSDC, stableTokenPriceUSD);

          break;
        }

        default: {
          const [stableTokenPriceUSD, savvyTokenPrice] = await Promise.all([
            calcStableTokenPriceInUSDC(),
            calcTokenPriceUSDCSingleCall(getSavvyTokenByChainId(Number(chainIdRef.current)))
          ]);

          setStableTokenUSDCPrice(stableTokenPriceUSD);
          setFarmTokenUSDCPrice(savvyTokenPrice);

          console.log("Preço stable token usdc " + stableTokenPriceUSD);
          console.log("Preço savvy token usdc " + savvyTokenPrice);

          fetchCirculatingSupply(savvyTokenPrice);
          await fetchPoolsFromMasterchef(savvyTokenPrice, stableTokenPriceUSD);

          break;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  // Fetch circtulating supply of savvy token
  const fetchCirculatingSupply = async (tokenPrice = farmTokenUSDCPrice) => {
    try {
      const tokenContract = new web3Ref.current.eth.Contract(getTokenContractABIByChainId(chainId), getSavvyTokenByChainId(Number(chainIdRef.current)));
      let totalSupply: any = await tokenContract.methods.totalSupply().call();
      totalSupply = (Number(totalSupply) / 10 ** 18);

      setCirculatingSupply(Number(totalSupply));
      setMarketCap(totalSupply * tokenPrice);
    } catch (err) {
      throw err;
    }
  }

  // Initial fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      await fetchDataFarm();
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Calculate the price of any token except Savvy and stable tokens
  const calcTokenPrice = async (tokenAddress: string, stableTokenPriceUSDC = stableTokenUSDCPrice): Promise<number> => {
    switch (chainIdRef.current) {
      case bsc.id:
      case bscTestnet.id:
      case base.id: {
        const price = await calcTokenPriceInStableTokenPancake(tokenAddress);

        return price * stableTokenPriceUSDC;
      }
      default: {
        return calcTokenPriceUSDCSingleCall(tokenAddress);
      }
    }
  }

  /**
 * 
 * @param tokenAddress Address of the token that will be pegged to the stablecoin.
 * @returns Return the price of a specific token based on the chain's stablecoin
 */
  const calcTokenPriceUSDCSingleCall = async (tokenAddress: string): Promise<number> => {
    let tokenToSell = web3Ref.current.utils.toWei("1", "ether");

    let amountOut;
    try {
      let router = new web3Ref.current.eth.Contract(getRouterABIByChainId(Number(chainIdRef.current)), getRouterAddressByChainId(Number(chainIdRef.current)).toLowerCase());
      const tokenContract = new web3Ref.current.eth.Contract(getTokenContractABIByChainId(Number(chainIdRef.current)), getUSDTTokenByChainId(Number(chainIdRef.current)));

      const decimals = await safeCall(tokenContract.methods.decimals(), 6);

      const tokenIn = tokenAddress;
      const tokenOut = getStableTokenByChainId(Number(chainIdRef.current));
      const amountIn = tokenToSell;

      const routes = [[tokenIn, tokenOut, false], [tokenOut, getUSDTTokenByChainId(Number(chainIdRef.current)), false]];

      amountOut = await router.methods.getAmountsOut(amountIn, routes).call();
      amountOut = Number(amountOut![2]) / 10 ** Number(decimals);

      return amountOut;
    } catch (error: any) {
      return 0;
    }
  }

  /**
   * 
   * @param tokenAddress Address of the token that will be pegged to the stablecoin.
   * @returns Return the price of a specific token based on the chain's stablecoin
   */
  const calcTokenPriceInStableToken = async (tokenAddress: string): Promise<number> => {
    let tokenToSell = web3Ref.current.utils.toWei("1", "ether");

    let amountOut;
    try {
      let router = new web3Ref.current.eth.Contract(getRouterABIByChainId(Number(chainIdRef.current)), getRouterAddressByChainId(Number(chainIdRef.current)).toLowerCase());

      const tokenIn = tokenAddress;
      const tokenOut = getStableTokenByChainId(Number(chainIdRef.current));
      const amountIn = tokenToSell;

      const routes = [[tokenIn, tokenOut, false]];

      amountOut = await router.methods.getAmountsOut(amountIn, routes).call();
      amountOut = Number(amountOut![1]) / 10 ** 18;

      return amountOut;
    } catch (error: any) {
      return 0;
    }
  }

  /**
   * 
   * @returns Returns the value of the chain’s stablecoin in USDC
   */
  const calcStableTokenPriceInUSDC = async (): Promise<number> => {
    let tokenToSell = web3Ref.current.utils.toWei("1", "ether");
    let amountOut;
    try {
      let router = new web3Ref.current.eth.Contract(getRouterABIByChainId(Number(chainIdRef.current)), getRouterAddressByChainId(Number(chainIdRef.current)));
      const tokenContract = new web3Ref.current.eth.Contract(getTokenContractABIByChainId(Number(chainIdRef.current)), getUSDTTokenByChainId(Number(chainIdRef.current)));

      const decimals = await safeCall(tokenContract.methods.decimals(), 6);
      const amountIn = tokenToSell;

      const routes = [[getStableTokenByChainId(Number(chainIdRef.current)), getUSDTTokenByChainId(Number(chainIdRef.current)), false]];

      amountOut = await router.methods.getAmountsOut(amountIn, routes).call();
      amountOut = Number(amountOut![1]) / 10 ** Number(decimals);

      return amountOut;
    } catch (error) {
      return 0;
    }
  }

  /**
 * 
 * @param tokenAddress Address of the token that will be pegged to the stablecoin.
 * @returns Return the price of a specific token based on the chain's stablecoin
 */
  const calcTokenPriceInStableTokenPancake = async (tokenAddress: string): Promise<number> => {
    let tokenToSell = web3Ref.current.utils.toWei("1", "ether");

    let amountOut;
    try {
      let router = new web3Ref.current.eth.Contract(getRouterABIByChainId(Number(chainIdRef.current)), getRouterAddressByChainId(Number(chainIdRef.current)).toLowerCase());
      const tokenContract = new web3Ref.current.eth.Contract(getTokenContractABIByChainId(Number(chainIdRef.current)), tokenAddress);

      const decimals = await safeCall(tokenContract.methods.decimals(), 18);

      amountOut = await router.methods.getAmountsOut(tokenToSell, [tokenAddress, getStableTokenByChainId(Number(chainIdRef.current))]).call() as any;
      amountOut = Number(amountOut[1]) / 10 ** Number(decimals);

      return amountOut;
    } catch (error: any) {
      return 0;
    }
  }

  /**
   * 
   * @returns Returns the value of the chain’s stablecoin in USDC
   */
  const calcStableTokenPriceInUSDCPancake = async (): Promise<number> => {
    let tokenToSell = web3Ref.current.utils.toWei("1", "ether");
    let amountOut;
    try {
      let router = new web3Ref.current.eth.Contract(getRouterABIByChainId(Number(chainIdRef.current)), getRouterAddressByChainId(Number(chainIdRef.current)));
      const tokenContract = new web3Ref.current.eth.Contract(getTokenContractABIByChainId(Number(chainIdRef.current)), getUSDTTokenByChainId(Number(chainIdRef.current)));

      const decimals = await safeCall(tokenContract.methods.decimals(), 6);

      amountOut = await router.methods.getAmountsOut(tokenToSell, [getStableTokenByChainId(Number(chainIdRef.current)),
      getUSDTTokenByChainId(Number(chainIdRef.current))]).call() as any;
      amountOut = Number(amountOut[1]) / 10 ** Number(decimals);

      return amountOut;
    } catch (error) {
      return 0;
    }
  }

  // Clear all farm data
  const clearFarmData = (): void => {
    console.log('clear farm data');
    setTvl(0);
    setMarketCap(0);
    setCirculatingSupply(0);
    setStableTokenUSDCPrice(0);
    setFarmTokenPrice(0);
    setFarmTokenUSDCPrice(0);
    setFarmTokenPerBlock(0);
    setPoolsFarm([]);
    setPoolsTokenFarm([]);
    setPoolList([]);
  }

  // Whenever there is a network change, we update the web3 provider that will be used.
  useEffect(() => {
    const supportedChains = wagmiAdapter.wagmiConfig.chains.map(chain => chain.id);

    // Check if the network manually selected by the wallet is compatible with the farm.
    if (chainId != null) {
      if (!supportedChains.includes(Number(chainId))) {
        return;
      }

      console.log(`Change network to ${chainId}`);
      chainIdRef.current = chainId;
      web3Ref.current = new Web3(getRpcProviderByChainId(Number(chainId)));
      clearFarmData();
      fetchData();
    }
  }, [chainId]);

  useEffect(() => {
    const unwatch = watchBlocks(wagmiAdapter.wagmiConfig, {
      chainId: Number(chainIdRef.current),
      blockTag: 'latest',
      pollingInterval: 3000,
      onBlock(block) {
        console.log(`Block ${block.number} of ${chainIdRef.current}`);
        fetchDataFarm();
      },
      onError(error) { },
    });
    return () => unwatch();
  }, [chainIdRef.current]);

  return (
    <AppContext.Provider value={{
      stableTokenUSDCPrice,
      farmTokenPrice,
      farmTokenUSDCPrice,
      tvl,
      farmTokenPerBlock,
      isLoading,
      circulatingSupply,
      marketCap,
      isLoadingTvl,
      poolsFarm,
      poolsTokenFarm,
      isLoadingPoolsFarm,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider };

