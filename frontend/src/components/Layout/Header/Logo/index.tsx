import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src="/images/logo/savvygirlapplogo.png"
        alt="logo"
        width={200}
        height={200}
        quality={100}
      />
    </Link>
  );
};

export default Logo;
