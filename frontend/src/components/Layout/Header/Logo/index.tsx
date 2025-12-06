import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to="/">
      <img
        src="/images/logo/savvygirlapplogo.png"
        alt="logo"
        width={200}
        height={200}
      />
    </Link>
  );
};

export default Logo;
