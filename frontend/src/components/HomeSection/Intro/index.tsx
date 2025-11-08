'use client'
import { Icon } from '@iconify/react/dist/iconify.js'
// @ts-ignore
import AnimatedNumber from "animated-number-react"
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import CardSlider from './slider'
import { AppContext } from '@/context/appContext'
import axios from 'axios'
import { CircleLoader } from 'react-spinners'

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

  const [coins, setCoins] = useState([]);

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
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'gecko_desc',
            per_page: 500,
            page: 1,
          },
        }
      );

      const data = response.data.filter((item: { name: string }) => item.name == 'Bitcoin' || item.name == 'Ethereum' || item.name == 'BNB' || item.name == 'Solana' || item.name == 'TRON' || item.name == 'Sui' || item.name == 'Avalanche' || item.name == 'Sonic');

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

  }

  useEffect(() => {
    fetchCoins();
  }, [])

  return (
    <section
      className='relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1'
      id='main-banner'>
      <div className='container px-4'>
        <div className='grid grid-cols-8'>
          <motion.div {...leftAnimation} className='lg:col-span-5 col-span-12'>
            <div className='flex gap-6 items-center lg:justify-start justify-center mb-5 mt-24'>
              <Image
                src='/images/icons/icon-bag.svg'
                alt='icon'
                width={40}
                height={40}
              />
              <p className='text-white sm:text-28 text-18 mb-0'>
                The best multichain yieldfarm of <span className='text-primary'>SonicLabs</span>
              </p>
            </div>
            <h1 className='font-medium lg:text-76 md:text-70 text-54 lg:text-start text-center text-white mb-10'>
              Stack & Earn <span className='text-primary'></span> with{' '}
              <span className='text-primary'>SavvyYield</span>!
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
                  const element = document.getElementById('pools');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' }); // scroll suave
                  }
                }}>
                GO TO POOLS
              </button>
            </div>
            <div className='flex items-center md:justify-start justify-center gap-12 mt-20 w-full'>
              <motion.div
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: '100%', opacity: 0 }}
                transition={{ duration: 0.6 }}
                className='w-4/5'
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
                        formatValue={(value: number) => `${Number(value).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 4,
                        })}`}
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
                        formatValue={(value: number) => `${Number(value).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
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
              <Image
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
