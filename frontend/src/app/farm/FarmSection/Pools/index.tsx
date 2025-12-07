/* eslint-disable react/jsx-key */

import { AppContext } from '@/context/appContext'
import { motion } from 'framer-motion'
import { useContext, useState } from 'react'
import { CircleLoader } from 'react-spinners'
import FarmPoolCard from './components/pool'
import FarmLpPoolCard from './components/poollp'

const SavvyFarmPools = () => {
  const [isSingleSided, setIsSingleSided] = useState<boolean>(true);

  const { poolsFarm, poolsTokenFarm, isLoading } = useContext(AppContext);

  const handleIsSingleSided = (value: boolean) => {
    setIsSingleSided(value);
  }

  const NoPoolsAvailable = () => {
    return (
      <div className="flex flex-col items-center justify-center text-center py-4 bg-black/20 rounded-2xl shadow-lg ring-1 ring-white/5">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
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
    <section className='relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1 pt-9 bg-gradient-to-b from-[#071019] to-[#0b1418]' id='pools'>
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-emerald-500 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 size-[520px] rounded-full bg-cyan-500 blur-[160px]" />
      </div>
      <div className='lg:px-16 mt-10 px-4'>
        <div className='text-center'>
          <motion.div
            {...rightAnimation}>
            <div className="flex flex-col justify-center items-center">
              <p className='text-muted sm:text-28 text-18 mb-4'>
                Savvy <span className='text-primary'>Farm</span>
              </p>
            </div>
            <div className='container'>
              <h2 className='text-white sm:text-40 text-30 font-medium lg:w-80% mx-auto mb-10'>
                Take advantage of the amazing APRs in our LP and single-sided token pools.
              </h2>
              <div className="w-full flex justify-center items-center gap-6 py-4 mb-4">
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
              </div>
            </div>
          </motion.div>
          {isLoading ? <div className="hidden md:flex flex-wrap justify-center gap-6 w-full pb-20 px-4"> <CircleLoader className='mt-4' color="#fff" loading={isLoading} size={45} /> </div> :
            <motion.div
              {...leftAnimation}>
              <div className="hidden md:flex flex-wrap justify-center gap-6 w-full pb-20 px-4">
                {isSingleSided ? (
                  poolsTokenFarm.length > 0 ? (
                    poolsTokenFarm.map(item => (
                      <div className="basis-[280px]">
                        <FarmPoolCard pool={item} />
                      </div>
                    ))
                  ) : (
                    <NoPoolsAvailable />
                  )
                ) : (
                  poolsFarm.length > 0 ? (
                    poolsFarm.map(item => (
                      <div className="basis-[280px]">
                        <FarmLpPoolCard pool={item} />
                      </div>
                    ))
                  ) : (
                    <NoPoolsAvailable />
                  )
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
