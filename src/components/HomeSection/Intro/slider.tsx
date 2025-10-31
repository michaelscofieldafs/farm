'use client'
import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

export interface CardSliderProps {
  data: Array<any>;
}

const CardSlider = ({ data }: CardSliderProps) => {
  const settings = {
    autoplay: true,
    dots: false,
    arrows: false,
    infinite: true,
    autoplaySpeed: 1500,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    cssEase: 'ease-in-out',
    responsive: [
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  }
  return (
    <div className='mt-16'>
      <Slider {...settings}>
        {data.map((item, index) => (
          <div key={index} className='pr-6'>
            <div className='px-5 py-6 bg-dark_grey/80 rounded-xl'>
              <div className='flex items-center gap-5'>
                <div
                  className={`${item.background} ${item.padding} rounded-full`}>
                  <Image
                    src={item.image}
                    alt='icon'
                    width={50}
                    height={50}
                  />
                </div>
                <p className='text-white text-xs font-normal '>
                  <span className='text-16 font-bold mr-2'>{item.name}</span>
                  {item.symbol.toUpperCase()}
                </p>
              </div>
              <div className='flex justify-between mt-7'>
                <div className=''>
                  <p className='text-16 font-bold text-white mb-0 leading-none'>
                    {`${Number(item.current_price).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  </p>
                </div>
                <div className=''>
                  <span className={`text-xs ${item.price_change_percentage_24h > 0 ? 'text-success' : 'text-error'
                    }`}>{`${item.price_change_percentage_24h}%`}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default CardSlider
