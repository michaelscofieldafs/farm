

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { bsc, bscTestnet, mainnet, sepolia, sonic, sonicBlazeTestnet, plasma, plasmaTestnet, baseSepolia, baseGoerli, monadTestnet, base } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { defineChain, http } from 'viem'
import { fallback, WagmiProvider } from 'wagmi'

const projectId = '289396e9ac5e2ccac060651fad3b0f90'

export const sonicTestnet = /*#__PURE__*/ defineChain({
    id: 14601,
    name: 'Sonic Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Sonic',
        symbol: 'S',
    },
    rpcUrls: {
        default: { http: ['https://rpc.testnet.soniclabs.com'] },
    },
    blockExplorers: {
        default: {
            name: 'Sonic Testnet Explorer',
            url: 'https://testnet.soniclabs.com/',
        },
    },
    testnet: true,
})


export function Web3Provider({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient()

    createAppKit({
        adapters: [wagmiAdapter],
        allowUnsupportedChain: true,
        defaultNetwork: bscTestnet,
        themeVariables: {
            '--w3m-font-family': 'DM Sans, sans-serif',
            '--w3m-font-size-master': '13px',
            '--w3m-accent': '#99E39E',
            '--w3m-color-mix': '#99E39E',
            '--w3m-color-mix-strength': 1,
            '--w3m-border-radius-master': '4px',
            '--w3m-z-index': 1000,
            '--w3m-qr-color': '#99E39E',
        },
        enableReconnect: true,
        networks: [sonic, base, bsc, bscTestnet, sonicTestnet, baseSepolia, /** baseGoerli, **/],
        chainImages: {
            146: 'https://resources.cryptocompare.com/asset-management/17157/1727687183179.png',
            64_165: 'https://resources.cryptocompare.com/asset-management/17157/1727687183179.png',
            14601: 'https://resources.cryptocompare.com/asset-management/17157/1727687183179.png',
            57054: 'https://resources.cryptocompare.com/asset-management/17157/1727687183179.png',
            97: 'https://cdn-icons-png.flaticon.com/128/12114/12114208.png',
            9745: 'https://cdn-icons-png.flaticon.com/128/12114/12114208.png',
        },
        projectId,
        features: {
            email: false,
            socials: [],
        },
    })

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export const wagmiAdapter = new WagmiAdapter({
    networks: [sonic, base, bsc, bscTestnet, sonicTestnet, baseSepolia, /** baseGoerli */],
    projectId,
    transports: {
        [base.id]: fallback(
            [
                http('https://base.drpc.org'),
                http('https://base-rpc.publicnode.com'),
            ],
            {
                retryCount: 1,           // evita spam
            }
        ),
        [sonic.id]: fallback(
            [
                http('https://sonic.drpc.org'),
                http('https://sonic-rpc.publicnode.com'),
                http('https://rpc.soniclabs.com'),
            ],
            {
                retryCount: 1,           // evita spam
            }
        ),
        [bsc.id]: fallback(
            [
                http('https://bsc-rpc.publicnode.com'),
                http('https://bsc.drpc.org'),
                http('https://public-bsc-mainnet.fastnode.io'),
            ],
            {
                retryCount: 1,           // evita spam
            }
        ),

    }
})