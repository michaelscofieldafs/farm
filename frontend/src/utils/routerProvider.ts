import { sonicTestnet } from '@/components/Web3Provider';
import {
    bsc,
    bscTestnet,
    sepolia,
    mainnet,
    sonic,
    sonicBlazeTestnet,
    base,
    baseSepolia,
    monadTestnet
} from '@reown/appkit/networks';

export const getRouterAddressByChainId = (chainId: number): string => {
    switch (chainId) {
        /**
        case bsc.id:
            return import.meta.env.VITE_APP_SAVVY_BSC_ROUTER_ADDRESS ?? '';
             */
        case bscTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_BSC_TESTNET_ROUTER_ADDRESS ?? '';
        /**
    case sonic.id:
        return import.meta.env.VITE_APP_SAVVY_SONIC_ROUTER_ADDRESS ?? '';
         */
        case sonicTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_SONIC_TESTNET_ROUTER_ADDRESS ?? '';
        case monadTestnet.id:
            return import.meta.env.VITE_APP_SAVVY_MONAD_TESTNET_ROUTER_ADDRESS ?? '';
        case baseSepolia.id:
            return import.meta.env.VITE_APP_SAVVY_BASE_TESTNET_ROUTER_ADDRESS ?? '';
        /**
    case base.id:
        return import.meta.env.VITE_APP_SAVVY_BASE_ROUTER_ADDRESS ?? '';
         */
        default:
            // fallback: Sonic mainnet
            return import.meta.env.VITE_APP_SAVVY_BSC_TESTNET_ROUTER_ADDRESS;
    }
}
