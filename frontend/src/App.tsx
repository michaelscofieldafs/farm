import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Web3Provider } from './components/Web3Provider';
import { ToastContainer } from "react-toastify";
import Home from "./app/home";
import Layout from "./Layout";
import TicTacToeOnChain from "./app/games/page";
import { AppContextProvider } from "./context/appContext";
import SavvyFarmShop from "./app/shop";
import Farm from "./app/farm";
import SavvyFarmDex from "./app/dex";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return <BrowserRouter>
    <Web3Provider>
      <AppContextProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<TicTacToeOnChain />} />
            <Route path="/farm" element={<Farm />} />
            <Route path="/shop" element={<SavvyFarmShop />} />
            <Route path="/dex" element={<SavvyFarmDex />} />
          </Route>
        </Routes>
        <ToastContainer />
      </AppContextProvider>
    </Web3Provider>
  </BrowserRouter>
}

export default App;
