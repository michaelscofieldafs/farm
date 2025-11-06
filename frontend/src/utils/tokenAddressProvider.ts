import {
    bsc,
    bscTestnet,
    sepolia,
    mainnet,
    sonic,
    sonicBlazeTestnet
} from '@reown/appkit/networks';

export const getSavvyTokenByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case mainnet.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_ETHEREUM_TOKEN_ADDRESS ?? '';
        case sepolia.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_ETHEREUM_SEPOLIA_TOKEN_ADDRESS ?? '';
        case bsc.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_BSC_TOKEN_ADDRESS ?? '';
        case bscTestnet.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_BSC_TESTNET_TOKEN_ADDRESS ?? '';
        case sonic.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_SONIC_TOKEN_ADDRESS ?? '';
        case sonicBlazeTestnet.id:
            return process.env.NEXT_PUBLIC_APP_SAVVY_SONIC_BLAZE_TOKEN_ADDRESS ?? '';
        default:
            // fallback: Sonic mainnet
            return process.env.NEXT_PUBLIC_APP_SAVVY_SONIC_TOKEN_ADDRESS ?? '';
    }
};

export const getStableTokenByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case mainnet.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_ETHEREUM_ADDRESS ?? '';
        case sepolia.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_ETHEREUM_SEPOLIA_ADDRESS ?? '';
        case bsc.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_BSC_ADDRESS ?? '';
        case bscTestnet.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_BSC_TESTNET_ADDRESS ?? '';
        case sonic.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_SONIC_ADDRESS ?? '';
        case sonicBlazeTestnet.id:
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_SONIC_BLAZE_ADDRESS ?? '';
        default:
            // fallback: Sonic mainnet
            return process.env.NEXT_PUBLIC_APP_STABLE_TOKEN_SONIC_ADDRESS ?? '';
    }
};

export const getUSDTTokenByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case mainnet.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_ETHEREUM_ADDRESS ?? '';
        case sepolia.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_ETHEREUM_SEPOLIA_ADDRESS ?? '';
        case bsc.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_BSC_ADDRESS ?? '';
        case bscTestnet.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_BSC_TESTNET_ADDRESS ?? '';
        case sonic.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_SONIC_ADDRESS ?? '';
        case sonicBlazeTestnet.id:
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_SONIC_BLAZE_ADDRESS ?? '';
        default:
            // fallback: Sonic mainnet
            return process.env.NEXT_PUBLIC_APP_USDT_TOKEN_SONIC_ADDRESS ?? '';
    }
};
