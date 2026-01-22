// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/home'; 
import CategoryDetail from './pages/CategoryDetail'; 
import SearchPage from './pages/SearchPage';
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer';
import QuickMenu from './components/QuickMenu'; 

function App() {
  return (
    <Router>
      <div className="bg-[#f9f9f9] min-h-screen relative"> 
        <Header />
        <QuickMenu />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>

        <Footer/>
      </div>
    </Router>
  );
}

export default App;