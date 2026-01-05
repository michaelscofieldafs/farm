import { useEffect, useMemo } from 'react'

import { useAccount } from 'wagmi'

import { Currency } from '@pancakeswap/swap-sdk-core'
import { FlexGap, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { Tooltips } from 'components/Tooltips'
import dayjs from 'dayjs'
import { useUnclaimedFarmRewardsUSDByPoolId, useUnclaimedFarmRewardsUSDByTokenId } from 'hooks/infinity/useFarmReward'
import { useFeesEarnedUSD } from 'hooks/infinity/useFeesEarned'
import { formatAmount } from 'utils/formatInfoNumbers'
import { Address } from 'viem'
import { usePositionEarningAmount } from 'views/universalFarms/hooks/usePositionEarningAmount'
import { formatDollarAmount } from 'views/V3Info/utils/numbers'

// Helper function to standardize number conversion
const safeParseFloat = (value: string | number | undefined): number => {
  if (value === undefined || value === null) return 0
  const parsed = typeof value === 'string' ? parseFloat(value) : value
  return Number.isNaN(parsed) ? 0 : parsed
}

const EarningsUSD = ({ earningsBusd }: { earningsBusd: number }) => {
  return <div>~${formatNumber(earningsBusd)}</div>
}

export const InfinityBinEarningsCell = ({ chainId, poolId }: { chainId?: number; poolId?: Address }) => {
  const { address } = useAccount()
  const {
    data: { rewardsAmount, rewardsUSD },
    isLoading,
  } = useUnclaimedFarmRewardsUSDByPoolId({
    chainId,
    poolId,
    address,
    timestamp: dayjs().startOf('hour').unix(),
  })

  // Standardized amount calculation
  const amount = useMemo(() => {
    if (!rewardsAmount) return 0
    const decimal = Math.min(rewardsAmount.currency.decimals ?? 18, 18)
    return safeParseFloat(rewardsAmount.toFixed(decimal))
  }, [rewardsAmount])

  const [, updatePositionEarningAmount] = usePositionEarningAmount()

  useEffect(() => {
    if (!(chainId && poolId && !isLoading)) {
      return
    }
    updatePositionEarningAmount(chainId, poolId, amount)
  }, [amount, chainId, poolId, isLoading, updatePositionEarningAmount])

  // Note: No Bin LP fees calculation
  return (
    <Tooltips
      content={
        <FlexGap flexDirection="column" alignItems="flex-start" gap="8px">
          {rewardsAmount && rewardsAmount.greaterThan(0) && (
            <FlexGap flexDirection="column" alignItems="flex-start" gap="2px" width="100%">
              <FlexGap alignItems="center" justifyContent="space-between" width="100%" gap="16px">
                <FlexGap alignItems="center" gap="8px">
                  <CurrencyLogo currency={rewardsAmount.currency} size="16px" mb="-3px" />
                  <Text fontSize="14px" bold>
                    {rewardsAmount.currency.symbol}
                  </Text>
                </FlexGap>
                <Text fontSize="14px" bold>
                  {formatAmount(amount)}
                </Text>
              </FlexGap>
              <Text color="textSubtle" fontSize="12px" textAlign="right" width="100%">
                {rewardsUSD ? formatDollarAmount(rewardsUSD) : '$0.00'}
              </Text>
            </FlexGap>
          )}
        </FlexGap>
      }
    >
      <EarningsUSD earningsBusd={rewardsUSD} />
    </Tooltips>
  )
}

export const InfinityCLEarningsCell = ({
  tokenId,
  chainId,
  poolId,
  currency0,
  currency1,
  tickLower,
  tickUpper,
  positionClosed = false,
}: {
  tokenId?: bigint
  chainId?: number
  poolId?: Address
  currency0?: Currency
  currency1?: Currency
  tickLower?: number
  tickUpper?: number
  positionClosed?: boolean
}) => {
  const { address } = useAccount()

  // Get farm rewards
  const {
    data: { rewardsAmount, rewardsUSD },
    isLoading,
  } = useUnclaimedFarmRewardsUSDByTokenId({
    chainId,
    tokenId,
    poolId,
    address,
    timestamp: dayjs().startOf('hour').unix(),
  })

  // Get LP fees
  const {
    totalFiatValue: lpFeesUSD,
    feeAmount0,
    feeAmount1,
    fiatValue0,
    fiatValue1,
  } = useFeesEarnedUSD({
    currency0,
    currency1,
    tokenId,
    poolId,
    tickLower,
    tickUpper,
    enabled: !positionClosed,
  })

  const amount = useMemo(() => {
    if (!rewardsAmount) return 0
    const decimal = Math.min(rewardsAmount.currency.decimals ?? 18, 18)
    return safeParseFloat(rewardsAmount.toFixed(decimal))
  }, [rewardsAmount])

  const [, updatePositionEarningAmount] = usePositionEarningAmount()

  useEffect(() => {
    if (!(chainId && poolId && tokenId && !isLoading)) {
      return
    }
    updatePositionEarningAmount(chainId, poolId, tokenId, amount)
  }, [amount, chainId, poolId, tokenId, isLoading, updatePositionEarningAmount])

  // Standardized LP fee conversion
  const lpFeesUSDValue = useMemo(() => {
    return lpFeesUSD ? safeParseFloat(lpFeesUSD.toExact()) : 0
  }, [lpFeesUSD])

  // Combine farm rewards + LP fees
  const totalEarnings = rewardsUSD + lpFeesUSDValue

  if (positionClosed) {
    return <EarningsUSD earningsBusd={totalEarnings} />
  }

  return (
    <Tooltips
      content={
        <FlexGap flexDirection="column" alignItems="flex-start" gap="8px">
          {feeAmount0 && feeAmount0.greaterThan(0) && (
            <FlexGap flexDirection="column" alignItems="flex-start" gap="2px" width="100%">
              <FlexGap alignItems="center" justifyContent="space-between" width="100%" gap="16px">
                <FlexGap alignItems="center" gap="8px">
                  <CurrencyLogo currency={currency0} size="16px" mb="-3px" />
                  <Text fontSize="14px" bold>
                    {currency0?.symbol}
                  </Text>
                </FlexGap>
                <Text fontSize="14px" bold>
                  {formatAmount(Number(feeAmount0?.toExact()) ?? 0)}
                </Text>
              </FlexGap>
              <Text color="textSubtle" fontSize="12px" textAlign="right" width="100%">
                {fiatValue0 ? formatDollarAmount(safeParseFloat(fiatValue0.toExact())) : '$0.00'}
              </Text>
            </FlexGap>
          )}
          {feeAmount1 && feeAmount1.greaterThan(0) && (
            <FlexGap flexDirection="column" alignItems="flex-start" gap="2px" width="100%">
              <FlexGap alignItems="center" justifyContent="space-between" width="100%" gap="16px">
                <FlexGap alignItems="center" gap="8px">
                  <CurrencyLogo currency={currency1} size="16px" mb="-3px" />
                  <Text fontSize="14px" bold>
                    {currency1?.symbol}
                  </Text>
                </FlexGap>
                <Text fontSize="14px" bold>
                  {formatAmount(Number(feeAmount1?.toExact()) ?? 0)}
                </Text>
              </FlexGap>
              <Text color="textSubtle" fontSize="12px" textAlign="right" width="100%">
                {fiatValue1 ? formatDollarAmount(safeParseFloat(fiatValue1.toExact())) : '$0.00'}
              </Text>
            </FlexGap>
          )}
          {rewardsAmount && rewardsAmount.greaterThan(0) && (
            <FlexGap flexDirection="column" alignItems="flex-start" gap="2px" width="100%">
              <FlexGap alignItems="center" justifyContent="space-between" width="100%" gap="16px">
                <FlexGap alignItems="center" gap="8px">
                  <CurrencyLogo currency={rewardsAmount.currency} size="16px" mb="-3px" />
                  <Text fontSize="14px" bold>
                    {rewardsAmount.currency.symbol}
                  </Text>
                </FlexGap>
                <Text fontSize="14px" bold>
                  {formatAmount(amount)}
                </Text>
              </FlexGap>
              <Text color="textSubtle" fontSize="12px" textAlign="right" width="100%">
                {rewardsUSD ? formatDollarAmount(rewardsUSD) : '$0.00'}
              </Text>
            </FlexGap>
          )}
        </FlexGap>
      }
    >
      <EarningsUSD earningsBusd={totalEarnings} />
    </Tooltips>
  )
}
