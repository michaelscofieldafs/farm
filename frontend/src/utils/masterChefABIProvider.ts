import {
    base,
    bsc,
    bscTestnet,
    mainnet,
    sepolia,
    sonic,
    sonicBlazeTestnet
} from '@reown/appkit/networks';
import { MASTERCHEF_V2_CONTRACT_ABI } from './abi/masterchefV2ABI';

export const getMasterchefABIByChainId = (chainId: number | string | undefined) => {
    switch (chainId) {
        case mainnet.id:
            return MASTERCHEF_V2_CONTRACT_ABI;
        case sepolia.id:
            return MASTERCHEF_V2_CONTRACT_ABI;
        case bsc.id:
            return MASTERCHEF_V2_CONTRACT_ABI;
        case bscTestnet.id:
            return MASTERCHEF_V2_CONTRACT_ABI;
        case sonic.id:
            return MASTERCHEF_V2_CONTRACT_ABI;
        case sonicBlazeTestnet.id:
            return MASTERCHEF_V2_CONTRACT_ABI;
        case base.id:
            return MASTERCHEF_V2_CONTRACT_ABI;
        default:
            // fallback: Sonic mainnet
            return MASTERCHEF_V2_CONTRACT_ABI;
    }
}