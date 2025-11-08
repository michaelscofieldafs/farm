import {
    bsc,
    bscTestnet,
    sepolia,
    mainnet,
    sonic,
    sonicBlazeTestnet,
    base
} from '@reown/appkit/networks';

export const getRouterAddressByChainId = (chainId: number): string => {
    switch (chainId) {
        case mainnet.id:
            return process.env.NEXT_PUBLIC_APP_ETHEREUM_ROUTER_ADDRESS ?? '';
        case sepolia.id:
            return process.env.NEXT_PUBLIC_APP_ETHEREUM_SEPOLIA_ROUTER_ADDRESS ?? '';
        case bsc.id:
            return process.env.NEXT_PUBLIC_APP_BSC_ROUTER_ADDRESS ?? '';
        case bscTestnet.id:
            return process.env.NEXT_PUBLIC_APP_BSC_TESTNET_ROUTER_ADDRESS ?? '';
        case sonic.id:
            return process.env.NEXT_PUBLIC_APP_SONIC_ROUTER_ADDRESS ?? '';
        case sonicBlazeTestnet.id:
            return process.env.NEXT_PUBLIC_APP_SONIC_BLAZE_ROUTER_ADDRESS ?? '';
        case base.id:
            return process.env.NEXT_PUBLIC_APP_BASE_ROUTER_ADDRESS ?? '';
        default:
            // fallback: Sonic mainnet
            return process.env.NEXT_PUBLIC_APP_SONIC_ROUTER_ADDRESS ?? '';
    }
}