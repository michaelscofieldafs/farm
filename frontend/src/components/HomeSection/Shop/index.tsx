import React from "react";

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

const ProductCard = ({ title, price, imgColor }: any) => (
  <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col gap-1">
    <ShirtMock color={imgColor} />
    <div className="flex-1">
      <h3 className="text-white text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-white/60">$ {price}</p>
    </div>
    <button className="inline-flex mt-4 items-center justify-center rounded-xl px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium shadow-lg transition">
      Available for purchase soon
    </button>
  </div>
);

export default function SavvyFarmShop() {
  return (
    <section className='bg-gradient-to-b from-[#071019] to-[#0b1418]' id='shop'>
      <div className='container px-4 mx-auto lg:max-w-(--breakpoint-xl)'>
        <div className="w-full text-white">
          <div className="pointer-events-none fixed inset-0 opacity-40">
            <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-emerald-500 blur-[140px]" />
            <div className="absolute top-1/2 -right-40 size-[520px] rounded-full bg-cyan-500 blur-[160px]" />
          </div>

          <section className="relative z-10" style={{ background: 'transparent' }}>
            <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
              <div className="space-y-6">
                <p className='text-white sm:text-28 text-18 mb-3'><span className='text-primary'>Savvy</span> Shop</p>
                <h2 className='text-white sm:text-40 text-30  font-medium mb-5'>
                  Buy personalized products and contribute to the SavvyYield ecosystem
                </h2>
                <p className='text-muted/60 text-18 mb-7'>
                  A percentage of sales will be used for sustainability, as well as the purchase and burn of $SAVVY.
                </p>
                {/**
                <div className="flex flex-wrap gap-4">
                  <a href="#shop" className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-3 shadow-lg transition">BUY NOW</a>
                </div>
                 */}
              </div>
              <div className="relative">
                <ShirtMock />
              </div>
            </div>
          </section>

          <section className="relative z-10 pb-8" style={{ background: 'transparent' }}>
            <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Buy and burn of $SAVVY</h3>
                  <p className="text-white/60 text-sm">Strengthen $SAVVY</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Platform sustainability</h3>
                  <p className="text-white/60 text-sm">Help support the platform’s sustainability</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Shop with crypto</h3>
                  <p className="text-white/60 text-sm">Pay your way using the Sonic chain</p>
                </div>
              </div>
            </div>
          </section>

          <section id="shop" className="relative z-10 py-14" style={{ background: 'transparent' }}>
            <div className="mx-auto max-w-7xl px-6">
              <h2 className="text-3lg md:text-2xl font-small text-center mb-10">Check out our products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard title="SavvyGirl World Shirt" price="10.00" imgColor="#0f0f10" />
                <ProductCard title="SavvyGirl World Shirt" price="10.00" imgColor="#a31111" />
                <ProductCard title="SavvyGirl World Shirt" price="10.00" imgColor="#c7c9cc" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
