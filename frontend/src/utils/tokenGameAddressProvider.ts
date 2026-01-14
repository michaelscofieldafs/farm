import { SAVVY_TICTACTOE_BASE_TESTNET_ADDRESS, SAVVY_TICTACTOE_SONIC_TESTNET_ADDRESS } from '@/contracts/savvyticTacToeAddress';
import {
    base,
    baseSepolia,
    sonic,
    sonicBlazeTestnet,
    sonicTestnet
} from '@reown/appkit/networks';
import { ZERO_ADDRESS } from './constants';

export const getContractAddressByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case sonic.id:
            return SAVVY_TICTACTOE_SONIC_TESTNET_ADDRESS ?? '';
        case sonicTestnet.id:
            return SAVVY_TICTACTOE_SONIC_TESTNET_ADDRESS ?? '';
        case base.id:
            return ZERO_ADDRESS;
        case baseSepolia.id:
            return SAVVY_TICTACTOE_BASE_TESTNET_ADDRESS ?? '';
        default:
            // fallback: Sonic mainnet
            return SAVVY_TICTACTOE_SONIC_TESTNET_ADDRESS;
    }
};