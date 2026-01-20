import { SAVVY_TICTACTOE_BASE_ADDRESS, SAVVY_TICTACTOE_BASE_TESTNET_ADDRESS, SAVVY_TICTACTOE_BSC_ADDRESS, SAVVY_TICTACTOE_BSC_TESTNET_ADDRESS, SAVVY_TICTACTOE_SONIC_ADDRESS, SAVVY_TICTACTOE_SONIC_TESTNET_ADDRESS } from '@/contracts/savvyticTacToeAddress';
import {
    base,
    baseSepolia,
    bsc,
    bscTestnet,
    sonic,
    sonicBlazeTestnet,
    sonicTestnet
} from '@reown/appkit/networks';
import { ZERO_ADDRESS } from './constants';

export const getContractAddressByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case sonic.id:
            return SAVVY_TICTACTOE_SONIC_ADDRESS ?? '';
        case sonicTestnet.id:
            return SAVVY_TICTACTOE_SONIC_TESTNET_ADDRESS ?? '';
        case bsc.id:
            return SAVVY_TICTACTOE_BSC_ADDRESS ?? '';
        case bscTestnet.id:
            return SAVVY_TICTACTOE_BSC_TESTNET_ADDRESS ?? '';
        case base.id:
            return SAVVY_TICTACTOE_BASE_ADDRESS;
        case baseSepolia.id:
            return SAVVY_TICTACTOE_BASE_TESTNET_ADDRESS ?? '';
        default:
            // fallback: Sonic mainnet
            return ZERO_ADDRESS;
    }
};