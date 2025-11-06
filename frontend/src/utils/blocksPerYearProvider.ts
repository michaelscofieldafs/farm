import {
    bsc,
    bscTestnet,
    sepolia,
    mainnet,
    sonic,
    sonicBlazeTestnet
} from '@reown/appkit/networks';

export const getBlocksPerYearByChainId = (chainId?: number): number => {
    switch (chainId) {
        case mainnet.id:
            return Number(process.env.NEXT_PUBLIC_APP_ETH_BPY) ?? 0
        case sepolia.id:
            return Number(process.env.NEXT_PUBLIC_APP_SEPOLIA_BPY) ?? 0
        case bsc.id:
            return Number(process.env.NEXT_PUBLIC_APP_BSC_BPY) ?? 0
        case bscTestnet.id:
            return Number(process.env.NEXT_PUBLIC_APP_BSC_TESTNET_BPY) ?? 0
        case sonic.id:
            return Number(process.env.NEXT_PUBLIC_APP_SONIC_BPY) ?? 0
        case sonicBlazeTestnet.id:
            return Number(process.env.NEXT_PUBLIC_APP_SONIC_BPY) ?? 0
        default:
            // fallback: Sonic mainnet
            return Number(process.env.NEXT_PUBLIC_APP_SONIC_BPY) ?? 0
    }
};
