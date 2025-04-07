import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Firstpage from "./Components/Firstpage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Firstpage />} />
        <Route exact path="/stocksearch" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
