import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src="/images/logo/savvy-logo.png"
        alt="logo"
        width={100}
        height={100}
        quality={100}
      />
    </Link>
  );
};

export default Logo;
