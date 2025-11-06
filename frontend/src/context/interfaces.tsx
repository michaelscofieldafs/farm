export interface PoolLP {
    token0: {
        id: string;
        symbol: string;
        name: string;
        decimals: number;
        reserves: string;
        price: number;
    };
    token1: {
        id: string;
        symbol: string;
        name: string;
        decimals: number;
        reserves: string;
        price: number;
    };
    fee: number;
    multiplier: number;
    poolAddress: string;
    poolMasterchef: number;
    farmBalance: string;
    totalSupply: string;
    tvl: number;
    tvlTotal: number;
    apr: number;
    token?: undefined;
}

export interface PoolSingle {
    token: {
        id: string;
        symbol: string;
        name: string;
        decimals: number;
        price: number;
    };
    fee: number;
    multiplier: number;
    poolAddress: string;
    poolMasterchef: number;
    farmBalance: string;
    tvl: number;
    apr: number;
}
