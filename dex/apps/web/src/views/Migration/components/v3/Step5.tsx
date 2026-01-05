import { useTranslation } from '@pancakeswap/localization'
import { AtomBox, Heading } from '@pancakeswap/uikit'
import { useCakePrice } from 'hooks/useCakePrice'
import FarmTable from 'views/Farms/components/FarmTable/FarmTable'
import { useAccount } from 'wagmi'

export function Step5() {
  const { address: account } = useAccount()


  const userDataReady = !account || (!!account)

  const cakePrice = useCakePrice()

  const { t } = useTranslation()

  return (
    <>
      <FarmTable
        header={
          <AtomBox borderTopRadius="32px" p="24px" bg="gradientCardHeader">
            <Heading>{t('Farms')}</Heading>
          </AtomBox>
        }
        farms={[]}
        cakePrice={cakePrice}
        userDataReady={userDataReady}
      />
    </>
  )
}
