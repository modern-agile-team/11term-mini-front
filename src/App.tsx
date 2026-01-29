import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { OverlayProvider, overlay } from 'overlay-kit';
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
import SellerManager from './components/seller/SellerManeger';

const AppContent = () => {
  const location = useLocation();
  const isSellerCenter = location.pathname === '/seller-center';
  const handleLoginClick = () => {
    overlay.open(({ isOpen, close }) => <LoginModal isOpen={isOpen} onClose={close} />);
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen relative">
      <Header onLoginClick={handleLoginClick} />

      {!isSellerCenter && <QuickMenu />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller-center" element={<SellerCenter />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/sell" element={<SellerManager />} />
      </Routes>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <OverlayProvider>
      <Router>
        <AppContent />
      </Router>
    </OverlayProvider>
  );
}

export default App;
