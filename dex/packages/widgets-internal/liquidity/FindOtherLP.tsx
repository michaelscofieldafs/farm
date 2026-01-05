import Link from "next/link";
import { useTranslation } from "@pancakeswap/localization";
import { Text, Button, AtomBox } from "@pancakeswap/uikit";

export function FindOtherLP({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <AtomBox display="flex" flexDirection="column" alignItems="center" mt="24px">
      <Text color="textSubtle" mb="8px">
        {t("Want search your pair?")}
      </Text>
      <Link href="/find" passHref>
        <Button id="import-pool-link" variant="secondary" scale="sm">
          Find more liquidity pools
        </Button>
      </Link>
      {children}
    </AtomBox>
  );
}
