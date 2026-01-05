import { WETH9, ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, CAKE } from './common'

export const sonicTestnetTokens = {
  weth: WETH9[ChainId.SONIC_TESTNET],
  usdc: USDC[ChainId.SONIC_TESTNET],
  cake: CAKE[ChainId.SONIC_TESTNET],
  mockA: new ERC20Token(ChainId.SONIC_TESTNET, '0x15571d4a7D08e16108b97cf7c80Ffd5C3fcb9657', 18, 'A', 'Mock A'),
}
