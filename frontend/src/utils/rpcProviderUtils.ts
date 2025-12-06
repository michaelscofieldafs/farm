import {
    bsc,
    bscTestnet,
    sepolia,
    mainnet,
    sonic,
    sonicBlazeTestnet,
    base,
} from '@reown/appkit/networks';

export const getRpcProviderByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case mainnet.id:
            return import.meta.env.VITE_APP_SAVVY_ETHEREUM_PROVIDER ?? '';

        case sepolia.id:
            return import.meta.env.VITE_APP_SAVVY_ETHEREUM_PROVIDER ?? '';

        case bsc.id:
            return import.meta.env.VITE_APP_SAVVY_BSC_PROVIDER ?? '';

        case bscTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_BSC_TESTNET_PROVIDER ?? '';

        case sonic.id:
            return import.meta.env.VITE_APP_SAVVY_SONIC_PROVIDER ?? '';

        case sonicBlazeTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_SONIC_BLAZE_PROVIDER ?? '';

        case base.id:
            return import.meta.env.VITE_APP_SAVVY_BASE_PROVIDER ?? '';

        default:
            // fallback: Sonic mainnet
            return import.meta.env.VITE_APP_SAVVY_SONIC_PROVIDER ?? '';
    }
};
