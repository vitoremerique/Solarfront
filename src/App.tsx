import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Erro from "./components/Error";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={token ? <Home /> : <Navigate to="/" />} />
        <Route path="/Erro" element={<Erro/>} />
      </Routes>
    </Router>
  );
}

export default App;
