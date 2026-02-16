/* eslint-disable react/jsx-key */

import { AppContext } from '@/context/appContext'
import { motion } from 'framer-motion'
import { useContext, useState, useMemo, useEffect, useRef } from 'react'
import { CircleLoader } from 'react-spinners'
import FarmPoolCard from './components/pool'
import FarmLpPoolCard from './components/poollp'
// @ts-ignore
import AnimatedNumber from "animated-number-react";

const SavvyFarmPools = () => {
  const [isSingleSided, setIsSingleSided] = useState<boolean>(true);

  const { poolsFarm, poolsTokenFarm, isLoading, farmTokenUSDCPrice, marketCap, tvl, circulatingSupply, } = useContext(AppContext);
  const [sortOption, setSortOption] = useState<'alloc' | 'singleFirst' | 'lpFirst'>('alloc');

  const visiblePools = useMemo(() => {
    const single = Array.isArray(poolsTokenFarm) ? [...poolsTokenFarm] : [];
    const lp = Array.isArray(poolsFarm) ? [...poolsFarm] : [];

    const sortByAlloc = (arr: any[]) => arr.sort((a: any, b: any) => (Number(b?.multiplier ?? 0) - Number(a?.multiplier ?? 0)));

    const sortedSingle = sortByAlloc(single);
    const sortedLp = sortByAlloc(lp);

    if (sortOption === 'alloc') {
      // Include both single-sided and LP pools when sorting by allocation
      const merged = [...sortedSingle, ...sortedLp];
      return sortByAlloc(merged);
    }

    if (sortOption === 'singleFirst') {
      return [...sortedSingle, ...sortedLp];
    }

    return [...sortedLp, ...sortedSingle];
  }, [poolsTokenFarm, poolsFarm, sortOption, isSingleSided]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const sortOptions = [
    { value: 'alloc', label: 'MULTIPLIER' },
    { value: 'singleFirst', label: 'SINGLE SIDED POOLS' },
    { value: 'lpFirst', label: 'LP POOLS' },
  ];

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleIsSingleSided = (value: boolean) => {
    setIsSingleSided(value);
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

  const NoPoolsAvailable = () => {
    return (
      <div className="flex flex-col items-center justify-center text-center p-7 py-4 bg-black/20 rounded-2xl shadow-lg ring-1 ring-white/5">
        <h2 className="text-2xl md:text-2xl text-slate-400 font-semibold mb-2">
          No pools available on this chain... yet!
        </h2>
        <p className="text-slate-400 max-w-md mb-6">
          Looks like there are no active pools on the selected network.
          Try switching chains or check back later for new yield opportunities. 🚀
        </p>
      </div>
    );
  }

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

  return (
    <section className='relative pt-28 md:pt-40 pb-20 md:pb-10 overflow-hidden z-1 bg-gradient-to-b from-[#071019] to-[#0b1418]' id='pools'>
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-emerald-500 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 size-[520px] rounded-full bg-cyan-500 blur-[160px]" />
      </div>
      <div className='lg:px-16 px-4'>
        <>
          <div className="flex flex-col gap-3 max-w-[920px] mx-auto">
            <div className="relative overflow-hidden rounded-xl px-5 py-4 shadow-lg backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-700/0 via-yellow-700/50 to-yellow-400/0" />
              <p className="relative z-10 font-extrabold text-sm md:text-base leading-snug tracking-wide text-center text-white">
                We are currently on testnet! Mainnet coming soon! Values shown here are not real.
              </p>
            </div>
          </div>
        </>
        <div className='text-center mt-10'>
          <motion.div
            {...rightAnimation}>
            <div className="flex flex-col justify-center items-center">
              <p className='text-muted sm:text-28 text-18 mb-4'>
                Savvy <span className='text-primary'>Farm</span>
              </p>
            </div>
            <div className='container'>
              <h2 className='text-white sm:text-30 text-20 font-medium lg:w-80% mx-auto mb-10'>
                Take advantage of the amazing APRs in our LP and single-sided token pools.
              </h2>
              <div className='w-full items-center justify-center '>
                <motion.div
                  whileInView={{ y: 0, opacity: 1 }}
                  initial={{ y: '100%', opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div>
                    <p className='flex-1 sm:text-30 text-2xl text-muted mb-4'>
                      Total Value Locked (TVL) <br /> <span className='font-extrabold
    bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200
    bg-clip-text text-transparent
    drop-shadow-[0_0_6px_rgba(255,215,0,0.9)]
    drop-shadow-[0_0_14px_rgba(255,200,0,0.7)]
    drop-shadow-[0_0_24px_rgba(255,180,0,0.5)]
    tracking-wide'>
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
                    <div className='flex items-center justify-between gap-4 mt-4 w-full mx-auto'>
                      <p className='flex-1 sm:text-24 text-16 text-muted mb-4'>
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

                              if (abs >= 0.01) {
                                return value.toLocaleString('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                });
                              }

                              const str = value.toString();

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
                      <p className='flex-1 sm:text-24 text-16 text-muted mb-4'>
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
                      <p className='flex-1 sm:text-24 text-16 text-muted mb-4'>
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
                  </div>
                </motion.div>
              </div>
              <div className="w-full flex justify-center items-center gap-6 py-4 mt-4 mb-4">
                {/**
                <button
                  onClick={() => handleIsSingleSided(true)}
                  className={`relative z-10 px-6 py-2 text-[15px] rounded-lg font-semibold transition-all
    ${isSingleSided
                      ? 'border border-primary bg-primary text-white'
                      : 'border border-primary bg-transparent text-white'}
    hover:bg-primary hover:text-white
  `}
                >
                  Single Sided Pools
                </button>

                <button
                  onClick={() => handleIsSingleSided(false)}
                  className={`relative z-10 px-6 py-2 text-[15px] rounded-lg font-semibold transition-all
    ${!isSingleSided
                      ? 'border border-primary bg-primary text-white'
                      : 'border border-primary bg-transparent text-white'}
    hover:bg-primary hover:text-white
  `}
                >
                  LP Pools
                </button>
                 */}
                <div className="relative z-10">
                  <label className="sr-only">Sort pools</label>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm text-muted">Sort</span>
                    <div ref={dropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center justify-between min-w-[260px] px-3 py-2 rounded-lg border-2 border-primary bg-[rgba(11,20,24,0.95)] text-white text-sm shadow-sm hover:shadow-md transition"
                        aria-haspopup="listbox"
                        aria-expanded={dropdownOpen}
                      >
                        <span className="truncate">{sortOptions.find(o => o.value === sortOption)?.label}</span>
                        <svg className={`ml-2 transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <ul role="listbox" className="absolute right-0 mt-2 w-[320px] bg-[#071019] border border-primary rounded-lg shadow-lg py-1 z-50 overflow-hidden">
                          {sortOptions.map(opt => (
                            <li
                              key={opt.value}
                              role="option"
                              aria-selected={sortOption === opt.value}
                              onClick={() => { setSortOption(opt.value as any); setDropdownOpen(false); }}
                              className={`px-3 py-2 text-sm text-white hover:bg-primary/20 cursor-pointer ${sortOption === opt.value ? 'bg-primary/20' : ''}`}
                            >
                              {opt.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {isLoading ? <div className="flex flex-wrap justify-center gap-6 w-full pb-20 px-4"> <CircleLoader className='mt-4' color="#fff" loading={isLoading} size={45} /> </div> :
            <motion.div
              {...leftAnimation}>
              <div className="flex flex-wrap justify-center gap-6 w-full pb-20 px-4">
                {visiblePools && visiblePools.length > 0 ? (
                  visiblePools.map((item: any) => (
                    <div className="w-full sm:basis-[280px]" key={item.poolAddress ?? item.id ?? Math.random()}>
                      {item.token ? <FarmPoolCard pool={item} /> : <FarmLpPoolCard pool={item} />}
                    </div>
                  ))
                ) : (
                  <NoPoolsAvailable />
                )}
              </div>
            </motion.div>
          }
        </div>
      </div>
    </section>
  )
}

export default SavvyFarmPools
