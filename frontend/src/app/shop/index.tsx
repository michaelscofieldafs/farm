import React from "react";
import { motion, useInView } from 'framer-motion';
import Orb from "@/components/Orb";
import TextType from "@/components/Typeing";

const ShirtMock = ({ color = '#0f0f10', image = '/images/shop/shirt.png' }) => (
  <svg viewBox="0 0 400 420" className="w-full h-auto drop-shadow-2xl">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0%" stopColor="#0c0c0e" />
        <stop offset="100%" stopColor="#15181d" />
      </linearGradient>
      <clipPath id="shirt-shape">
        <path d="M120 60c40 30 120 30 160 0l50 50-40 30v220c0 22-18 40-40 40H150c-22 0-40-18-40-40V140L70 110 120 60z" />
      </clipPath>
    </defs>

    <image
      href={image}
      x="70"
      y="60"
      width="260"
      height="330"
      preserveAspectRatio="xMidYMid meet"
      clipPath="url(#shirt-shape)"
    />
  </svg>
)

const ProductCard = ({ title, price, imgColor, image }: any) => (
  <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col gap-1">
    <ShirtMock color={imgColor} image={image} />
    <div className="flex-1">
      <h3 className="text-white text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-white/60">$ {price}</p>
    </div>
    <button className="inline-flex mt-4 items-center justify-center rounded-xl px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium shadow-lg transition">
      Available for purchase soon
    </button>
  </div>
);

const ProductCardOthers = ({ title, price, image }: any) => (
  <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col gap-1 min-h-[360px]">
    <div className="flex-1 w-full flex items-center justify-center">
      <img src={image} alt={title} className="w-[170px] h-auto object-contain drop-shadow-2xl" />
    </div>
    <div className="w-full flex flex-col items-start justify-end mt-4">
      <h3 className="text-white text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-white/60">$ {price}</p>
    </div>
    <button className="inline-flex mt-4 items-center justify-center rounded-xl px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium shadow-lg transition">
      Available for purchase soon
    </button>
  </div>
);

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

export default function SavvyFarmShop() {
  return (
    <section
      className='min-h-screen relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1'
      id='shop'>
      <div className="pointer-events-none fixed inset-0 opacity-40 hidden md:block">
        <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-emerald-500 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 size-[520px] rounded-full bg-cyan-500 blur-[160px]" />
      </div>
      <div className='container px-4 mb-10'>
        <>
          <div className="flex flex-col gap-3 max-w-[920px] mx-auto">
            <div className="relative overflow-hidden rounded-xl px-5 py-4 shadow-lg backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-700/50 to-yellow-700/0" />
              <p className="relative z-10 font-extrabold text-sm md:text-base leading-snug tracking-wide text-center text-white">
                We are currently on testnet! Mainnet coming soon! Values shown here are not real.
              </p>
            </div>
          </div>
        </>
        <div className='container mx-auto px-4 mt-10 lg:max-w-(--breakpoint-xl)'>
          <div
            className='grid grid-cols-12 place-items-center text-center'
          >
            <motion.div
              {...leftAnimation}
              className='col-span-12 max-w-3xl mx-auto'
            >
              <div className="flex flex-col justify-center items-center">
                <p className='text-white sm:text-28 text-18 mb-3'><span className='text-primary'>Savvy</span> Shop</p>
              </div>
              <h2 className='text-white sm:text-40 text-20 font-medium mt-3'>
                Buy personalized products and contribute to the SavvyFarm ecosystem
              </h2>
              {/**
              <p className='text-muted/60 text-18 mb-7 mt-4'>
                A percentage of sales will be used for sustainability, as well as the purchase and burn of $SAVVY.
              </p>
               */}
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        {...rightAnimation} className='container px-4 mx-auto lg:max-w-(--breakpoint-xl)'>
        <div className="w-full text-white">

          <section className="relative z-10 pb-8" style={{ background: 'transparent' }}>
            <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white/5 border-[1px] border-[#FCDAAD]/70
    shadow-[0_0_15px_#FCDAAD50] p-6 flex items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Buy and burn of $SAVVY</h3>
                  <p className="text-white/60 text-sm">Strengthen $SAVVY</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border-[1px] border-[#FCDAAD]/70
    shadow-[0_0_15px_#FCDAAD50] p-6 flex items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Platform sustainability</h3>
                  <p className="text-white/60 text-sm">Help support the platform’s sustainability</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border-[1px] border-[#FCDAAD]/70
    shadow-[0_0_15px_#FCDAAD50] p-6 flex items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Shop with crypto</h3>
                  <p className="text-white/60 text-sm">Pay your way across multiple chains</p>
                </div>
              </div>
            </div>
          </section>
          {/**
          <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={0}
              forceHoverState={false}
            />
            <TextType
              text={["Coming soon..."]}
              typingSpeed={145}
              pauseDuration={4500}
              showCursor={true}
              cursorCharacter="|"
              className="text-white sm:text-30 text-20 font-medium absolute 
    top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
            />
          </div>
           */}
          <section id="shop" className="relative z-10" style={{ background: 'transparent' }}>
            <div className="mx-auto max-w-7xl px-6">
              <h2 className="text-3lg md:text-2xl font-small text-center mb-4">Check out our <span className='text-primary'>products</span></h2>
              <p className="text-white/60 text-sm mb-10 text-center">You purchase a product on-chain using your favorite network and receive the corresponding NFT.<br /> You can gift it or redeem it at any time and have the product delivered to your home!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard title="SavvyGirl World Shirt" price="10.00" imgColor="#0f0f10" />
                <ProductCardOthers title="SavvyGirl.app Shirt" price="10.00" image="/images/shop/shop-savvygirlapp.png" />
                <ProductCardOthers title="Goglz Plush" price="24.00" image="/images/shop/shop-goglz.png" />
                <ProductCardOthers title="SonicLabs Cup" price="15.00" image="/images/shop/shop-4.png" />
                <ProductCard title="Base Shirt" price="10.00" image="/images/shop/shop-base.png" />
                <ProductCardOthers title="Base Cushion" price="13.99" image="/images/shop/shop-base-pup.png" />
              </div>
            </div>
          </section>
        </div>
      </motion.div>
      <div className='absolute w-50 h-50 bg-linear-to-bl from-tealGreen from-50% to-charcoalGray to-60% blur-400 rounded-full -top-64 -right-14 -z-1'></div>
    </section>
  );
}
