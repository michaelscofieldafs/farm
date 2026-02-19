/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable react/prop-types */

'use client'

import { wagmiAdapter } from '@/components/Web3Provider';
import { ZERO_ADDRESS } from '@/utils/constants';
import { fetchChainBase } from '@/utils/helpers';
import { getPairContractV2ABIByChainId } from '@/utils/pairContractABIProvider';
import { getTokenContractABIByChainId } from '@/utils/tokenContractABIProvider';
import { useAppKitNetwork } from '@reown/appkit/react';
import { readContract, readContracts, watchBlocks } from '@wagmi/core';
import { createContext, useEffect, useRef, useState } from "react";
import { Abi, Address, parseEther } from 'viem';
import { base, bsc, bscTestnet } from 'viem/chains';
import { getBlocksPerYearByChainId } from '../utils/blocksPerYearProvider';
import { getMasterchefABIByChainId } from '../utils/masterChefABIProvider';
import { getMastChefAddressByChainId } from '../utils/masterchefAddressProvider';
import { getRouterABIByChainId } from '../utils/routerABIProvider';
import { getRouterAddressByChainId } from '../utils/routerProvider';
import { getSavvyTokenByChainId, getStableTokenByChainId, getUSDTTokenByChainId } from '../utils/tokenAddressProvider';
import { PoolLP, PoolSingle } from './interfaces';

import { parseUnits } from "viem";

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
  fetchDataFarm: () => void;
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
  fetchDataFarm: () => { },
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
  const chainIdRef = useRef(fetchChainBase(Number(chainId)));

  const unwrap = (res: any, fallback: any): any => {
    if (!res || res.status !== 'success') return fallback;
    return res.result as any;
  };

  const fetchPoolsFromMasterchef = async (savvyTokenPriceUSDC = 0, stableTokenPriceUSDC = 0) => {
    setIsLoadingPoolsFarm(true);

    try {
      const chainIdBase = fetchChainBase(Number(chainIdRef.current));
      const masterChefAddress = getMastChefAddressByChainId(chainIdBase);

      //console.log("ReadContrat")
      const [poolLengthRaw, savvyPerBlockRaw, totalAllocPointRaw] =
        await readContracts(wagmiAdapter.wagmiConfig, {
          contracts: [
            {
              address: masterChefAddress as Address,
              abi: getMasterchefABIByChainId(chainIdBase) as Abi,
              functionName: 'poolLength',
              chainId: chainIdBase,
            },
            {
              address: masterChefAddress as Address,
              abi: getMasterchefABIByChainId(chainIdBase) as Abi,
              functionName: 'savvyPerBlock',
              chainId: chainIdBase,
            },
            {
              address: masterChefAddress as Address,
              abi: getMasterchefABIByChainId(chainIdBase) as Abi,
              functionName: 'totalAllocPoint',
              chainId: chainIdBase,
            },
          ],
          allowFailure: true
        },);

      const poolLength = Number(unwrap(poolLengthRaw, 0));
      const savvyPerBlock = Number(unwrap(savvyPerBlockRaw, 0)) / 1e18;
      const totalAllocPoint = Number(unwrap(totalAllocPointRaw, 1));

      //console.log(`Masterchef Info: Pools ${poolLength}, SavvyPerBlock: ${savvyPerBlock}, TotalAllocPoint: ${totalAllocPoint}`);

      setFarmTokenPerBlock(savvyPerBlock);

      const poolPromises = Array.from({ length: poolLength }, (_, i) =>
        (async () => {
          //console.log(`Fetching pool ${i + 1} of ${poolLength}`);
          try {
            const poolInfo = await readContract(wagmiAdapter.wagmiConfig, {
              address: masterChefAddress as Address,
              abi: getMasterchefABIByChainId(chainIdBase) as Abi,
              functionName: 'poolInfo',
              args: [i],
              chainId: chainIdBase,
            }) as any;
            if (!poolInfo) return null;

            const lpToken = poolInfo?.lpToken ?? poolInfo?.[0];
            const allocPoint = poolInfo?.allocPoint ?? poolInfo?.[1] ?? 0;
            const depositFeeBP = poolInfo?.depositFeeBP ?? poolInfo?.[4] ?? 0;

            if (!lpToken) return null;

            let symbol = '';

            try {
              const result = await readContract(wagmiAdapter.wagmiConfig, {
                address: lpToken as Address,
                abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                functionName: 'symbol',
                chainId: chainIdBase,
              });

              symbol = (result as string).toUpperCase();
            } catch {
              symbol = '';
            }

            if (symbol === null) return null;

            // LP Pool
            if (symbol.endsWith('-LP') || symbol.includes('LP') || symbol.includes('UNI-V2') || symbol === '' || symbol.includes('V-')) {

              //console.log("ReadContrat")
              // Fetch base if of pair contract
              const [
                token0Res,
                token1Res,
                reservesRes,
                farmBalanceRes,
                totalSupplyRes,
                decimalsRes,
              ] = await readContracts(wagmiAdapter.wagmiConfig, {
                allowFailure: true,
                contracts: [
                  {
                    address: lpToken as Address,
                    abi: getPairContractV2ABIByChainId(chainIdBase) as Abi,
                    functionName: 'token0',
                    chainId: chainIdBase,
                  },
                  {
                    address: lpToken as Address,
                    abi: getPairContractV2ABIByChainId(chainIdBase) as Abi,
                    functionName: 'token1',
                    chainId: chainIdBase,
                  },
                  {
                    address: lpToken as Address,
                    abi: getPairContractV2ABIByChainId(chainIdBase) as Abi,
                    functionName: 'getReserves',
                    chainId: chainIdBase,
                  },
                  {
                    address: lpToken as Address,
                    abi: getPairContractV2ABIByChainId(chainIdBase) as Abi,
                    functionName: 'balanceOf',
                    args: [masterChefAddress as Address],
                    chainId: chainIdBase,
                  },
                  {
                    address: lpToken as Address,
                    abi: getPairContractV2ABIByChainId(chainIdBase) as Abi,
                    functionName: 'totalSupply',
                    chainId: chainIdBase,
                  },
                  {
                    address: lpToken as Address,
                    abi: getPairContractV2ABIByChainId(chainIdBase) as Abi,
                    functionName: 'decimals',
                    chainId: chainIdBase,
                  },
                ],
              });

              const token0Address = token0Res?.result ?? ZERO_ADDRESS;
              const token1Address = token1Res?.result ?? ZERO_ADDRESS;
              const reserves = reservesRes?.result ?? [0, 0, 0] as any;
              const farmBalance = farmBalanceRes?.result ?? 0;
              const totalSupply = totalSupplyRes?.result ?? 1;
              const decimals = Number(decimalsRes?.result ?? 18);

              // If both token is null break
              if (!token0Address || !token1Address) return null;
              //console.log("ReadContrat")
              // Basic if of tokens
              const [
                decimals0Res,
                symbol0Res,
                name0Res,
                decimals1Res,
                symbol1Res,
                name1Res,
              ] = await readContracts(
                wagmiAdapter.wagmiConfig,
                {
                  allowFailure: true,
                  contracts: [
                    // token0
                    {
                      address: token0Address as Address,
                      abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                      functionName: 'decimals',
                      chainId: chainIdBase,
                    },
                    {
                      address: token0Address as Address,
                      abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                      functionName: 'symbol',
                      chainId: chainIdBase,
                    },
                    {
                      address: token0Address as Address,
                      abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                      functionName: 'name',
                      chainId: chainIdBase,
                    },

                    // token1
                    {
                      address: token1Address as Address,
                      abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                      functionName: 'decimals',
                      chainId: chainIdBase,
                    },
                    {
                      address: token1Address as Address,
                      abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                      functionName: 'symbol',
                      chainId: chainIdBase,
                    },
                    {
                      address: token1Address as Address,
                      abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                      functionName: 'name',
                      chainId: chainIdBase,
                    },
                  ],
                }
              );

              const decimals0 = Number(decimals0Res.result ?? 18);
              const symbol0 = symbol0Res.result ?? '';
              const name0 = name0Res.result ?? '';

              const decimals1 = Number(decimals1Res.result ?? 18);
              const symbol1 = symbol1Res.result ?? '';
              const name1 = name1Res.result ?? '';

              // Fetch prices of tokens in pair
              const [price0, price1] = await Promise.all([
                fetchTokenPriceV2(token0Address as Address, savvyTokenPriceUSDC, stableTokenPriceUSDC).catch(() => 0),
                fetchTokenPriceV2(token1Address as Address, savvyTokenPriceUSDC, stableTokenPriceUSDC).catch(() => 0),
              ]);

              // Calculate TVL pool
              const tvlTotal = (Number(price0) * Number(reserves[0]) / 10 ** decimals0) +
                (Number(price1) * Number(reserves[1]) / 10 ** decimals1);

              const tvlFarm = ((Number(farmBalance) / 10 ** Number(decimals)) * tvlTotal) / (Number(totalSupply) / 10 ** 18 || 1);

              // Calculate APR of pool
              const blocksPerYear: number = getBlocksPerYearByChainId(chainIdBase);
              const poolTokensPerBlock = savvyPerBlock * (Number(allocPoint) / totalAllocPoint);
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
            const [decimalsRes, balanceRes, symbolRes, nameRes] = await readContracts(
              wagmiAdapter.wagmiConfig,
              {
                allowFailure: true,
                contracts: [
                  {
                    address: lpToken as Address,
                    abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                    functionName: 'decimals',
                    chainId: chainIdBase,
                  },
                  {
                    address: lpToken as Address,
                    abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                    functionName: 'balanceOf',
                    args: [masterChefAddress as Address],
                    chainId: chainIdBase,
                  },
                  {
                    address: lpToken as Address,
                    abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                    functionName: 'symbol',
                    chainId: chainIdBase,
                  },
                  {
                    address: lpToken as Address,
                    abi: getTokenContractABIByChainId(chainIdBase) as Abi,
                    functionName: 'name',
                    chainId: chainIdBase,
                  },
                ],
              }
            );
            const price = await
              fetchTokenPriceV2(lpToken, savvyTokenPriceUSDC, stableTokenPriceUSDC).catch(() => 0)

            const decimals = Number(decimalsRes.result ?? 18);
            const farmBalance = balanceRes.result ?? 0;
            const symbolToken = symbolRes.result ?? '';
            const nameToken = nameRes.result ?? '';

            // Calculate TVL pool
            const tvl = (Number(farmBalance) / 10 ** decimals) * price;

            //Calculate APR pool
            const blocksPerYear = getBlocksPerYearByChainId(chainIdBase);
            const poolTokensPerBlock = savvyPerBlock * (Number(allocPoint) / totalAllocPoint);
            const totalRewardPricePerYear = savvyTokenPriceUSDC * poolTokensPerBlock * blocksPerYear;
            const apr = tvl > 0 ? (totalRewardPricePerYear / tvl) * 100 : 0;

            //console.log(`Single Token ${nameToken} (${symbolToken}) - Decimals: ${decimals}\nPrice: ${price}\nTvl: ${tvl}\nAPR: ${apr}`);

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
      let poolList = await Promise.all(poolPromises);

      poolList = poolList.filter(item => item != null);

      const poolsLp: PoolLP[] = poolList.filter(p => p && p.token0) as PoolLP[];
      const poolsSingleSided: PoolSingle[] = poolList.filter(p => p && !p.token0) as PoolSingle[];

      // Sort by multiplier descending
      const poolsLpSorted = poolsLp.slice().sort((a, b) => (b.multiplier || 0) - (a.multiplier || 0));
      const poolsSingleSidedSorted = poolsSingleSided.slice().sort((a, b) => (b.multiplier || 0) - (a.multiplier || 0));

      // Total farm TVL
      const totalTvl = [...poolsLpSorted, ...poolsSingleSidedSorted].reduce((acc, pool) => acc + (pool?.tvl || 0), 0);

      // Set farm info
      setPoolsFarm(poolsLpSorted);
      setPoolsTokenFarm(poolsSingleSidedSorted);
      setTvl(totalTvl);

      return poolsLpSorted;
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
      if (getSavvyTokenByChainId(Number(chainIdRef.current)).toLowerCase() == address.toLowerCase()) return savvyPriceUSDC;
      if (getStableTokenByChainId(Number(chainIdRef.current)).toLowerCase() == address.toLowerCase()) return stableTokenPriceUSDC;
      if (getUSDTTokenByChainId(Number(chainIdRef.current)).toLowerCase() == address.toLowerCase()) return 1;

      const price = await calcTokenPrice(address);
      return price;
    } catch (err) {
      return 0;
    }
  }

  // Fetch all data farm
  const fetchDataFarm = async () => {
    try {
      // Prices of stable token prices in USDC
      //console.log("carregando os precos da chain " + chainIdRef.current)
      switch (chainIdRef.current) {
        case bsc.id:
        case bscTestnet.id:
        case base.id: {
          // Prices of stable token prices in USDC
          const [stableTokenPriceUSD, farmTokenUSDC] = await Promise.all([
            calcStableTokenPriceInUSDCPancake(),
            calcTokenPriceInUSDCViaNativePancake(getSavvyTokenByChainId(Number(chainIdRef.current))),
          ]);

          //console.log("Preço token nativo usdc " + stableTokenPriceUSD);
          //console.log("Preço savvy token usdc " + farmTokenUSDC);

          setStableTokenUSDCPrice(stableTokenPriceUSD);
          setFarmTokenUSDCPrice(farmTokenUSDC);


          fetchCirculatingSupply(farmTokenUSDC);
          await fetchPoolsFromMasterchef(farmTokenUSDC, stableTokenPriceUSD);

          break;
        }

        default: {
          const [stableTokenPriceUSD, savvyTokenPrice] = await Promise.all([
            calcStableTokenPriceInUSDCShadow(),
            calcTokenPriceUSDCSingleCallShadow(getSavvyTokenByChainId(Number(chainIdRef.current)))
          ]);

          setStableTokenUSDCPrice(stableTokenPriceUSD);
          setFarmTokenUSDCPrice(savvyTokenPrice);

          //console.log("Preço stable token usdc " + stableTokenPriceUSD);
          //console.log("Preço savvy token usdc " + savvyTokenPrice);

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
      const totalSupplyRaw = await readContract(wagmiAdapter.wagmiConfig, {
        address: getSavvyTokenByChainId(Number(chainIdRef.current)) as Address,
        abi: getTokenContractABIByChainId(Number(chainIdRef.current)),
        functionName: 'totalSupply',
        chainId: Number(chainIdRef.current),
      })

      const totalSupply =
        Number(totalSupplyRaw) / 10 ** 18

      setCirculatingSupply(totalSupply)
      setMarketCap(totalSupply * tokenPrice)

    } catch (err) {
      throw err
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
  const calcTokenPrice = async (tokenAddress: string): Promise<number> => {

    switch (chainIdRef.current) {
      case bsc.id:
      case bscTestnet.id:
      case base.id: {
        const price = await calcTokenPriceInUSDCViaNativePancake(tokenAddress);

        return price;
      }
      default: {
        return calcTokenPriceUSDCSingleCallShadow(tokenAddress);
      }
    }
  }

  /**
 * 
 * @param tokenAddress Address of the token that will be pegged to the stablecoin.
 * @returns Return the price of a specific token based on the chain's stablecoin
 */
  const calcTokenPriceUSDCSingleCallShadow = async (
    tokenAddress: string
  ): Promise<number> => {
    try {
      const chainId = Number(chainIdRef.current)
      const amountIn = parseEther("1");

      const savvyToken = getSavvyTokenByChainId(chainId).toLowerCase()
      const specialToken = '0x50c42dEAcD8Fc9773493ED674b675bE577f2634b'.toLowerCase()

      const routerAddress =
        tokenAddress.toLowerCase() === savvyToken ||
          tokenAddress.toLowerCase() === specialToken
          ? '0x7635cD591CFE965bE8beC60Da6eA69b6dcD27e4b'.toLowerCase()
          : getRouterAddressByChainId(chainId).toLowerCase()

      const usdcAddress = getUSDTTokenByChainId(chainId)
      const wrappedNative = getStableTokenByChainId(chainId)

      const usdcDecimals = await readContract(wagmiAdapter.wagmiConfig, {
        address: usdcAddress as Address,
        abi: getTokenContractABIByChainId(chainId),
        functionName: 'decimals',
        chainId,
      })

      const routes =
        tokenAddress.toLowerCase() === savvyToken ||
          tokenAddress.toLowerCase() === specialToken
          ? [
            [tokenAddress, wrappedNative, false],
            [wrappedNative, usdcAddress, false],
          ]
          : [
            {
              from: tokenAddress,
              to: wrappedNative,
              stable: false,
            },
            {
              from: wrappedNative,
              to: usdcAddress,
              stable: false,
            },
          ]

      const amounts = await readContract(wagmiAdapter.wagmiConfig, {
        address: routerAddress as Address,
        abi: getRouterABIByChainId(chainId),
        functionName: 'getAmountsOut',
        args: [amountIn, routes],
        chainId,
      }) as bigint[]

      const usdcOut =
        Number(amounts[amounts.length - 1]) /
        10 ** Number(usdcDecimals)

      if (tokenAddress.toLowerCase() === specialToken) {
        console.log('routes ' + JSON.stringify(routes))
        console.log('amounts ' + amounts)
        console.log('usdcOut ' + usdcOut)
      }

      return usdcOut

    } catch {
      return 0
    }
  }

  /**
   * 
   * @returns Returns the value of the chain’s stablecoin in USDC
   */
  const calcStableTokenPriceInUSDCShadow = async (): Promise<number> => {
    try {
      const chainId = Number(chainIdRef.current)

      const amountIn = parseEther('1') // equivalente ao toWei("1", "ether")

      const routerAddress = getRouterAddressByChainId(chainId)
      const usdtAddress = getUSDTTokenByChainId(chainId)
      const stableTokenAddress = getStableTokenByChainId(chainId)

      // ===== pegar decimals =====
      const decimals = await readContract(wagmiAdapter.wagmiConfig, {
        address: usdtAddress as Address,
        abi: getTokenContractABIByChainId(chainId),
        functionName: 'decimals',
        chainId,
      })

      // ===== montar routes =====
      const routes = [
        [stableTokenAddress, usdtAddress, false]
      ]

      // ===== getAmountsOut =====
      const amountOut = await readContract(wagmiAdapter.wagmiConfig, {
        address: routerAddress as Address,
        abi: getRouterABIByChainId(chainId),
        functionName: 'getAmountsOut',
        args: [amountIn, routes],
        chainId,
      }) as bigint[]

      const result =
        Number(amountOut[1]) /
        10 ** Number(decimals)

      return result

    } catch {
      return 0
    }
  }

  const getTokenInAmount = (address: string): string => {
    if (address == "0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb") {
      return "0.0001";
    }
    else if (address == "0xe0CC881E977006488D694148223eAdb5eF207275") {
      return "4";
    }
    else if (address == "0x2e0373a6BDB34815F4a0a58CA2F8bbaf455F5dE6") {
      return "6";
    }

    return "4";
  };

  const calcTokenPriceInUSDCViaNativePancake = async (
    tokenAddress: string
  ): Promise<number> => {
    try {
      const chainId = Number(chainIdRef.current)

      const routerAddress = getRouterAddressByChainId(chainId)
      const usdcAddress = getUSDTTokenByChainId(chainId)
      const nativeWrapped = getStableTokenByChainId(chainId)

      // ===== token decimals =====
      const tokenDecimals = Number(
        await readContract(wagmiAdapter.wagmiConfig, {
          address: tokenAddress as Address,
          abi: getTokenContractABIByChainId(chainId),
          functionName: 'decimals',
          chainId,
        })
      )

      const tokenAmountInput = getTokenInAmount(tokenAddress)

      const oneToken = parseUnits(tokenAmountInput, tokenDecimals)

      // ===== path (pancake style) =====
      const path = [tokenAddress, nativeWrapped, usdcAddress]

      // ===== getAmountsOut =====
      const amountsOut = await readContract(wagmiAdapter.wagmiConfig, {
        address: routerAddress as Address,
        abi: getRouterABIByChainId(chainId),
        functionName: 'getAmountsOut',
        args: [oneToken, path],
        chainId,
      }) as bigint[]

      if (!amountsOut || !amountsOut[2]) return 0

      // ===== usdc decimals =====
      const usdcDecimals = Number(
        await readContract(wagmiAdapter.wagmiConfig, {
          address: usdcAddress as Address,
          abi: getTokenContractABIByChainId(chainId),
          functionName: 'decimals',
          chainId,
        })
      )

      const price =
        (Number(amountsOut[2]) / 10 ** usdcDecimals) /
        Number(tokenAmountInput)

      console.log(`Price token ${tokenAddress} in USDC: ${Number(amountsOut[2]) / 10 ** usdcDecimals}`)
      console.log('tokenAmountInput ' + tokenAmountInput)

      return price *
        (tokenAddress === "0x2e0373a6BDB34815F4a0a58CA2F8bbaf455F5dE6"
          ? 1.2
          : 1)

    } catch {
      return 0
    }
  }

  /**
   * 
   * @returns Returns the value of the chain’s stablecoin in USDC
   */
  const calcStableTokenPriceInUSDCPancake = async (): Promise<number> => {
    try {
      const chainId = Number(chainIdRef.current)

      const amountIn = parseEther('1') // equivalente ao toWei("1", "ether")

      const routerAddress = getRouterAddressByChainId(chainId)
      const usdcAddress = getUSDTTokenByChainId(chainId)
      const stableTokenAddress = getStableTokenByChainId(chainId)

      // ===== pegar decimals do USDC =====
      const decimals = Number(
        await readContract(wagmiAdapter.wagmiConfig, {
          address: usdcAddress as Address,
          abi: getTokenContractABIByChainId(chainId),
          functionName: 'decimals',
          chainId,
        })
      )

      // ===== getAmountsOut (pancake path) =====
      const amountOut = await readContract(wagmiAdapter.wagmiConfig, {
        address: routerAddress as Address,
        abi: getRouterABIByChainId(chainId),
        functionName: 'getAmountsOut',
        args: [
          amountIn,
          [stableTokenAddress, usdcAddress]
        ],
        chainId,
      }) as bigint[]

      const result =
        Number(amountOut[1]) /
        10 ** decimals

      return result

    } catch {
      return 0
    }
  }

  // Clear all farm data
  const clearFarmData = (): void => {
    //console.log('clear farm data');
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
      /**
      if (!supportedChains.includes(Number(chainId))) {
        return;
      }
      */

      //console.log(`Change network to ${chainId}`);
      chainIdRef.current = Number(fetchChainBase(Number(chainId)));
      clearFarmData();
      fetchData();
    }
  }, [chainId]);

  useEffect(() => {
    try {
      const unwatch = watchBlocks(wagmiAdapter.wagmiConfig, {
        chainId: Number(fetchChainBase(chainIdRef.current)),
        blockTag: 'latest',
        pollingInterval: 10000,
        onBlock(block) {
          //console.log(`Block ${block.number} of ${chainIdRef.current}`);
          fetchDataFarm();
        },
        onError(error) {
          clearFarmData();
          unwatch();
        },
      });
      return () => unwatch();
    }
    catch (err) {
      clearFarmData();
    }
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
      fetchDataFarm,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider };

