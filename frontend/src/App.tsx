import { BrowserRouter, Route, Routes } from "react-router-dom";
import SavvyPreview from "./app/preview";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<SavvyPreview />} />
    </Routes>
  </BrowserRouter >
}

export default App;
