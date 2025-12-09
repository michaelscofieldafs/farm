
import { getMasterchefABIByChainId } from '@/utils/masterChefABIProvider'
import { getMastChefAddressByChainId } from '@/utils/masterchefAddressProvider'
import { getRpcProviderByChainId } from '@/utils/rpcProviderUtils'
import { useAppKitNetwork } from '@reown/appkit/react'
import { Web3Button } from '@web3modal/react'
import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
      icon: '/images/logo/savvy-games-logo.png',
      text: 'Games',
      link: '/games',
    },
    {
      icon: '/images/logo/savvy-farm-logo.png',
      text: 'Yield Farm',
      link: '/farm',
    },
    {
      icon: '/images/logo/savvy-shop-logo.png',
      text: 'Shop',
      link: '/shop',
    },
    {
      icon: '/images/logo/savvy-dex-logo.png',
      text: 'DEX',
      link: '/dex',
    },
  ]

  const handleLink = () => {
    const encodedText = btoa(unescape(encodeURIComponent(address as string)));
    const url = `http://localhost:3000/?refer=${encodedText}`;

    navigator.clipboard.writeText(url);
    toast.dismiss();
    toast('Copied link', {
      position: 'top-center',
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
    <section className='relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1' id='work'>
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-emerald-500 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 size-[520px] rounded-full bg-cyan-500 blur-[160px]" />
      </div>
      <div className='container px-4 mx-auto lg:max-w-(--breakpoint-xl) px-4'>
        <div ref={ref} className='grid grid-cols-12 items-center'>
          <motion.div
            {...bottomAnimation}
            className='lg:col-span-7 col-span-12'>
            <p className='sm:text-28 text-18 text-white'>
              <span className='text-primary'>SavvyGirl</span> Ecosystem
            </p>
            <h2 className='sm:text-30 text-30 text-white lg:w-full md:w-70% font-medium'>
              SavvyGirl.app is a Web3 ecosystem with gaming, yield farming, a marketplace, and a DEX, combining innovation and security. 🚀
            </h2>
            <div className='grid md:grid-cols-2 gap-7 mt-11'>
              {services.map((service, index) => (
                <div key={index} className='flex items-center gap-5'>
                  <div className='w-18 h-18 bg-light_grey/30 rounded-full flex items-center justify-center'>
                    <img
                      src={service.icon}
                      alt={`${service.text} icon`}
                      width={60}
                      height={60}
                    />
                  </div>
                  <Link
                    to={service.link}
                    className='text-21 text-muted font-bold hover:text-primary transition-colors cursor-pointer'
                  >
                    {service.text}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...TopAnimation} className='lg:col-span-5 col-span-12'>
            <div className='2xl:-mr-40 mt-9 flex flex-col justify-center items-center relative'>
              <p className='text-16 text-muted font-bold mt-4 z-10'>
                Join our <span className='text-primary'>community</span>, and get updates,
              </p>
              <p className='text-16 text-muted font-bold z-10'>
                connect with players, traders, and builders.
              </p>

              {isConnected ? (
                <button
                  className='bg-primary mt-10 border border-primary rounded-lg text-21 font-medium hover:bg-transparent hover:text-primary text-darkmode py-2 px-7 z-10'
                  onClick={handleLink}>
                  TELEGRAM GROUP
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
