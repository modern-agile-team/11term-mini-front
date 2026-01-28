import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { OverlayProvider } from 'overlay-kit';
import Header from './components/Header';
import Home from './pages/home';
import CategoryDetail from './pages/CategoryDetail';
import SearchPage from './pages/SearchPage';
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer';
import QuickMenu from './components/QuickMenu';
import LoginModal from './components/LoginModal';
import SellerCenter from './pages/SellerCenter';
import MyPage from './pages/Mypage';
import SettingsPage from './pages/SettingsPage';

//  퀵메뉴 및 레이아웃 제어를 위한 서브 컴포넌트
const AppContent = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const location = useLocation();

  const isSellerCenter = location.pathname === '/seller-center';

  return (
    <div className="bg-[#f9f9f9] min-h-screen relative">
      <Header onLoginClick={onLoginClick} />

      {!isSellerCenter && <QuickMenu />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller-center" element={<SellerCenter />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      <Footer />
    </div>
  );
};

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <OverlayProvider>
      <Router>
        <AppContent onLoginClick={() => setIsLoginModalOpen(true)} />

        {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
      </Router>
    </OverlayProvider>
  );
}

export default App;
