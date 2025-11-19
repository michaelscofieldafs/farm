/* eslint-disable no-constant-condition */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import Logo from '@/components/Layout/Header/Logo';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import "./styles.css";
import { CircleLoader } from 'react-spinners';

export interface ModalDepositProps {
  show: boolean;
  title: string;
  balance: number | BigNumber | string;
  balanceValue: number | BigNumber | string;
  handleDeposit: () => void;
  handleShow: () => void;
  value: Number | BigNumber | string;
  handleValue: (value: Number | BigNumber | string) => void;
  isLoading: boolean;
  buttonTitle: string;
  decimals: number;
}

const ModalDeposit = ({ show, title, balance, balanceValue, handleDeposit, handleShow, value, handleValue, isLoading, buttonTitle, decimals }: ModalDepositProps) => {
  const [displayValue, setDisplayValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    input = input.replace(/[^0-9.]/g, '');

    const parts = input.split('.');
    if (parts.length > 2) {
      input = parts[0] + '.' + parts.slice(1).join('');
    }

    if (parts[1]?.length > decimals) {
      input = parts[0] + '.' + parts[1].slice(0, decimals);
    }

    setDisplayValue(input);
    handleValue(input);
  };

  const handleMax = () => {
    handleValue(balanceValue);
    setDisplayValue(String(balanceValue));
  }

  useEffect(() => {
    if (String(title).toUpperCase().includes("DEPOSIT")) {
      let input = String(value);

      input = input.replace(/[^0-9.]/g, '');

      const parts = input.split('.');
      if (parts.length > 2) {
        input = parts[0] + '.' + parts.slice(1).join('');
      }

      if (parts[1]?.length > decimals) {
        input = parts[0] + '.' + parts[1].slice(0, decimals);
      }

      setDisplayValue(input);
    }
  }, [value])

  useEffect(() => {
    if (!show) {
      setDisplayValue('');
    }
  }, [show])

  return ReactDOM.createPortal(
    show ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,24,40,0.85)] backdrop-blur-md">
        <div className=" p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-[#3d3d3d] relative"
          style={{ background: 'linear-gradient(to bottom right, #072933, rgba(10, 179, 100, 0.1))' }}>
          <button
            onClick={() => {
              setDisplayValue('');
              handleShow();
            }}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          >
            ✕
          </button>

          <div className="flex justify-center mb-10">
            <Logo />
          </div>

          <div className="mb-4 relative">
            <div
              className="text-white bg-transparent border border-dark_border/60 rounded-md px-3 py-2 text-start"
            >
              {title}
            </div>
          </div>

          {/**
            <div className="mb-4">
              <input
                id="crypto-price"
                type="text"
                name="price"
                className="text-white bg-[#1f232a] border border-dark_border/60 rounded-md px-3 py-2 w-full focus:border-primary focus-visible:outline-0"
                value={`$${value}`}
                disabled
                required
              />
            </div>
          */}

          <div className="mb-4 flex items-center gap-2">
            <input
              id="amount"
              type="text"
              name="amount"
              placeholder="Amount"
              value={displayValue}
              onChange={handleChange}
              className="text-white bg-[#1f232a] border border-dark_border/60 rounded-md px-3 py-2 w-full focus:border-primary focus-visible:outline-0"
            />

            <button
              className="clickable-button border border-primary text-primary font-bold rounded-md px-3 py-2 hover:bg-primary/10 transition"
              onClick={handleMax}
              style={{ background: 'transparent' }}
            >
              MAX
            </button>
          </div>
          <p className="text-muted text-[13px] text-primary mt-10 mb-10 text-right">
            {`Balance: ${balance}`}
          </p>
          <button
            onClick={handleDeposit}
            disabled={isLoading}
            className="text-darkmode font-medium text-18 bg-primary w-full border border-primary rounded-lg py-3 hover:text-primary hover:bg-transparent transition"
          >
            {buttonTitle == '' || buttonTitle == null ? "LOADING..." : buttonTitle} {isLoading && <CircleLoader color="#fff" loading={isLoading} size={18} />}
          </button>
        </div>
      </div>
    ) : null,
    document.getElementById('modal') as HTMLElement
  );
};

export default ModalDeposit;