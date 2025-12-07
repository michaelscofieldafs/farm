import React from "react";
import { motion, useInView } from 'framer-motion';
import Orb from "@/components/Orb";
import TextType from "@/components/Typeing";

const leftAnimation = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: { duration: 0.6 },
}


export default function SavvyFarmDex() {
  return (
    <section
      className='relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1'
      id='shop'>
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-emerald-500 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 size-[520px] rounded-full bg-cyan-500 blur-[160px]" />
      </div>
      <div className='container px-4 mt-10 mb-10'>
        <div className='container mx-auto px-4 lg:max-w-(--breakpoint-xl)'>
          <div
            className='grid grid-cols-12 place-items-center text-center'
          >
            <motion.div
              {...leftAnimation}
              className='col-span-12 max-w-3xl mx-auto'
            >
              <div className="flex flex-col justify-center items-center">
                <p className='text-white sm:text-28 text-18 mb-3'><span className='text-primary'>Savvy</span> Dex</p>
              </div>
              <h2 className='text-white sm:text-40 text-20 font-medium mt-3'>
                The future of multichain DEXs is here!
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
      <div className='absolute w-50 h-50 bg-linear-to-bl from-tealGreen from-50% to-charcoalGray to-60% blur-400 rounded-full -top-64 -right-14 -z-1'></div>
    </section>
  );
}
