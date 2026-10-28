import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieInfo from "./pages/MovieInfo";
import Page404 from "./pages/Page404";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/info/:id" element={<MovieInfo />} />
          <Route path="/*" element={<Page404 />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
