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
import ProductEdit from './pages/ProductEdit';
import WithdrawReasonPage from './pages/WithdrawReasonPage';
import WithdrawConfirmPage from './pages/WithdrawConfirmPage';
import ChatPage from './pages/Chatpage';
import { useScrollToTop } from './hooks/useScrollToTop';

const AppContent = () => {
  const location = useLocation();
  const isSellerCenter = location.pathname === '/seller-center';
  useScrollToTop();

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
        <Route path="/edit/:id" element={<ProductEdit />} />
        <Route path="/settings/withdraw/reason" element={<WithdrawReasonPage />} />
        <Route path="/settings/withdraw/confirm" element={<WithdrawConfirmPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <OverlayProvider>
        <AppContent />
      </OverlayProvider>
    </Router>
  );
}

export default App;
