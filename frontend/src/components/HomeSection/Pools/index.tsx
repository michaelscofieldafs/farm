/* eslint-disable react/jsx-key */
'use client'
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

  return (
    <section className='md:pt-20 pt-9' id='pools'>
      <div className='lg:px-16 px-4'>
        <div className='text-center'>
          <motion.div
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.6 }}>
            <p className='text-muted sm:text-28 text-18 mb-9'>
              SavvyYield <span className='text-primary'>pools</span>
            </p>
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
              whileInView={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6 }}>
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
