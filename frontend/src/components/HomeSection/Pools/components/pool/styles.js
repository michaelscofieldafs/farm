import { isMobile } from "react-device-detect";
import styled from "styled-components";

export const cardStyle = {
  background: 'linear-gradient(to bottom right, #072933, rgba(10, 179, 100, 0.1))',
  padding: 15,
  boxShadow: '1px 1px 4px rgba(61, 184, 93, 0.4)',
  //animation: 'shadowMove 3s infinite linear',
  borderRadius: 10,
  maxWidth: !isMobile ? 400 : '100%',
  minWidth: !isMobile ? 385 : undefined,
  backdropFilter: `blur(50px)`,
  opacity: 0.85,
};

export const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
  `;

export const ImageToken = styled.img`
    width: 50px;
    height: 50px;
    margin-right: 20px;
    border-radius: 40px;
    object-fit: contain;
    background-color: #000;
  `;

export const HeaderDetailsContainer = styled.div`
    
  `;

export const TokenContainer = styled.div`
    text-align: start;
  `;

export const FeeContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 5px;
    margin-right: 10px;
  `;

export const FeeValueContainer = styled.div`
    background: #228345;
    border-radius: 4px;
    padding-right: 5px;
    padding-left: 5px;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 1);
  `;

export const Separator = styled.div`
    flex: 1;
  `;

export const HotContainer = styled.div`
    
  `;

export const HotImage = styled.img`
    heigh: 20px;
    width: 20px;
  `;

export const PoolContainer = styled.div`
    margin-top: 20px;
  `;

export const PoolSectionContainer = styled.div`
    display: flex;
  `;

export const PoolSectionValueContainer = styled.div`
    display: flex;
    flex: 1;
  `;

export const PoolSectionValueDescriptionContainer = styled.div`
    
  `;

export const WalletContainer = styled.div`
    flex: 1;
    margin-top: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 1);
    padding: 10px;
    border-radius: 10px;
  `;

export const WalletTitleContainer = styled.div`
    flex: 1; 
    align-items: flex-start;
    justify-content: flex-start;
  `;

export const WalletValueContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 20px;
    padding-left: 20px;
    margin-top: 5px;
  `;

export const WalletValueDescriptionContainer = styled.div`
    
  `;

export const SliderInputContainer = styled.div`
    margin-top: 20px;
    z-index: 1;
  `;

export const ActionContainer = styled.div`
    flex: 1;
    display: flex;
    margin-top: 20px;
    margin-bottom: 10px;
  `;

export const ActionButtonSeparator = styled.div`
    width: 20px;
  `;

export const ActionButtonWalletContainer = styled.div`
     flex: 1;
     display: flex;
     margin-top: 20px;
     margin-bottom: 10px;
     align-items: center;
     justify-content: center;
  `;