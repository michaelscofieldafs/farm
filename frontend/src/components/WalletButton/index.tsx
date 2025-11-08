import { useAppKitNetwork } from '@reown/appkit/react';
import React, { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

interface WalletButtonProps { }

const WalletButton: React.FC<WalletButtonProps> = () => {
    const { isConnected, chain } = useAccount();
    const [isShowButton, setIsShowButton] = useState<boolean>(false);
    const wasConnected = useRef(isConnected);
    const { caipNetwork } = useAppKitNetwork();

    const showEmoji = (): boolean => {
        return chain?.id == 146 || chain?.id == 57054;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShowButton(true)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (wasConnected.current && !isConnected) {
            setTimeout(async () => {
                try {
                    localStorage.clear();
                    sessionStorage.clear();

                    if (window.indexedDB && window.indexedDB.databases) {
                        const databases = await window.indexedDB.databases();
                        for (const db of databases) {
                            if (db.name) {
                                const request = window.indexedDB.deleteDatabase(db.name);
                                request.onerror = () => console.log(`Failed to delete DB ${db.name}`);
                                request.onsuccess = () => console.log(`Deleted DB ${db.name}`);
                            }
                        }
                    }

                    if ('caches' in window) {
                        const cacheNames = await caches.keys();
                        for (const name of cacheNames) {
                            await caches.delete(name);
                        }
                    }
                    localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
                    window.location.reload();
                } catch (err) {
                    console.error('Error clearing cache', err);
                }
            }, 500);
        }

        wasConnected.current = isConnected;
    }, [isConnected]);

    return (
        <div
            key={isConnected ? 'connected' : 'disconnected'}
            className="flex flex-col items-center justify-center gap-3"
        >
            {!isConnected && caipNetwork && <span className="inline-block text-sm font-small text-white bg-[#202F34] rounded-full shadow-md px-4 py-1">
                {`Current network: ${caipNetwork?.name}`}
            </span>}
            {isConnected &&
                <span className="inline-block text-sm font-small text-white bg-[#202F34] rounded-full shadow-md px-4 py-1">
                    {`Network: ${chain?.name ?? ''} ${showEmoji() ? '💜' : ''}`}
                </span>
            }
            <div
                className={`transition-all duration-500 ease-out transform ${isShowButton ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}
            >
                <appkit-button size="sm" label='' loadingLabel=''></appkit-button>
            </div>
        </div>
    );
};

export default WalletButton;
