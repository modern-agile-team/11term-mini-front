import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/home'; 
import CategoryDetail from './pages/CategoryDetail'; 
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="bg-[#f9f9f9] min-h-screen">
        <Header />
        
        <Routes>
          {/* 로고 클릭 시 배너가 있는 Home 노출 */}
          <Route path="/" element={<Home />} />
          
          {/* 카테고리 메뉴 클릭 시 CategoryDetail 노출 */}
          <Route path="/category/:id" element={<CategoryDetail />} />
        </Routes>

        <Footer/>
      </div>
    </Router>
  );
}

export default App;