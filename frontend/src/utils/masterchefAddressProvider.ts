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

export const getMastChefAddressByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        /**
        case bsc.id:
            return import.meta.env.VITE_APP_SAVVY_BSC_TESNET_MASTER_CHEF_ADDRESS ?? '';
             */
        case bscTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_BSC_TESNET_MASTER_CHEF_ADDRESS ?? '';
        /**
    case sonic.id:
        return import.meta.env.VITE_APP_SAVVY_BSC_TESNET_MASTER_CHEF_ADDRESS ?? '';
         */
        case sonicTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_SONIC_TESTNET_MASTER_CHEF_ADDRESS ?? '';
        case monadTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_MONAD_TESTNET_MASTER_CHEF_ADDRESS ?? '';
        case baseSepolia.id:
            return import.meta.env.VITE_APP_SAVVY_BASE_TESTNET_MASTER_CHEF_ADDRESS ?? '';
        /**
    case base.id:
        return import.meta.env.VITE_APP_SAVVY_BSC_TESNET_MASTER_CHEF_ADDRESS ?? '';
         */
        default:
            return import.meta.env.VITE_APP_SAVVY_BSC_TESNET_MASTER_CHEF_ADDRESS;
    }
};
