import Link from 'next/link'

const SavvyFarmEcosystem = () => {
  return (
    <section className='md:pt-20 sm:pt-24 pt-12 pb-20 relative z-1'>
      <div className='container px-4'>
        <div className="bg-section/10 px-16 py-14 rounded-3xl border-2 border-section/20 grid grid-cols-12 items-center before:content-[''] before:absolute relative before:w-96 before:h-64 before:bg-start before:bg-no-repeat before:-bottom-11 overflow-hidden lg:before:right-48 before:-z-1 before:opacity-10 ">
          <div className='lg:col-span-8 col-span-12'>
            <h2 className='text-white sm:text-40 text-30 mb-6'>
              Powered by the <span className='text-primary'>SonicLabs</span>{' '}
              Ecosystem
            </h2>
            <p className='text-muted/60 text-18'>
              SavvyYield is a multichain yield farm with its heart on SonicLabs. While SonicLabs remains our main hub, we’ve expanded across multiple chains to attract new users, grow the community, and ultimately bring more traction back to SonicLabs. Our goal is not only to deliver a smarter, safer, and more rewarding DeFi experience — but also to help users understand the advantages of SonicLabs’ cutting-edge technology. Built for the community, SavvyYield stands on innovation, transparency, and true ownership.
            </p>
          </div>
          <div className='lg:col-span-4 col-span-12'>
            <div className='flex lg:justify-end lg:mt-0 mt-7 justify-center'>
              <Link
                href='#'
                className='text-darkmode bg-primary border border-primary py-3 px-5 rounded-lg sm:text-21 text-18 font-medium hover:bg-transparent hover:text-primary'>
                About us
              </Link>
            </div>
          </div>
        </div>
        <div className='bg-linear-to-br from-tealGreen to-charcoalGray sm:w-50 w-96 sm:h-50 h-96 rounded-full sm:-bottom-80 bottom-0 blur-400 z-0 absolute sm:-left-48 opacity-60'></div>
      </div>
    </section>
  )
}

export default SavvyFarmEcosystem
