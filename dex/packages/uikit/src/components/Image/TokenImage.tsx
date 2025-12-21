import { styled } from "styled-components";
import Image from "./Image";

const TokenImage = styled(Image)`
  > img {
  }
  &:before {
    left: 0;
    width: 40px;
  }
`;

export default TokenImage;
