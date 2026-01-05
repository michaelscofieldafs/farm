import {
  Currency,
  CurrencyAmount,
  SPLNativeCurrency,
  SPLToken,
  UnifiedCurrency,
  UnifiedCurrencyAmount,
} from '@pancakeswap/sdk'

import { useMemo } from 'react'
import { useCurrencyBalance, useCurrencyBalances } from '../state/wallet/hooks'
import { useAccountActiveChain } from './useAccountActiveChain'

export type UnifiedBalance = CurrencyAmount<Currency> | UnifiedCurrencyAmount<UnifiedCurrency>

export function useUnifiedCurrencyBalance(currency?: UnifiedCurrency | null): UnifiedBalance | undefined {
  const { account: evmAccount, solanaAccount } = useAccountActiveChain()
  const isSolana = currency && 'programId' in currency

  const evmBalance = useCurrencyBalance(evmAccount, currency as Currency)

  if (evmBalance) {
    return evmBalance
  }
  return undefined
}

export function useUnifiedCurrencyBalances(
  currencies?: (UnifiedCurrency | undefined)[],
): (UnifiedBalance | undefined)[] {
  const { account: evmAccount, solanaAccount } = useAccountActiveChain()

  // Separate Solana and EVM currencies while keeping track of their original positions
  const solanaCurrencies = useMemo(() => {
    return currencies?.filter((currency) => currency && SPLToken.isSPLToken(currency)) as SPLToken[]
  }, [currencies])

  const evmCurrencies = useMemo(() => {
    return currencies?.filter((currency) => currency && !SPLToken.isSPLToken(currency)) as Currency[]
  }, [currencies])

  // Get addresses for Solana tokens
  const solanaCurrenciesAddresses = useMemo(() => {
    return solanaCurrencies?.map((currency) => currency.address) || []
  }, [solanaCurrencies])

  const evmBalances = useCurrencyBalances(evmAccount, evmCurrencies?.length > 0 ? evmCurrencies : undefined)

  // Map each currency to its balance, preserving original order
  return useMemo(() => {
    if (!currencies) return []

    return currencies.map((currency) => {
      if (!currency) return undefined

      // Handle EVM currencies
      const evmIndex = evmCurrencies?.findIndex((evmCurrency) => evmCurrency === currency)
      return evmIndex !== undefined && evmIndex >= 0 ? evmBalances?.[evmIndex] : undefined
    })
  }, [currencies, evmBalances, evmCurrencies])
}
