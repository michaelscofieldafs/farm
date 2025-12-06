import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Web3Provider } from './components/Web3Provider';
import { ToastContainer } from "react-toastify";
import Home from "./app/page";
import Layout from "./Layout";
import TicTacToeOnChain from "./app/games/page";
import { AppContextProvider } from "./context/appContext";
import SavvyFarmShop from "./app/shop";

function App() {
  return <BrowserRouter>
    <Web3Provider>
      <AppContextProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<TicTacToeOnChain />} />
            <Route path="/farm" element={<Home />} />
            <Route path="/shop" element={<SavvyFarmShop />} />
          </Route>
        </Routes>
        <ToastContainer />
      </AppContextProvider>
    </Web3Provider>
  </BrowserRouter>
}

export default App;
