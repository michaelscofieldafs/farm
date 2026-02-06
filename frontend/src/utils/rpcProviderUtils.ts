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
    monadTestnet,
} from '@reown/appkit/networks';

export const getRpcProviderByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case bsc.id:
            return import.meta.env.VITE_APP_SAVVY_BSC_PROVIDER ?? '';
        case bscTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_BSC_TESTNET_PROVIDER ?? '';
        case sonic.id:
            return import.meta.env.VITE_APP_SAVVY_SONIC_PROVIDER ?? '';
        case sonicTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_SONIC_TESTNET_PROVIDER ?? '';
        case monadTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_MONAD_TESTNET_PROVIDER ?? '';
        case baseSepolia.id:
            return import.meta.env.VITE_APP_SAVVY_BASE_TESTNET_PROVIDER ?? '';
        case base.id:
            return import.meta.env.VITE_APP_SAVVY_BASE_PROVIDER ?? '';
        default:
            // fallback: Sonic mainnet
            return import.meta.env.VITE_APP_SAVVY_BSC_TESTNET_PROVIDER ?? '';
    }
};
