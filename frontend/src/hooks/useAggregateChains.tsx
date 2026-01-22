import { getTokenContractABIByChainId } from '@/utils/tokenContractABIProvider';
import { base, baseSepolia, bsc, bscTestnet, mainnet, monadTestnet, plasma, plasmaTestnet, sepolia, sonic, sonicBlazeTestnet } from '@reown/appkit/networks';
import { useContext, useState } from 'react';
import Web3 from 'web3';
import { safeCall } from '../utils/functions';
import { getMasterchefABIByChainId } from '../utils/masterChefABIProvider';
import { getMastChefAddressByChainId } from '../utils/masterchefAddressProvider';
import { getPairContractV2ABIByChainId } from '../utils/pairContractABIProvider';
import { getRouterABIByChainId } from '../utils/routerABIProvider';
import { getRouterAddressByChainId } from '../utils/routerProvider';
import { getRpcProviderByChainId } from '../utils/rpcProviderUtils';
import { getSavvyTokenByChainId, getStableTokenByChainId, getUSDTTokenByChainId } from '../utils/tokenAddressProvider';
import { sonicTestnet, wagmiAdapter } from '@/components/Web3Provider';
import { AppContext } from '@/context/appContext';
import { get } from 'http';
import { ZERO_ADDRESS } from '@/utils/constants';
import { Abi, Address } from 'viem';
import { readContracts } from '@wagmi/core';

interface ChainAggregateData {
    name: string;
    tvl: number;
    marketCap: number;
    circulatingSupply: number;
}

interface AggregateData {
    totalTvl: number;
    totalMarketCap: number;
    totalCirculatingSupply: number;
    dataByChain: Record<string, ChainAggregateData>; // keyed by chain name or chainId
}
export const useAggregateChains = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoaidng, setIsFirstLoading] = useState(true);
    const [data, setData] = useState<AggregateData>({
        totalTvl: 0,
        totalMarketCap: 0,
        totalCirculatingSupply: 0,
        dataByChain: {},
    });

    const fetchAggregateFarmData = async () => {
        setIsLoading(true);

        const chainList = [bscTestnet, sonicTestnet, baseSepolia];

        try {
            let totalTvl = 0;
            let totalMarketCap = 0;
            let totalCirculatingSupply = 0;

            const dataByChain: Record<string, ChainAggregateData> = {};

            const results = await Promise.all(chainList.map(async (chain) => {
                const web3 = new Web3(getRpcProviderByChainId(chain.id));
                const masterChefAddress = getMastChefAddressByChainId(chain.id);
                const masterChefContract = new web3.eth.Contract(getMasterchefABIByChainId(chain.id), masterChefAddress);

                const mainTokenAddress = getSavvyTokenByChainId(chain.id);


                let decimals;
                if (!mainTokenAddress || mainTokenAddress === '0x0000000000000000000000000000000000000000') {
                    decimals = 18;
                } else {
                    const tokenContract = new web3.eth.Contract(getTokenContractABIByChainId(chain.id), mainTokenAddress);
                    decimals = await tokenContract.methods.decimals().call();
                }

                const mainTokenContract = new web3.eth.Contract(getTokenContractABIByChainId(chain.id), mainTokenAddress);

                const circulatingSupply = Number(await safeCall(mainTokenContract.methods.totalSupply(), 0)) / 10 ** Number(decimals);
                const tokenPrice = await fetchTokenPriceV2(mainTokenAddress, chain.id).catch(() => 0);

                const marketCap = circulatingSupply * tokenPrice;

                // Fetch pools of Masterchef
                const poolLength = Number(await safeCall(masterChefContract.methods.poolLength(), 0));

                const poolPromises = Array.from({ length: poolLength }, (_, i) =>
                    (async () => {
                        try {
                            const poolInfo = await safeCall(masterChefContract.methods.poolInfo(i));
                            if (!poolInfo) return 0;

                            const { lpToken } = poolInfo;
                            if (!lpToken) return 0;

                            const tokenContract = new web3.eth.Contract(getTokenContractABIByChainId(chain.id), lpToken);
                            const symbol = (await safeCall(tokenContract.methods.symbol(), '')).toUpperCase();

                            // LP Pool
                            if (symbol.endsWith('-LP') || symbol.includes('LP') || symbol.includes('UNI-V2')) {
                                const [
                                    token0Res,
                                    token1Res,
                                    reservesRes,
                                    farmBalanceRes,
                                    decimalsRes,
                                    totalSupplyRes,
                                ] = await readContracts(wagmiAdapter.wagmiConfig, {
                                    allowFailure: true,
                                    contracts: [
                                        {
                                            address: lpToken as Address,
                                            abi: getPairContractV2ABIByChainId(chain.id) as Abi,
                                            functionName: 'token0',
                                            chainId: chain.id,
                                        },
                                        {
                                            address: lpToken as Address,
                                            abi: getPairContractV2ABIByChainId(chain.id) as Abi,
                                            functionName: 'token1',
                                            chainId: chain.id,
                                        },
                                        {
                                            address: lpToken as Address,
                                            abi: getPairContractV2ABIByChainId(chain.id) as Abi,
                                            functionName: 'getReserves',
                                            chainId: chain.id,
                                        },
                                        {
                                            address: lpToken as Address,
                                            abi: getPairContractV2ABIByChainId(chain.id) as Abi,
                                            functionName: 'balanceOf',
                                            args: [masterChefAddress as Address],
                                            chainId: chain.id,
                                        },
                                        {
                                            address: lpToken as Address,
                                            abi: getPairContractV2ABIByChainId(chain.id) as Abi,
                                            functionName: 'decimals',
                                            chainId: chain.id,
                                        },
                                        {
                                            address: lpToken as Address,
                                            abi: getPairContractV2ABIByChainId(chain.id) as Abi,
                                            functionName: 'totalSupply',
                                            chainId: chain.id,
                                        },
                                    ],
                                });

                                const token0Address = token0Res?.result ?? ZERO_ADDRESS;
                                const token1Address = token1Res?.result ?? ZERO_ADDRESS;
                                const reserves = reservesRes?.result ?? [0, 0, 0];
                                const farmBalance = farmBalanceRes?.result ?? 0;
                                const decimals = Number(decimalsRes?.result ?? 18);
                                const totalSupply = totalSupplyRes?.result ?? 1;

                                if (!token0Address || !token1Address) return 0;

                                const token0 = new web3.eth.Contract(getTokenContractABIByChainId(chain.id), token0Address);
                                const token1 = new web3.eth.Contract(getTokenContractABIByChainId(chain.id), token1Address);

                                const [decimals0, decimals1] = await Promise.all([
                                    Number(await safeCall(token0.methods.decimals(), 18)),
                                    Number(await safeCall(token1.methods.decimals(), 18)),
                                ]);

                                const [price0, price1] = await Promise.all([
                                    fetchTokenPriceV2(token0Address as Address, chain.id).catch(() => 0),
                                    fetchTokenPriceV2(token1Address as Address, chain.id).catch(() => 0),
                                ]);

                                const tvlTotal = (Number(price0) * Number(reserves[0]) / 10 ** decimals0) +
                                    (Number(price1) * Number(reserves[1]) / 10 ** decimals1);

                                const tvlFarm = ((Number(farmBalance) / 10 ** decimals) * tvlTotal) / (Number(totalSupply) / 10 ** decimals || 1);

                                return tvlFarm;
                            }

                            // Single-sided pool
                            const [decimals, farmBalance, price] = await Promise.all([
                                Number(await safeCall(tokenContract.methods.decimals(), 18)),
                                safeCall(tokenContract.methods.balanceOf(masterChefAddress), 0),
                                fetchTokenPriceV2(lpToken, chain.id).catch(() => 0),
                            ]);

                            //console.log('Single-sided pool:', lpToken, 'Price:', price, 'Chain:', chain.name, 'farmBalance:', farmBalance);

                            return (Number(farmBalance) / 10 ** decimals) * price;
                        } catch {
                            return 0;
                        }
                    })()
                );

                const poolTvls = await Promise.all(poolPromises);
                const chainTvl = poolTvls.reduce((acc, val) => acc + val, 0);

                // By chain
                dataByChain[chain.id] = { tvl: chainTvl, marketCap, circulatingSupply, name: chain.name };

                return { tvl: chainTvl, marketCap, circulatingSupply };
            }));

            // Sum results of all chains
            results.forEach(r => {
                totalTvl += r.tvl;
                totalMarketCap += r.marketCap;
                totalCirculatingSupply += r.circulatingSupply;
            });

            setData({ totalTvl, totalMarketCap, totalCirculatingSupply, dataByChain });

        } catch (err) {
            console.error('Error fetching aggregate farm data:', err);
            setData({
                totalTvl: 0,
                totalMarketCap: 0,
                totalCirculatingSupply: 0,
                dataByChain: {},
            });
        } finally {
            setIsLoading(false);
            setIsFirstLoading(false);
        }
    };
    // Fetch token price v2
    const fetchTokenPriceV2 = async (address: string, chainId: number) => {
        try {
            if (getUSDTTokenByChainId(chainId).toLowerCase() == address.toLowerCase()) return 1;

            const price = await calcTokenPrice(address, chainId);
            return price;
        } catch (err) {
            return 0;
        }
    }


    // Calculate the price of any token except Savvy and stable tokens
    const calcTokenPrice = async (tokenAddress: string, chainId: number): Promise<number> => {
        switch (chainId) {
            case bsc.id:
            case bscTestnet.id:
            case base.id: {
                if (getStableTokenByChainId(chainId).toLowerCase() === tokenAddress.toLowerCase()) {
                    const price = await calcStableTokenPriceInUSDCPancake(chainId);
                    return price;
                }
                else {
                    const price = await calcTokenPriceInUSDCViaNativePancake(tokenAddress, chainId);

                    return price;
                }
            }
            default: {
                if (getStableTokenByChainId(chainId).toLowerCase() === tokenAddress.toLowerCase()) {
                    const price = await calcStableTokenPriceInUSDCShadow(chainId);
                    return price;
                }
                else {
                    const price = await calcTokenPriceUSDCSingleCallShadow(tokenAddress, chainId);

                    return price;
                }
            }
        }
    }

    const calcStableTokenPriceInUSDCShadow = async (chainId: number): Promise<number> => {
        const web3 = new Web3(getRpcProviderByChainId(chainId));

        let tokenToSell = web3.utils.toWei("1", "ether");
        let amountOut;
        try {
            let router = new web3.eth.Contract(getRouterABIByChainId(chainId), getRouterAddressByChainId(chainId));
            const tokenContract = new web3.eth.Contract(getTokenContractABIByChainId(chainId), getUSDTTokenByChainId(chainId));

            const decimals = await safeCall(tokenContract.methods.decimals(), 6);
            const amountIn = tokenToSell;

            const routes = [[getStableTokenByChainId(chainId), getUSDTTokenByChainId(chainId), false]];

            amountOut = await router.methods.getAmountsOut(amountIn, routes).call();
            amountOut = Number(amountOut![1]) / 10 ** Number(decimals);

            return amountOut;
        } catch (error) {
            return 0;
        }
    }


    const calcStableTokenPriceInUSDCPancake = async (chainId: number): Promise<number> => {
        const web3 = new Web3(getRpcProviderByChainId(chainId));
        let tokenToSell = web3.utils.toWei("1", "ether");
        let amountOut;
        try {
            let router = new web3.eth.Contract(getRouterABIByChainId(Number(chainId)), getRouterAddressByChainId(chainId));
            const tokenContract = new web3.eth.Contract(getTokenContractABIByChainId(chainId), getUSDTTokenByChainId(chainId));

            const decimals = await safeCall(tokenContract.methods.decimals(), 6);

            amountOut = await router.methods.getAmountsOut(tokenToSell, [getStableTokenByChainId(chainId),
            getUSDTTokenByChainId(chainId)]).call() as any;
            amountOut = Number(amountOut[1]) / 10 ** Number(decimals);

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
    const calcTokenPriceUSDCSingleCallShadow = async (
        tokenAddress: string,
        chainId: number
    ): Promise<number> => {
        const web3 = new Web3(getRpcProviderByChainId(chainId));
        const amountIn = web3.utils.toWei('1', 'ether');

        try {

            const router = new web3.eth.Contract(
                getRouterABIByChainId(chainId),
                getRouterAddressByChainId(chainId).toLowerCase()
            );

            const usdcAddress = getUSDTTokenByChainId(chainId);
            const wrappedNative = getStableTokenByChainId(chainId);

            const usdcContract = new web3.eth.Contract(
                getTokenContractABIByChainId(chainId),
                usdcAddress
            );

            const usdcDecimals = await safeCall(usdcContract.methods.decimals(), 6);

            const routes = [
                {
                    from: tokenAddress,
                    to: wrappedNative,
                    stable: false,
                },
                {
                    from: wrappedNative,
                    to: usdcAddress,
                    stable: true,
                },
            ];

            const amounts = (await router.methods
                .getAmountsOut(amountIn, routes)
                .call()) as string[];

            const usdcOut = Number(amounts[amounts.length - 1]) / 10 ** Number(usdcDecimals);

            return usdcOut;
        } catch {
            return 0;
        }
    };


    const calcTokenPriceInUSDCViaNativePancake = async (
        tokenAddress: string,
        chainId: number
    ): Promise<number> => {
        try {
            const web3 = new Web3(getRpcProviderByChainId(chainId));

            const router = new web3.eth.Contract(
                getRouterABIByChainId(chainId),
                getRouterAddressByChainId(chainId)
            );

            const tokenContract = new web3.eth.Contract(
                getTokenContractABIByChainId(chainId),
                tokenAddress
            );

            const usdcAddress = getUSDTTokenByChainId(chainId);
            const nativeWrapped = getStableTokenByChainId(chainId);

            const tokenDecimals = Number(
                await safeCall(tokenContract.methods.decimals(), 18)
            );

            const oneToken = BigInt(10) ** BigInt(tokenDecimals);

            const path = [tokenAddress, nativeWrapped, usdcAddress];

            const amountsOut = await router.methods
                .getAmountsOut(oneToken.toString(), path)
                .call();

            if (!amountsOut || !amountsOut[2]) return 0;

            // decimals do USDC
            const usdcContract = new web3.eth.Contract(
                getTokenContractABIByChainId(chainId),
                usdcAddress
            );

            const usdcDecimals = Number(
                await safeCall(usdcContract.methods.decimals(), 6)
            );

            return Number(amountsOut[2]) / 10 ** usdcDecimals;
        } catch {
            return 0;
        }
    };

    return {
        data,
        isLoading,
        fetchAggregateFarmData,
        isFirstLoaidng,
    };
}
