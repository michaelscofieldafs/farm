import { Link } from "react-router-dom";

const SavvyFarmEcosystem = () => {
  return (
    <section className='md:pt-20 sm:pt-24 pt-12 pb-20 relative z-1'>
      <div className='container px-4'>
        <div className="bg-section/10 px-16 py-14 rounded-3xl border-2 border-section/20 grid grid-cols-12 items-center before:content-[''] before:absolute relative before:w-96 before:h-64 before:bg-start before:bg-no-repeat before:-bottom-11 overflow-hidden lg:before:right-48 before:-z-1 before:opacity-10 ">
          <div className='lg:col-span-12 col-span-12'>
            <h2 className='text-white sm:text-40 text-30 mb-6 text-center'>
              SavvyFarm a <span className='text-primary'>Multichain</span> Yield Farm
            </h2>
            <p className='text-muted/60 text-18'>
              SavvyFarm is a multichain yield farm designed to bring users, communities, and liquidity together across multiple chains. Our goal is to deliver a smarter, safer, and more rewarding DeFi experience, while helping users discover the full potential of multichain innovation. Built for the community, SavvyFarm stands on transparency, innovation, and true ownership.
            </p>
          </div>
        </div>
        <div className='bg-linear-to-br from-tealGreen to-charcoalGray sm:w-50 w-96 sm:h-50 h-96 rounded-full sm:-bottom-80 bottom-0 blur-400 z-0 absolute sm:-left-48 opacity-60'></div>
      </div>
    </section>
  )
}

export default SavvyFarmEcosystem
