import { useTranslation } from '@pancakeswap/localization'
import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { FlexGap, SkeletonV2, Text } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { memo } from 'react'

import { useIsWrapping, useSlippageAdjustedAmounts } from '../../Swap/V3Swap/hooks'
import { useHasDynamicHook } from '../hooks/useHasDynamicHook'
import { usePriceBreakdown } from '../hooks/usePriceBreakdown'
import { isXOrder } from 'views/Swap/utils'

interface TradingFeeProps {
  loaded: boolean
  order?: PriceOrder
}

export const TradingFee: React.FC<TradingFeeProps> = memo(({ order, loaded }) => {
  const { t } = useTranslation()
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(order)

  const priceBreakdown = usePriceBreakdown(order)

  const hasDynamicHooks = useHasDynamicHook(order)
  const isWrapping = useIsWrapping()

  if (Array.isArray(priceBreakdown)) {
    return null
  }

  if (isWrapping || !order || !order.trade || !slippageAdjustedAmounts) {
    return null
  }

  const { lpFeeAmount } = priceBreakdown

  const { inputAmount } = order.trade


  let feeText: React.ReactNode

 if (isXOrder(order)) {
    feeText = (
      <Text color="primary" fontSize="14px">
        0 {inputAmount?.currency?.symbol}
      </Text>
    )
  } else {
    feeText = (
      <Text color="textSubtle" fontSize="14px">{`${hasDynamicHooks ? '~' : ''}${formatAmount(lpFeeAmount, 4)} ${
        inputAmount?.currency?.symbol
      }`}</Text>
    )
  }

  return (
    <FlexGap gap="8px" alignItems="center">
      <Text color="textSubtle" fontSize="14px">
        {t('Fee.rate')}
      </Text>
      <SkeletonV2 width="108px" height="16px" borderRadius="8px" minHeight="auto" isDataReady={loaded}>
        {feeText}
      </SkeletonV2>
    </FlexGap>
  )
})
