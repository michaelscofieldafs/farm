import React from 'react'
import { isSolana } from '@pancakeswap/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { AddEVMLiquidityV3Layout } from './AddEVMLiquidityV3Layout'

export function AddLiquidityV3Layout({ children }: { children: React.ReactNode }) {
  const { chainId } = useActiveChainId()
  return isSolana(chainId) ? (
    <AddEVMLiquidityV3Layout>{children}</AddEVMLiquidityV3Layout>
  ) : (
    <AddEVMLiquidityV3Layout>{children}</AddEVMLiquidityV3Layout>
  )
}
