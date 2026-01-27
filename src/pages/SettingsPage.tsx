import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/');
    }
  };

  const handleWithdraw = () => {
    if (window.confirm('정말로 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.')) {
      alert('탈퇴 처리가 완료되었습니다.');
      logout();
      navigate('/');
    }
  };

  const menuItems = [
    { label: 'SNS연동', onClick: () => {} },
    { label: '로그아웃', onClick: handleLogout },
    { label: '탈퇴', onClick: handleWithdraw },
  ];

  return (
    <div className="max-w-[1024px] mx-auto min-h-screen bg-white">
      {/* 헤더 상단 */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-7">계정설정</h1>
      </div>

      {/* 메뉴 리스트 */}
      <div className="mt-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
          >
            <span className="text-[15px] text-gray-800">{item.label}</span>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
