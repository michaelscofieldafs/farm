'use client'
import { getMasterchefABIByChainId } from '@/utils/masterChefABIProvider'
import { getMastChefAddressByChainId } from '@/utils/masterchefAddressProvider'
import { getRpcProviderByChainId } from '@/utils/rpcProviderUtils'
import { useAppKitNetwork } from '@reown/appkit/react'
import { Web3Button } from '@web3modal/react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { toast } from "react-toastify"
import { useAccount } from 'wagmi'
import Web3 from 'web3'

const SavvyFarmReferral = () => {
  const ref = useRef(null)
  const inView = useInView(ref)
  const { address, isConnected } = useAccount();
  const [feeToReferral, setFeeToReferral] = useState(0);

  const { chainId } = useAppKitNetwork();

  const TopAnimation = {
    initial: { y: '-100%', opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: '-100%', opacity: 0 },
    transition: { duration: 0.6, delay: 0.4 },
  }

  const bottomAnimation = {
    initial: { y: '100%', opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 },
    transition: { duration: 0.6, delay: 0.4 },
  }

  const services = [
    {
      icon: '/images/icons/icon-consulting.svg',
      text: 'Build Community',
    },
    {
      icon: '/images/icons/icon-blockchain.svg',
      text: 'Extra Yield',
    },
    {
      icon: '/images/icons/icon-Services.svg',
      text: 'Boost Earnings',
    },
  ]

  const handleLink = () => {
    const encodedText = btoa(unescape(encodeURIComponent(address as string)));
    const url = `http://localhost:3000/?refer=${encodedText}`;

    navigator.clipboard.writeText(url);
    toast('Copied link', {
      position: 'top-center'
    })
  }

  const fetchFeeToReferral = async () => {
    try {
      const web3 = new Web3(getRpcProviderByChainId(Number(chainId)));
      const masterChefContract = new web3.eth.Contract(getMasterchefABIByChainId(chainId), getMastChefAddressByChainId(Number(chainId)));

      const feeToReferral = await masterChefContract.methods.feeToReferral().call();

      setFeeToReferral(Number(feeToReferral));
    }
    catch (err) {
    }
  }

  useEffect(() => {
    setFeeToReferral(0);
    fetchFeeToReferral();
  }, [chainId])

  return (
    <section className='md:p-10 pt-10' id='work'>
      <div className='container px-4 mx-auto lg:max-w-(--breakpoint-xl) px-4'>
        <div ref={ref} className='grid grid-cols-12 items-center'>
          <motion.div
            {...bottomAnimation}
            className='lg:col-span-7 col-span-12'>
            <p className='sm:text-28 text-18 text-white'>
              <span className='text-primary'>Referral</span> System
            </p>
            <h2 className='sm:text-30 text-30 text-white lg:w-full md:w-70% font-medium'>
              Share your link and earn rewards whenever someone makes a deposit through it!
              Invite, contribute, and reap the benefits. 🚀
            </h2>
            <div className='grid md:grid-cols-2 gap-7 mt-11'>
              {services.map((service, index) => (
                <div key={index} className='flex items-center gap-5'>
                  <div className='px-5 py-5 bg-light_grey/30 rounded-full'>
                    <Image
                      src={service.icon}
                      alt={`${service.text} icon`}
                      width={40}
                      height={40}
                    />
                  </div>
                  <p className='text-24 text-muted'>{service.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...TopAnimation} className='lg:col-span-5 col-span-12'>
            <div className='2xl:-mr-40 mt-9 flex flex-col justify-center items-center relative'>
              <div className="flex items-center justify-center z-10">
                <div className="animate-border-gradient aspect-square rounded-full border-4 border-[#99e39e] flex flex-col items-center justify-center text-center p-6">
                  <Image
                    src="/images/icons/savvy-icon.png"
                    alt="logo"
                    width={41}
                    height={41}
                    quality={100}
                    className="absolute opacity-24"
                  />
                  <p className="text-[20px] font-bold leading-none text-white">{feeToReferral}%</p>
                </div>
              </div>

              <p className='text-16 text-muted font-bold mt-4 z-10'>
                During <span className='text-primary'>Halving 1</span>, you&apos;ll receive {feeToReferral}% of
              </p>
              <p className='text-16 text-muted font-bold z-10'>
                the deposits made through your <span className='text-primary'>referral</span>.
              </p>

              {isConnected ? (
                <button
                  className='bg-primary mt-10 border border-primary rounded-lg text-21 font-medium hover:bg-transparent hover:text-primary text-darkmode py-2 px-7 z-10'
                  onClick={handleLink}>
                  GET YOUR REFERRAL LINK
                </button>
              ) : (
                <div className='mt-10 z-10'>
                  <Web3Button balance="show" label='Connect wallet to get your link' />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SavvyFarmReferral
