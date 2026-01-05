import { useTranslation } from '@pancakeswap/localization'
import { Price, UnifiedCurrency } from '@pancakeswap/swap-sdk-core'
import { Flex, FlexGap, IconButton, SwapHorizIcon, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Bound } from '@pancakeswap/widgets-internal'
import { memo, useCallback, useMemo, useState } from 'react'

type PriceRangeProps = {
  quote?: UnifiedCurrency
  base?: UnifiedCurrency
  priceUpper?: Price<UnifiedCurrency, UnifiedCurrency>
  priceLower?: Price<UnifiedCurrency, UnifiedCurrency>
  tickAtLimit: {
    LOWER?: boolean
    UPPER?: boolean
  }
}

export const PriceRange = memo(({ base, quote, priceLower, priceUpper, tickAtLimit }: PriceRangeProps) => {
  const [priceBaseInvert, setPriceBaseInvert] = useState(false)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const toggleSwitch: React.MouseEventHandler<HTMLOrSVGElement> = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setPriceBaseInvert(!priceBaseInvert)
    },
    [priceBaseInvert],
  )

  const [baseSymbol, quoteSymbol, priceMin, priceMax] = useMemo(
    () =>
      !priceBaseInvert
        ? [base?.symbol, quote?.symbol, priceLower, priceUpper]
        : [quote?.symbol, base?.symbol, priceUpper?.invert(), priceLower?.invert()],
    [base?.symbol, quote?.symbol, priceLower, priceUpper, priceBaseInvert],
  )

  const { isMobile } = useMatchBreakpoints()

  return priceUpper && priceLower ? (
    <FlexGap
      flexDirection={isMobile ? 'column' : 'row'}
      aria-hidden
      onClick={toggleSwitch}
      alignItems={isMobile ? 'flex-start' : 'center'}
    >
      {t('Min %minAmount%', {
        minAmount: 1,
      })}{' '}
      /{' '}
      {t('Max %maxAmount%', {
        maxAmount: 1,
      })}{' '}
      {isMobile ? <br /> : <>&nbsp;</>}
      <Flex alignItems="center">
        {t('of %quote% per %base%', {
          quote: quoteSymbol,
          base: baseSymbol,
        })}
        <IconButton variant="text" scale="xs">
          <SwapHorizIcon color="textSubtle" ml="2px" />
        </IconButton>
      </Flex>
    </FlexGap>
  ) : null
})
