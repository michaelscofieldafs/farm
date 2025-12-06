import { Icon } from '@iconify/react'
import { Link } from "react-router-dom";
import { FC } from 'react'
import Logo from '../Header/Logo'
import { headerData } from '../Header/Navigation/menuData'

const Footer: FC = () => {
  return (
    <footer className='pt-16 bg-gradient-to-b from-[#071019] to-[#0b1418]'>
      <div className='container px-4'>
        {/* Flex container principal: esquerda (logo) e direita (links) */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12'>

          {/* Coluna esquerda: logo, redes e copyright */}
          <div className='flex flex-col gap-8'>
            <Logo />
            <div className='flex gap-6 items-center'>
              <Link to='#' className='group'>
                <Icon
                  icon='fa6-brands:telegram'
                  width='24'
                  height='24'
                  className='text-white group-hover:text-primary'
                />
              </Link>
              <Link to='#' className='group'>
                <Icon
                  icon='fa6-brands:x-twitter'
                  width='24'
                  height='24'
                  className='text-white group-hover:text-primary'
                />
              </Link>
            </div>
            <div className='flex-col sm:flex-row sm:gap-4 mt-4 mb-10'>
              <h3 className='text-white text-24 font-medium'>
                2025 Copyright
              </h3>
              <Link className='text-white text-24 font-medium hover:text-primary' to="/">
                SavvyGirl.app
              </Link>
            </div>
          </div>

          {/* Coluna direita: lista de links horizontal */}
          <div className='flex flex-wrap gap-6'>
            {headerData.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className='text-white hover:text-primary text-17'>
                {item.label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
