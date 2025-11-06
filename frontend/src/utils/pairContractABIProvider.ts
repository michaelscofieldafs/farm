import {
    bsc,
    bscTestnet,
    mainnet,
    sepolia,
    sonic,
    sonicBlazeTestnet
} from '@reown/appkit/networks';
import { UNISWAP_V2_PAIR_CONTRACT_ABI } from './abi/uniswapv2PairContractABI';

export const getPairContractV2ABIByChainId = (chainId: number | string | undefined) => {
    switch (chainId) {
        case mainnet.id:
            return UNISWAP_V2_PAIR_CONTRACT_ABI;
        case sepolia.id:
            return UNISWAP_V2_PAIR_CONTRACT_ABI;
        case bsc.id:
            return UNISWAP_V2_PAIR_CONTRACT_ABI;
        case bscTestnet.id:
            return UNISWAP_V2_PAIR_CONTRACT_ABI;
        case sonic.id:
            return UNISWAP_V2_PAIR_CONTRACT_ABI;
        case sonicBlazeTestnet.id:
            return UNISWAP_V2_PAIR_CONTRACT_ABI;
        default:
            // fallback: Sonic mainnet
            return UNISWAP_V2_PAIR_CONTRACT_ABI;
    }
}