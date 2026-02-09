
import { Icon } from '@iconify/react/dist/iconify.js'
// @ts-ignore
import AnimatedNumber from "animated-number-react"
import { motion } from 'framer-motion'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import CardSlider from './slider'
import { AppContext } from '@/context/appContext'
import axios from 'axios'
import { CircleLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { sonicTestnet } from '@/components/Web3Provider'
import { getSavvyTokenByChainId } from '@/utils/tokenAddressProvider'
import { base, baseSepolia, bsc, bscTestnet, sonic } from 'viem/chains'
import { useAppKitNetwork } from '@reown/appkit/react'

export interface HeroProps {
  farmTokenPrice: number;
  marketCap: number;
  tvl: number;
  circulatingSupply: number;
}

const SavvyFarmIntro = () => {
  const [isBuying, setIsBuyingOpen] = useState(false)
  const [isSelling, setIsSellingOpen] = useState(false)
  const BuyRef = useRef<HTMLDivElement>(null)
  const SellRef = useRef<HTMLDivElement>(null)

  const appContext = useContext(AppContext);

  const { farmTokenUSDCPrice, marketCap, tvl, circulatingSupply, isLoading } = appContext;

  const { chain } = useAccount();

  const { caipNetwork } = useAppKitNetwork();

  const [coins, setCoins] = useState([]);

  const navigate = useNavigate();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (BuyRef.current && !BuyRef.current.contains(event.target as Node)) {
        setIsBuyingOpen(false)
      }
      if (SellRef.current && !SellRef.current.contains(event.target as Node)) {
        setIsSellingOpen(false)
      }
    },
    [BuyRef, SellRef]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  const fetchCoins = async () => {
    try {
      const [resp1, resp2] = await Promise.all([
        axios.get('https://api.coingecko.com/api/v3/coins/markets', { params: { vs_currency: 'usd', order: 'gecko_desc', per_page: 250, page: 1 } }),
        axios.get('https://api.coingecko.com/api/v3/coins/markets', { params: { vs_currency: 'usd', order: 'gecko_desc', per_page: 250, page: 2 } }),
      ]);

      const combined = Array.isArray(resp1.data) && Array.isArray(resp2.data) ? [...resp1.data, ...resp2.data] : (resp1.data || []);

      const data = combined.filter((item: { name: string }) =>
        ['Bitcoin', 'Ethereum', 'BNB', 'Solana', 'TRON', 'Sui', 'Avalanche', 'Sonic', 'Arbitrum'].includes(item.name)
      );

      setCoins(data);
    } catch (err) {
    } finally {
    }
  };

  useEffect(() => {
    document.body.style.overflow = isBuying || isSelling ? 'hidden' : ''
  }, [isBuying, isSelling])

  const leftAnimation = {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    transition: { duration: 0.6 },
  }

  const rightAnimation = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
    transition: { duration: 0.6 },
  }

  const handleBuySavvy = (): void => {
    if (caipNetwork?.id === sonicTestnet.id) {
      window.open(`https://equalizer.exchange/swap?toToken=${getSavvyTokenByChainId(Number(caipNetwork.id))}`, '_blank');
    }
    else if (caipNetwork?.id === bscTestnet.id) {
      window.open(`https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=${getSavvyTokenByChainId(Number(caipNetwork.id))}`, '_blank');
    }
    else if (caipNetwork?.id === baseSepolia.id) {
      window.open(`https://pancakeswap.finance/swap?chain=baseSepolia&outputCurrency=${getSavvyTokenByChainId(Number(caipNetwork.id))}`, '_blank');
    }
    if (caipNetwork?.id === sonic.id) {
      window.open(`https://equalizer.exchange/swap?toToken=${getSavvyTokenByChainId(Number(caipNetwork.id))}`, '_blank');
    }
    else if (caipNetwork?.id === bsc.id) {
      window.open(`https://pancakeswap.finance/swap?chain=bsc&outputCurrency=${getSavvyTokenByChainId(Number(caipNetwork.id))}`, '_blank');
    }
    else if (caipNetwork?.id === base.id) {
      window.open(`https://app.uniswap.org/swap?chain=base&inputCurrency=ETH&outputCurrency=${getSavvyTokenByChainId(Number(caipNetwork.id))}`, '_blank');
    }
    else {
      window.open(`https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=${getSavvyTokenByChainId(Number(bscTestnet.id))}`, '_blank');
    }
  }

  function formatTokenBalanceFromFarm(value: number): string {

    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    const formattedValue = formatter.format(value);

    return formattedValue;
  }

  useEffect(() => {
    fetchCoins();
  }, [])

  return (
    <section
      className='relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1'
      id='main-banner'>
      <div className='container px-4'>
        <>
          <div className="flex flex-col gap-3 max-w-[920px] mx-auto mt-10 md:mt-0">
            <div className="relative overflow-hidden rounded-xl px-5 py-4 shadow-lg backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-700/50 to-yellow-700/0" />
              <p className="relative z-10 font-extrabold text-sm md:text-base leading-snug tracking-wide text-center text-white">
                We are currently on testnet! Mainnet coming soon! Values shown here are not real.
              </p>
            </div>
          </div>
        </>
        <div className='grid grid-cols-8'>
          <motion.div {...leftAnimation} className='lg:col-span-5 col-span-12'>
            <div className='flex gap-6 items-center lg:justify-start justify-center mb-5 mt-15'>
              <p className='text-white sm:text-28 text-18 mb-0'>
                Play, Earn, Trade & Shop – All in One Web3 <span className='text-primary'></span>
              </p>
            </div>
            <h1 className='font-medium lg:text-76 md:text-70 text-54 lg:text-start text-center text-white mb-10'>
              Stack & Earn <span className='text-primary'></span> with{' '}
              <span className='text-primary'>SavvyFarm</span>!
            </h1>
            <div className='flex items-center md:justify-start justify-center gap-8'>
              <button
                className='bg-primary border border-primary rounded-lg text-21 font-medium hover:bg-transparent hover:text-primary text-darkmode py-2 px-7 z-50'
                onClick={handleBuySavvy}>
                Buy $Savvy
              </button>
              <button
                className='bg-transparent border border-primary rounded-lg text-21 font-medium hover:bg-primary hover:text-darkmode text-primary py-2 px-7'
                onClick={() => {
                  navigate('/farm');
                }}>
                GO TO FARM
              </button>
            </div>
            <p className='text-primary text-xs mt-4 max-w-xl md:text-left text-center leading-tight'>
              • Sonic and Base do NOT have public DEXes on testnet.<br />
              • Prices on Testnet are not an indicative of future prices on Mainnet.
            </p>
            <div className='flex items-center md:justify-start justify-center gap-12 mt-15 w-full'>
              <motion.div
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: '100%', opacity: 0 }}
                transition={{ duration: 0.6 }}
                className='w-full md:w-4/5'
              >
                <div className='flex items-center justify-between gap-8 w-full'>
                  <p className='flex-1 sm:text-28 text-18 text-muted mb-4'>
                    $SAVVY <br /> <span className='text-primary'>{isLoading ? <CircleLoader color="#fff" loading={isLoading} size={15} /> :
                      <AnimatedNumber
                        includeComma
                        transitions={() => ({
                          type: "spring",
                          duration: 4,
                        })}
                        value={farmTokenUSDCPrice}
                        formatValue={(value: number) => {
                          if (!value || value === 0) {
                            return '$0.00';
                          }

                          const abs = Math.abs(value);

                          // Valores "normais"
                          if (abs >= 0.01) {
                            return value.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            });
                          }

                          // Valores pequenos
                          const str = value.toString();

                          // Se vier em notação científica
                          if (str.includes('e')) {
                            return `$${value.toFixed(8).replace(/\.?0+$/, '')}`;
                          }

                          const [, decimals = ''] = str.split('.');
                          let resultDecimals = '';
                          let nonZeroFound = false;
                          let nonZeroCount = 0;

                          for (const char of decimals) {
                            resultDecimals += char;

                            if (char !== '0') {
                              nonZeroFound = true;
                              nonZeroCount++;
                            }

                            if (nonZeroFound && nonZeroCount === 2) {
                              break;
                            }
                          }

                          return `$0.${resultDecimals}`;
                        }}
                      />}</span>
                  </p>
                  <p className='flex-1 sm:text-28 text-18 text-muted mb-4'>
                    Market Cap <br /> <span className='text-primary'>
                      {isLoading ? <CircleLoader color="#fff" loading={isLoading} size={15} /> : <AnimatedNumber
                        includeComma
                        transitions={() => ({
                          type: "spring",
                          duration: 4,
                        })}
                        value={marketCap}
                        formatValue={(value: number) => `${Number(value).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                      />}</span>
                  </p>
                </div>
                <div className='flex items-center justify-between gap-8 w-full'>
                  <p className='flex-1 sm:text-28 text-18 text-muted mb-4'>
                    TVL <br /> <span className='text-primary'>
                      {isLoading ? <CircleLoader color="#fff" loading={isLoading} size={15} /> :
                        <AnimatedNumber
                          includeComma
                          transitions={() => ({
                            type: "spring",
                            duration: 4,
                          })}
                          value={tvl}
                          formatValue={(value: number) => `${Number(value).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                        />}</span>
                  </p>
                  <p className='flex-1 sm:text-28 text-18 text-muted mb-4'>
                    Circulating Supply <br /> <span className='text-primary'>
                      {isLoading ? <CircleLoader color="#fff" loading={isLoading} size={15} /> : <AnimatedNumber
                        includeComma
                        transitions={() => ({
                          type: "spring",
                          duration: 4,
                        })}
                        value={circulatingSupply}
                        formatValue={(value: number) => formatTokenBalanceFromFarm(value)}
                      />}</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            {...rightAnimation}
            className='col-span-3 lg:block hidden'>
            <div className='mx-auto flex justify-center items-center h-full'>
              <img
                src='/images/hero/rocket.gif'
                alt='Banner'
                width={310}
                height={310}
              />
            </div>
          </motion.div>
        </div>
        <CardSlider data={coins} />
      </div>
      <div className='absolute w-50 h-50 bg-linear-to-bl from-tealGreen from-50% to-charcoalGray to-60% blur-400 rounded-full -top-64 -right-14 -z-1'></div>
    </section>
  )
}

export default SavvyFarmIntro
