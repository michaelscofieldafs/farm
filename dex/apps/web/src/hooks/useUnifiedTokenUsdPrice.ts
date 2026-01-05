import { useMemo } from 'react'
import { ChainId, NonEVMChainId } from '@pancakeswap/chains'
import { Currency, UnifiedCurrency } from '@pancakeswap/sdk'

import { useCurrencyUsdPrice } from './useCurrencyUsdPrice'

export function useUnifiedTokenUsdPrice(currency?: UnifiedCurrency, enabled: boolean = true) {
  const isSolana = currency?.chainId === NonEVMChainId.SOLANA
  const isEvm = currency?.chainId && currency?.chainId in ChainId

  const evmPrice = useCurrencyUsdPrice(isEvm ? (currency as Currency) : undefined, { enabled })

  return useMemo(() => {
    if (isEvm) {
      return evmPrice
    }
    return { data: 0, isLoading: false, error: undefined }
  }, [evmPrice, isEvm, isSolana])
}
