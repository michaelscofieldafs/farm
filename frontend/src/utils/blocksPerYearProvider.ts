import {
    bsc,
    bscTestnet,
    sepolia,
    mainnet,
    sonic,
    sonicBlazeTestnet,
    base,
    sonicTestnet,
    baseSepolia,
} from '@reown/appkit/networks';

const env = import.meta.env; // atalho

const getNumber = (value: any) => {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
};

export const getBlocksPerYearByChainId = (chainId?: number): number => {
    switch (chainId) {
        case bsc.id:
            return getNumber(env.VITE_APP_SAVVY_BSC_BPY);

        case bscTestnet.id:
            return getNumber(env.VITE_APP_SAVVY_BSC_TESTNET_BPY);

        case sonic.id:
            return getNumber(env.VITE_APP_SAVVY_SONIC_BPY);

        case sonicTestnet.id:
            return getNumber(env.VITE_APP_SAVVY_SONIC_TESTNET_BPY);

        case base.id:
            return getNumber(env.VITE_APP_SAVVY_BASE_BPY);

        case baseSepolia.id:
            return getNumber(env.VITE_APP_SAVVY_BASE_SEPOLIA_BPY);

        default:
            // fallback
            return getNumber(env.VITE_APP_SAVVY_SONIC_BPY);
    }
};
