import {
    bsc,
    bscTestnet,
    sepolia,
    mainnet,
    sonic,
    sonicBlazeTestnet,
    base
} from '@reown/appkit/networks';

export const getSavvyTokenByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case mainnet.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_ETHEREUM_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case sepolia.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_ETHEREUM_SEPOLIA_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case bsc.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_BSC_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case bscTestnet.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_BSC_TESTNET_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case sonic.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_SONIC_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case sonicBlazeTestnet.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_SONIC_BLAZE_TOKEN_ADDRESS?.toLowerCase() ?? '';
        case base.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_BASE_TOKEN_ADDRESS?.toLowerCase() ?? '';
        default:
            // fallback: Sonic mainnet
            return process.env.NEXT_PUBLIC_APP_SAVVY_SONIC_TOKEN_ADDRESS?.toLowerCase() ?? '';
    }
};

export const getStableTokenByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case mainnet.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_ETHEREUM_ADDRESS?.toLowerCase() ?? '';
        case sepolia.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_ETHEREUM_SEPOLIA_ADDRESS?.toLowerCase() ?? '';
        case bsc.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_BSC_ADDRESS?.toLowerCase() ?? '';
        case bscTestnet.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_BSC_TESTNET_ADDRESS?.toLowerCase() ?? '';
        case sonic.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_SONIC_ADDRESS?.toLowerCase() ?? '';
        case sonicBlazeTestnet.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_SONIC_BLAZE_ADDRESS?.toLowerCase() ?? '';
        case base.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_BASE_ADDRESS?.toLowerCase() ?? '';
        default:
            // fallback: Sonic mainnet
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_SONIC_ADDRESS?.toLowerCase() ?? '';
    }
};

export const getUSDTTokenByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case mainnet.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_ETHEREUM_ADDRESS?.toLowerCase() ?? '';
        case sepolia.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_ETHEREUM_SEPOLIA_ADDRESS?.toLowerCase() ?? '';
        case bsc.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_BSC_ADDRESS?.toLowerCase() ?? '';
        case bscTestnet.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_BSC_TESTNET_ADDRESS?.toLowerCase() ?? '';
        case sonic.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_SONIC_ADDRESS?.toLowerCase() ?? '';
        case sonicBlazeTestnet.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_SONIC_BLAZE_ADDRESS?.toLowerCase() ?? '';
        case base.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_BASE_ADDRESS?.toLowerCase() ?? '';
        default:
            // fallback: Sonic mainnet
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_SONIC_ADDRESS?.toLowerCase() ?? '';
    }
};
