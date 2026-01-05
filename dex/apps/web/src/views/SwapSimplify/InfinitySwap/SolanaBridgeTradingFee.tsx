import { BridgeOrder } from '@pancakeswap/price-api-sdk'
import { SkeletonV2, Text } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { memo, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { formatNumber } from '@pancakeswap/utils/formatNumber'

import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { isSolana } from '@pancakeswap/chains'
import { formatDollarAmount } from 'views/V3Info/utils/numbers'

export const SolanaBridgeEVMToSolanaTradingFee = memo(
  ({ order, textColor }: { order: BridgeOrder; textColor?: string }) => {
    const inputCurrency = order.trade.inputAmount.currency

    const { data: price, isLoading } = useCurrencyUsdPrice(inputCurrency, { enabled: true })

    const convertedFeeAmount = useMemo(() => {
      if (!price || price === 0) return null
      return new BigNumber(order.bridgeFee.toExact()).dividedBy(price)
    }, [order.bridgeFee, price])

    const displayText = useMemo(() => {
      if (convertedFeeAmount !== null) {
        return `~${formatNumber(convertedFeeAmount, { maxDecimalDisplayDigits: 6 })} ${inputCurrency.symbol}`
      }
      return `${formatAmount(order.bridgeFee, 4)} ${order.bridgeFee.currency.symbol}`
    }, [convertedFeeAmount, order.bridgeFee, inputCurrency.symbol])

    return (
      <SkeletonV2 width="100px" height="16px" borderRadius="8px" minHeight="auto" isDataReady={!isLoading}>
        <Text color={textColor} fontSize="14px">
          {displayText}
        </Text>
      </SkeletonV2>
    )
  },
)

export const SolanaBridgeTradingFee = memo(
  ({ order, textColor, showUSDFee }: { order: BridgeOrder; textColor?: string; showUSDFee?: boolean }) => {
    if (showUSDFee) {
      return (
        <Text color={textColor} fontSize="14px">
          {`${formatDollarAmount(new BigNumber(order.bridgeFee.toExact()).toNumber(), 3)}`}
        </Text>
      )
    }

    const feeText = isSolana(order.bridgeFee.currency.chainId) ? (
      <SolanaBridgeEVMToSolanaTradingFee order={order} textColor={textColor} />
    ) : (
      <SolanaBridgeEVMToSolanaTradingFee order={order} textColor={textColor} />
    )

    return <>{feeText}</>
  },
)
