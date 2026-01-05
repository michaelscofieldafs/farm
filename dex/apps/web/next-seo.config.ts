import { ASSET_CDN } from 'config/constants/endpoints'
import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | SavvyDEX',
  defaultTitle: 'SavvyDEX',
  description: 'SavvyDEX all-in-one multichain DEX',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@PancakeSwap',
    site: '@PancakeSwap',
  },
  openGraph: {
    title: "🥞 SavvyDEX - Everyone's Favorite DEX",
    description: 'SavvyDEX all-in-one multichain DEX',
    images: [{ url: `${ASSET_CDN}/web/og/v2/hero.jpg` }],
  },
}
