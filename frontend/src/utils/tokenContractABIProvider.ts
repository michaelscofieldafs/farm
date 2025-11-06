import {
    bsc,
    bscTestnet,
    mainnet,
    sepolia,
    sonic,
    sonicBlazeTestnet
} from '@reown/appkit/networks';
import { ECR20_ABI } from './abi/erc20ABI';

export const getTokenContractABIByChainId = (chainId: number | string | undefined) => {
    switch (chainId) {
        case mainnet.id:
            return ECR20_ABI;
        case sepolia.id:
            return ECR20_ABI;
        case bsc.id:
            return ECR20_ABI;
        case bscTestnet.id:
            return ECR20_ABI;
        case sonic.id:
            return ECR20_ABI;
        case sonicBlazeTestnet.id:
            return ECR20_ABI;
        default:
            // fallback: Sonic mainnet
            return ECR20_ABI;
    }
}