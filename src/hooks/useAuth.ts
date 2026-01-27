import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../types/Account';

let isAlerting = false;

export const useAuth = () => {
  const navigate = useNavigate();

  const getStoredUser = useCallback(() => {
    const saved = localStorage.getItem('currentUser');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const [userInfo, setUserInfo] = useState<Account | null>(getStoredUser);

  const refreshAuth = useCallback(() => {
    setUserInfo(getStoredUser());
  }, [getStoredUser]);

  useEffect(() => {
    window.addEventListener('auth-change', refreshAuth);
    window.addEventListener('storage', refreshAuth);
    return () => {
      window.removeEventListener('auth-change', refreshAuth);
      window.removeEventListener('storage', refreshAuth);
    };
  }, [refreshAuth]);

  // 회원 탈퇴 (전체 목록에서도 삭제)
  const withdraw = useCallback(() => {
    const currentUser = getStoredUser();
    if (!currentUser) return;

    if (window.confirm('정말로 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.')) {
      // 1. 전체 유저 목록(users)에서 현재 이메일과 일치하는 유저 제거
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = allUsers.filter((u: Account) => u.email !== currentUser.email);
      localStorage.setItem('users', JSON.stringify(filteredUsers));

      // 2. 로그인 정보 및 찜 목록 삭제
      localStorage.removeItem('currentUser');
      localStorage.removeItem('wish_list');

      // 3. 상태 업데이트 및 알림
      setUserInfo(null);
      window.dispatchEvent(new Event('auth-change'));
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/');
    }
  }, [getStoredUser, navigate]);

  const logout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('currentUser');
      setUserInfo(null);
      window.dispatchEvent(new Event('auth-change'));
      alert('로그아웃 되었습니다.');
      navigate('/');
    }
  };

  const requireAuth = useCallback(() => {
    if (!userInfo) {
      if (!isAlerting) {
        isAlerting = true;
        alert('로그인이 필요한 서비스입니다.');
        navigate('/');
        setTimeout(() => {
          isAlerting = false;
        }, 500);
      }
      return false;
    }
    return true;
  }, [userInfo, navigate]);

  const updateUserInfo = (updateData: Partial<Account>) => {
    const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = getStoredUser();
    if (!currentUser) return;

    const userIndex = currentUsers.findIndex((u: Account) => u.email === currentUser.email);
    if (userIndex === -1) return;

    const updatedUser = { ...currentUsers[userIndex], ...updateData };
    const updatedUsers = [...currentUsers];
    updatedUsers[userIndex] = updatedUser;

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUserInfo(updatedUser);
    window.dispatchEvent(new Event('auth-change'));
  };

  return {
    userInfo,
    logout,
    withdraw,
    requireAuth,
    updateUserInfo,
    isLoggedIn: !!userInfo,
  };
};
