'use client'
import { upgradeData } from '@/app/api/data'
import { AppContext } from '@/context/appContext'
import { Icon } from '@iconify/react'
import { useContext } from 'react'

const SavvyFarmRewardEmission = () => {
  const { farmTokenPerBlock } = useContext(AppContext);

  return (
    <section className="bg-gradient-to-b from-[#071019] to-[#0b1418] text-white p-10" id='upgrade'>
      <div className='container px-4'>
        <div className='grid lg:grid-cols-2 sm:gap-0 gap-10 items-center'>
          <div>
            <p className='text-white sm:text-28 text-18 mb-3'><span className='text-primary'>Halving</span> System</p>
            <h2 className='text-white sm:text-40 text-30  font-medium mb-5'>
              Controle inflation and increase long-term token value.
            </h2>
            <p className='text-muted/60 text-18 mb-7'>
              A mechanism that periodically reduces reward emissions, helping to control inflation and increase long-term token value.
            </p>
            <div className='grid sm:grid-cols-2 lg:w-70% text-nowrap sm:gap-10 gap-5'>
              {upgradeData.map((item, index) => (
                <div key={index} className='flex gap-5'>
                  <div>
                    <Icon
                      icon='la:check-circle-solid'
                      width='24'
                      height='24'
                      className='text-white group-hover:text-primary'
                    />
                  </div>
                  <div>
                    <h4 className='text-18 text-muted/60'>{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <style>{`
  @keyframes borderGradient {
    0% {
      border-color: #ff0080;
    }
    25% {
      border-color: #7928ca;
    }
    50% {
      border-color: #2afadf;
    }
    75% {
      border-color: #00ff94;
    }
    100% {
      border-color: #ff0080;
    }
  }

  .animate-border-gradient {
    border: 4px solid #ff0080;
    animation: borderGradient 2s infinite linear;
    border-radius: 9999px; /* full circle */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem; /* espaço interno */
    width: fit-content;
    height: fit-content;
  }
`}</style>
            <div className="flex items-center justify-center">
              <div className="animate-border-gradient aspect-square rounded-full border-4 border-[#99e39e] flex flex-col items-center justify-center text-center p-6">
                <p className="text-[40px] font-bold leading-none text-primary">1</p>
                <p className="text-muted/60 text-[13px] text-sm mt-1">Current Halving</p>
                <p className="text-muted/60 text-[15px] font-bold  text-primary text-sm mt-1">{`${farmTokenPerBlock} $SAVVY per block`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SavvyFarmRewardEmission
