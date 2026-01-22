import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/home';
import CategoryDetail from './pages/CategoryDetail';
import SearchPage from './pages/SearchPage';
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer';
import QuickMenu from './components/QuickMenu';
import LoginModal from './components/LoginModal';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <Router>
      <div className="bg-[#f9f9f9] min-h-screen relative">
        {/* Header가 onLoginClick을 받을 수 있게 연결됨 */}
        <Header onLoginClick={() => setIsLoginModalOpen(true)} />

        <QuickMenu />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>

        <Footer />

        {/* 모달이 켜졌을 때만 렌더링 */}
        {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
      </div>
    </Router>
  );
}

export default App;
