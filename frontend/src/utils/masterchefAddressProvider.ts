import {
    bsc,
    bscTestnet,
    sepolia,
    mainnet,
    sonic,
    sonicBlazeTestnet,
    base
} from '@reown/appkit/networks';

export const getMastChefAddressByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case mainnet.id:
            return import.meta.env.VITE_APP_SAVVY_ETHEREUM_MASTER_CHEF_ADDRESS ?? '';
        case sepolia.id:
            return import.meta.env.VITE_APP_SAVVY_ETHEREUM_SEPOLIA_MASTER_CHEF_ADDRESS ?? '';
        case bsc.id:
            return import.meta.env.VITE_APP_SAVVY_BSC_MASTER_CHEF_ADDRESS ?? '';
        case bscTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_BSC_TESNET_MASTER_CHEF_ADDRESS ?? '';
        case sonic.id:
            return import.meta.env.VITE_APP_SAVVY_SONIC_MASTER_CHEF_ADDRESS ?? '';
        case sonicBlazeTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_SONIC_BLAZE_MASTER_CHEF_ADDRESS ?? '';
        case base.id:
            return import.meta.env.VITE_APP_SAVVY_BASE_MASTER_CHEF_ADDRESS ?? '';
        default:
            return import.meta.env.VITE_APP_SAVVY_SONIC_MASTER_CHEF_ADDRESS ?? '';
    }
};
