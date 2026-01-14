import { toast, TypeOptions } from "react-toastify";
import { ZERO_ADDRESS } from "./constants";
import { ethers } from "ethers";
import { wagmiAdapter } from "@/components/Web3Provider";

export const showToast = (message: string, type: TypeOptions = 'default'): void => {
    toast.dismiss();
    toast(message, {
        type: type,
        position: 'top-center',
        style: {
            fontSize: 16,
            fontFamily: 'Trebuchet MS, sans-serif',
        }
    });
}

export const isAppChain = (chainId: number) => wagmiAdapter.wagmiConfig.chains.some(item => item.id === chainId);

export const fetchChainBase = (chainId: number) => isAppChain(chainId) ? chainId : wagmiAdapter.wagmiConfig.chains[0].id;

export const shortenAddress = (address: string): string => {
    if (address === ZERO_ADDRESS) return 'Waiting player...';
    return `${address.slice(0, 15)}...`;
}

export const weiToEth = (wei: string | number | bigint, tokenName: string): string => {
    return `${ethers.utils.formatEther(wei)} ${tokenName}`;
}
