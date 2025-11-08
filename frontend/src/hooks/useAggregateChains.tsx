import { getTokenContractABIByChainId } from '@/utils/tokenContractABIProvider';
import { base, bsc, bscTestnet, mainnet, plasma, plasmaTestnet, sepolia, sonic, sonicBlazeTestnet } from '@reown/appkit/networks';
import { useState } from 'react';
import Web3 from 'web3';
import { safeCall } from '../utils/functions';
import { getMasterchefABIByChainId } from '../utils/masterChefABIProvider';
import { getMastChefAddressByChainId } from '../utils/masterchefAddressProvider';
import { getPairContractV2ABIByChainId } from '../utils/pairContractABIProvider';
import { getRouterABIByChainId } from '../utils/routerABIProvider';
import { getRouterAddressByChainId } from '../utils/routerProvider';
import { getRpcProviderByChainId } from '../utils/rpcProviderUtils';
import { getSavvyTokenByChainId, getStableTokenByChainId, getUSDTTokenByChainId } from '../utils/tokenAddressProvider';

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

        const chainList = [bsc, mainnet, sonic, base];

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
                const tokenPrice = await fetchTokenPriceV2(mainTokenAddress, chain.id, web3).catch(() => 0);
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
                            if (symbol === '' || symbol.endsWith('-LP') || symbol.includes('LP') || symbol.includes('UNI-V2')) {
                                const pairContract = new web3.eth.Contract(getPairContractV2ABIByChainId(chain.id), lpToken);

                                const [token0Address, token1Address, reserves, farmBalance, totalSupply] = await Promise.all([
                                    safeCall(pairContract.methods.token0()),
                                    safeCall(pairContract.methods.token1()),
                                    safeCall(pairContract.methods.getReserves(), [0, 0]),
                                    safeCall(pairContract.methods.balanceOf(masterChefAddress), 0),
                                    safeCall(pairContract.methods.totalSupply(), 1),
                                ]);

                                if (!token0Address || !token1Address) return 0;

                                const token0 = new web3.eth.Contract(getTokenContractABIByChainId(chain.id), token0Address);
                                const token1 = new web3.eth.Contract(getTokenContractABIByChainId(chain.id), token1Address);

                                const [decimals0, decimals1] = await Promise.all([
                                    Number(await safeCall(token0.methods.decimals(), 18)),
                                    Number(await safeCall(token1.methods.decimals(), 18)),
                                ]);

                                const [price0, price1] = await Promise.all([
                                    fetchTokenPriceV2(token0Address, chain.id, web3).catch(() => 0),
                                    fetchTokenPriceV2(token1Address, chain.id, web3).catch(() => 0),
                                ]);

                                const tvlTotal = (Number(price0) * Number(reserves[0]) / 10 ** decimals0) +
                                    (Number(price1) * Number(reserves[1]) / 10 ** decimals1);

                                const tvlFarm = ((Number(farmBalance) / 10 ** 18) * tvlTotal) / (Number(totalSupply) / 10 ** 18 || 1);
                                return tvlFarm;
                            }

                            // Single-sided pool
                            const [decimals, farmBalance, price] = await Promise.all([
                                Number(await safeCall(tokenContract.methods.decimals(), 18)),
                                safeCall(tokenContract.methods.balanceOf(masterChefAddress), 0),
                                fetchTokenPriceV2(lpToken, chain.id, web3).catch(() => 0),
                            ]);

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
    const fetchTokenPriceV2 = async (address: string, chainId: number, web3: Web3) => {
        try {
            const price = await calcTokenPrice(address, chainId, web3);
            return price;
        } catch (err) {
            return 0;
        }
    }

    // Calculate the price of any token except Savvy and stable tokens
    const calcTokenPrice = async (tokenAddress: string, chainId: number, web3: Web3): Promise<number> => {
        switch (chainId) {
            case bsc.id:
            case bscTestnet.id:
            case base.id: {
                if (tokenAddress.toLowerCase() != getStableTokenByChainId(chainId)) {
                    const price = await calcTokenPriceInStableTokenPancake(tokenAddress, chainId, web3);
                    const stableTokenPriceUSDC = await calcStableTokenPriceInUSDCPancake(chainId, web3);
                    return price * stableTokenPriceUSDC;
                }
                else {
                    return calcStableTokenPriceInUSDCPancake(chainId, web3);
                }
            }
            default: {
                if (tokenAddress.toLowerCase() != getStableTokenByChainId(chainId)) {
                    const price = await calcTokenPriceUSDCSingleCall(tokenAddress, chainId, web3);
                    return price;
                }
                else {
                    const price = await calcStableTokenPriceInUSDC(chainId, web3);
                    return price;
                }
            }
        }
    }

    /**
   * 
   * @param tokenAddress Address of the token that will be pegged to the stablecoin.
   * @returns Return the price of a specific token based on the chain's stablecoin
   */
    const calcTokenPriceUSDCSingleCall = async (tokenAddress: string, chainId: number, web3: Web3): Promise<number> => {
        let tokenToSell = web3.utils.toWei("1", "ether");

        let amountOut;
        try {
            let router = new web3.eth.Contract(getRouterABIByChainId(Number(chainId)), getRouterAddressByChainId(Number(chainId)).toLowerCase());
            const tokenContract = new web3.eth.Contract(getTokenContractABIByChainId(Number(chainId)), getUSDTTokenByChainId(Number(chainId)));

            const decimals = await safeCall(tokenContract.methods.decimals(), 6);

            const tokenIn = tokenAddress;
            const tokenOut = getStableTokenByChainId(Number(chainId));
            const amountIn = tokenToSell;

            const routes = [[tokenIn, tokenOut, false], [tokenOut, getUSDTTokenByChainId(Number(chainId)), false]];

            amountOut = await router.methods.getAmountsOut(amountIn, routes).call();
            amountOut = Number(amountOut![2]) / 10 ** Number(decimals);

            return amountOut;
        } catch (error: any) {
            return 0;
        }
    }

    /**
     * 
     * @returns Returns the value of the chain’s stablecoin in USDC
     */
    const calcStableTokenPriceInUSDC = async (chainId: number, web3: Web3): Promise<number> => {
        let tokenToSell = web3.utils.toWei("1", "ether");
        let amountOut;
        try {
            let router = new web3.eth.Contract(getRouterABIByChainId(Number(chainId)), getRouterAddressByChainId(Number(chainId)));
            const tokenContract = new web3.eth.Contract(getTokenContractABIByChainId(Number(chainId)), getUSDTTokenByChainId(Number(chainId)));

            const decimals = await safeCall(tokenContract.methods.decimals(), 6);

            const amountIn = tokenToSell;
            const routes = [[getStableTokenByChainId(Number(chainId)), getUSDTTokenByChainId(Number(chainId)), false]];

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
    const calcTokenPriceInStableTokenPancake = async (tokenAddress: string, chainId: number, web3: Web3): Promise<number> => {
        let tokenToSell = web3.utils.toWei("1", "ether");

        let amountOut;
        try {
            let router = new web3.eth.Contract(getRouterABIByChainId(Number(chainId)), getRouterAddressByChainId(Number(chainId)).toLowerCase());
            const tokenContract = new web3.eth.Contract(getTokenContractABIByChainId(Number(chainId)), tokenAddress);

            const decimals = await safeCall(tokenContract.methods.decimals(), 18);

            amountOut = await router.methods.getAmountsOut(tokenToSell, [tokenAddress, getStableTokenByChainId(Number(chainId))]).call() as any;
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
    const calcStableTokenPriceInUSDCPancake = async (chainId: number, web: Web3): Promise<number> => {
        let tokenToSell = web.utils.toWei("1", "ether");
        let amountOut;
        try {
            let router = new web.eth.Contract(getRouterABIByChainId(Number(chainId)), getRouterAddressByChainId(Number(chainId)));
            const tokenContract = new web.eth.Contract(getTokenContractABIByChainId(Number(chainId)), getUSDTTokenByChainId(Number(chainId)));

            const decimals = await safeCall(tokenContract.methods.decimals(), 6);

            amountOut = await router.methods.getAmountsOut(tokenToSell, [getStableTokenByChainId(Number(chainId)),
            getUSDTTokenByChainId(Number(chainId))]).call() as any;
            amountOut = Number(amountOut[1]) / 10 ** Number(decimals);

            return amountOut;
        } catch (error) {
            return 0;
        }
    }

    return {
        data,
        isLoading,
        fetchAggregateFarmData,
        isFirstLoaidng,
    };
}
