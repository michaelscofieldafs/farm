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
            return process.env.NEXT_PUBLIC_APP_ETHEREUM_MASTER_CHEF_ADDRESS ?? '';
        case sepolia.id:
            return process.env.NEXT_PUBLIC_APP_ETHEREUM_SEPOLIA_MASTER_CHEF_ADDRESS ?? '';
        case bsc.id:
            return process.env.NEXT_PUBLIC_APP_BSC_MASTER_CHEF_ADDRESS ?? '';
        case bscTestnet.id:
            return process.env.NEXT_PUBLIC_APP_BSC_TESNET_MASTER_CHEF_ADDRESS ?? '';
        case sonic.id:
            return process.env.NEXT_PUBLIC_APP_SONIC_MASTER_CHEF_ADDRESS ?? '';
        case sonicBlazeTestnet.id:
            return process.env.NEXT_PUBLIC_APP_SONIC_BLAZE_MASTER_CHEF_ADDRESS ?? '';
        case base.id:
            return process.env.NEXT_PUBLIC_APP_BASE_MASTER_CHEF_ADDRESS ?? '';
        default:
            // fallback: Sonic mainnet
            return process.env.NEXT_PUBLIC_APP_SONIC_MASTER_CHEF_ADDRESS ?? '';
    }
};
