import React from 'react'
import { Metadata } from 'next'
import SavvyFarmIntro from '@/components/HomeSection/Intro'
import SavvyFarmReferral from '@/components/HomeSection/Referral'
import SavvyFarmPools from '@/components/HomeSection/Pools'
import SavvyFarmRewardEmission from '@/components/HomeSection/RewardEmission'
import SavvyFarmShop from '@/components/HomeSection/Shop'
import SavvyFarmStatisticsDashboard from '@/components/HomeSection/FarmChart'
import SavvyFarmMarketing from '@/components/HomeSection/Marketing'
import SavvyFarmEcosystem from '@/components/HomeSection/EcoSystem'
export const metadata: Metadata = {
  title: 'SavvyYield',
}

export default function Home() {
  return (
    <main>
      <SavvyFarmIntro />
      <SavvyFarmReferral />
      <SavvyFarmPools />
      {/**
      <Portfolio />
      */}
      <SavvyFarmRewardEmission />
      <SavvyFarmShop />
      <SavvyFarmStatisticsDashboard />
      <SavvyFarmMarketing />
      <SavvyFarmEcosystem />
    </main>
  )
}
