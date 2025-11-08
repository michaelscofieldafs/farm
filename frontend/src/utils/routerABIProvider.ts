import {
    bsc,
    bscTestnet,
    sepolia,
    mainnet,
    sonic,
    sonicBlazeTestnet,
    base
} from '@reown/appkit/networks';
import { PANCAKE_SWAP_ABI } from './abi/routerPancakeABI';
import { SHADOW_SWAP_ABI } from './abi/routerShadowABI';

export const getRouterABIByChainId = (chainId: number) => {
    switch (chainId) {
        case mainnet.id:
            return PANCAKE_SWAP_ABI;
        case sepolia.id:
            return PANCAKE_SWAP_ABI;
        case bsc.id:
            return PANCAKE_SWAP_ABI;
        case bscTestnet.id:
            return PANCAKE_SWAP_ABI;
        case sonic.id:
            return SHADOW_SWAP_ABI;
        case sonicBlazeTestnet.id:
            return PANCAKE_SWAP_ABI;
        case base.id:
            return PANCAKE_SWAP_ABI;
        default:
            // fallback: Sonic mainnet
            return SHADOW_SWAP_ABI;
    }
}