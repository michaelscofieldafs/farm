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
            return process.env.NEXT_PUBLIC_APP_ETHEREUM_PROVIDER ?? '';
        case sepolia.id:
            return process.env.NEXT_PUBLIC_APP_ETHEREUM_PROVIDER ?? '';
        case bsc.id:
            return process.env.NEXT_PUBLIC_APP_BSC_PROVIDER ?? '';
        case bscTestnet.id:
            return process.env.NEXT_PUBLIC_APP_BSC_TESTNET_PROVIDER ?? '';
        case sonic.id:
            return process.env.NEXT_PUBLIC_APP_SONIC_PROVIDER ?? '';
        case sonicBlazeTestnet.id:
            return process.env.NEXT_PUBLIC_APP_SONIC_BLAZE_PROVIDER ?? '';
        case base.id:
            return process.env.NEXT_PUBLIC_APP_BASE_PROVIDER ?? '';
        default:
            // fallback: Sonic mainnet
            return process.env.NEXT_PUBLIC_APP_SONIC_PROVIDER ?? '';
    }
};
