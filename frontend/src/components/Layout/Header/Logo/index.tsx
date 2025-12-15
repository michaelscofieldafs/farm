import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to="/">
      <img
        src="/images/logo/savvygirlapplogo.png"
        alt="logo"
        width={150}
        height={150}
      />
    </Link>
  );
};

export default Logo;
