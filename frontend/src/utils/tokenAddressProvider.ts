import { sonicTestnet } from '@/components/Web3Provider';
import {
    bsc,
    bscTestnet,
    sepolia,
    mainnet,
    sonic,
    sonicBlazeTestnet,
    base,
    baseSepolia,
    monadTestnet
} from '@reown/appkit/networks';

const env = import.meta.env;

// ---------------- SAVVY TOKEN ---------------- //

export const getSavvyTokenByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case bsc.id:
            return env.VITE_APP_SAVVY_SAVVY_BSC_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case bscTestnet.id:
            return env.VITE_APP_SAVVY_SAVVY_BSC_TESTNET_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case sonic.id:
            return env.VITE_APP_SAVVY_SAVVY_SONIC_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case sonicTestnet.id:
            return env.VITE_APP_SAVVY_SAVVY_SONIC_TESTNET_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case monadTestnet.id:
            return env.VITE_APP_SAVVY_SAVVY_MONAD_TESTNET_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case baseSepolia.id:
            return env.VITE_APP_SAVVY_SAVVY_BASE_TESTNET_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case base.id:
            return env.VITE_APP_SAVVY_SAVVY_BASE_TOKEN_ADDRESS?.toLowerCase() ?? '';

        default:
            return env.VITE_APP_SAVVY_SAVVY_BSC_TESTNET_TOKEN_ADDRESS?.toLowerCase() ?? '';
    }
};

// ---------------- STABLE TOKEN ---------------- //

export const getStableTokenByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case bsc.id:
            return env.VITE_APP_SAVVY_STABLE_TOKEN_BSC_ADDRESS?.toLowerCase() ?? '';
        case bscTestnet.id:
            return env.VITE_APP_SAVVY_STABLE_TOKEN_BSC_TESTNET_ADDRESS?.toLowerCase() ?? '';
        case sonic.id:
            return env.VITE_APP_SAVVY_STABLE_TOKEN_SONIC_ADDRESS?.toLowerCase() ?? '';
        case sonicTestnet.id:
            return env.VITE_APP_SAVVY_STABLE_TOKEN_SONIC_TESTNET_ADDRESS?.toLowerCase() ?? '';
        case baseSepolia.id:
            return env.VITE_APP_SAVVY_STABLE_TOKEN_BASE_TESTNET_ADDRESS?.toLowerCase() ?? '';
        case base.id:
            return env.VITE_APP_SAVVY_STABLE_TOKEN_BASE_ADDRESS?.toLowerCase() ?? '';
        default:
            return env.VITE_APP_SAVVY_STABLE_TOKEN_BSC_TESTNET_ADDRESS?.toLowerCase() ?? '';
    }
};

// ---------------- USDT TOKEN ---------------- //

export const getUSDTTokenByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case bsc.id:
            return env.VITE_APP_SAVVY_USDT_TOKEN_BSC_ADDRESS?.toLowerCase() ?? '';
        case bscTestnet.id:
            return env.VITE_APP_SAVVY_USDT_TOKEN_BSC_TESTNET_ADDRESS?.toLowerCase() ?? '';
        case sonic.id:
            return env.VITE_APP_SAVVY_USDT_TOKEN_SONIC_ADDRESS?.toLowerCase() ?? '';
        case sonicTestnet.id:
            return env.VITE_APP_SAVVY_USDT_TOKEN_SONIC_TESTNET_ADDRESS?.toLowerCase() ?? '';
        case baseSepolia.id:
            return env.VITE_APP_SAVVY_USDT_TOKEN_BASE_TESTNET_ADDRESS?.toLowerCase() ?? '';
        case base.id:
            return env.VITE_APP_SAVVY_USDT_TOKEN_BASE_ADDRESS?.toLowerCase() ?? '';
        default:
            return env.VITE_APP_SAVVY_USDT_TOKEN_BSC_TESTNET_ADDRESS?.toLowerCase() ?? '';
    }
};
