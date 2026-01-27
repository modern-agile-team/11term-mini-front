import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../types/Account';

// 알럿 중복 방지를 위한 모듈 스코프 변수
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

  // 1번만 뜨게 수정된 requireAuth
  const requireAuth = useCallback(() => {
    if (!userInfo) {
      if (!isAlerting) {
        isAlerting = true;
        alert('로그인이 필요한 서비스입니다.');
        navigate('/');
        // 알럿 확인 후 플래그 초기화 (약간의 지연을 주어 중복 호출 방지)
        setTimeout(() => {
          isAlerting = false;
        }, 500);
      }
      return false;
    }
    return true;
  }, [userInfo, navigate]);

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUserInfo(null);
    window.dispatchEvent(new Event('auth-change'));
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

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
    requireAuth,
    updateUserInfo,
    isLoggedIn: !!userInfo,
  };
};
