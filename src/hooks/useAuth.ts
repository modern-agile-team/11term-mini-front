import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../types/Account';

export const useAuth = () => {
  const navigate = useNavigate();

  //  초기 사용자 정보 로드
  const [userInfo, setUserInfo] = useState<Account | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  //  비로그인 사용자 튕겨내기 (필요 시 호출)
  const requireAuth = () => {
    if (!userInfo) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/');
      return false;
    }
    return true;
  };

  //  로컬 스토리지 데이터 동기화 함수
  const updateUserInfo = (updateData: Partial<Account>) => {
    if (!userInfo) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUserFullData = users.find((u: Account) => u.email === userInfo.email);

    if (!currentUserFullData) {
      alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    const updatedUser = { ...currentUserFullData, ...updateData };
    const updatedUsers = users.map((u: Account) => (u.email === userInfo.email ? updatedUser : u));

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    setUserInfo(updatedUser);
    // 다른 컴포넌트에 변경 알림
    window.dispatchEvent(new Event('auth-change'));
  };

  return {
    userInfo,
    updateUserInfo,
    requireAuth,
    isLoggedIn: !!userInfo,
  };
};
