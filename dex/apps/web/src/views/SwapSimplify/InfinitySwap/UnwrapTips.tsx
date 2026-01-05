import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useWallet } from '@solana/wallet-adapter-react'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import React from 'react'

export const UnwrapTips: React.FC = () => {
  const { t } = useTranslation()
  const { publicKey, signTransaction } = useWallet()
  const { solanaAccount, chainId } = useAccountActiveChain()
  const { toastSuccess, toastError } = useToast()

 return null
}

export default UnwrapTips
