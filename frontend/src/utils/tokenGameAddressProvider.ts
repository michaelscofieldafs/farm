import { SAVVY_TICTACTOE_BASE_TESTNET_ADDRESS, SAVVY_TICTACTOE_SONIC_TESTNET_ADDRESS } from '@/contracts/savvyticTacToeAddress';
import {
    baseSepolia,
    sonic,
    sonicBlazeTestnet
} from '@reown/appkit/networks';

export const getContractAddressByChainId = (chainId?: number | string): string => {
    switch (chainId) {
        case sonic.id:
            return SAVVY_TICTACTOE_SONIC_TESTNET_ADDRESS ?? '';
        case sonicBlazeTestnet.id:
            return SAVVY_TICTACTOE_SONIC_TESTNET_ADDRESS ?? '';
        case baseSepolia.id:
            return SAVVY_TICTACTOE_BASE_TESTNET_ADDRESS ?? '';
        default:
            // fallback: Sonic mainnet
            return SAVVY_TICTACTOE_SONIC_TESTNET_ADDRESS;
    }
};