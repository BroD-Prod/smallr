import './App.css';
import Home from './components/home/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
        <BrowserRouter>
        <nav className="navbar">
          <a href="/" className="navbar-home">Smallr</a>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          </BrowserRouter>
  );
}

export default App;
