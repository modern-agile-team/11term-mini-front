import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Account, LoginData } from '../types/Account';

let isAlerting = false;

export const useAuth = () => {
  const navigate = useNavigate();

  const getStoredUser = () => {
    const saved = localStorage.getItem('currentUser');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const [userInfo, setUserInfo] = useState<Account | null>(getStoredUser);

  const refreshAuth = useCallback(() => {
    setUserInfo(getStoredUser());
  }, []);

  useEffect(() => {
    window.addEventListener('auth-change', refreshAuth);
    window.addEventListener('storage', refreshAuth);
    return () => {
      window.removeEventListener('auth-change', refreshAuth);
      window.removeEventListener('storage', refreshAuth);
    };
  }, [refreshAuth]);

  //  로그인
  const login = async (credentials: LoginData) => {
    const { data } = await api.post('/api/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    setUserInfo(data.user);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  //  로그아웃
  const logout = useCallback(() => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
      setUserInfo(null);
      window.dispatchEvent(new Event('auth-change'));
      alert('로그아웃 되었습니다.');
      navigate('/');
    }
  }, [navigate]);

  //  회원 탈퇴
  const withdraw = useCallback(async () => {
    if (!window.confirm('정말로 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.')) return;
    try {
      await api.delete('/api/auth/withdraw');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('wish_list');
      setUserInfo(null);
      window.dispatchEvent(new Event('auth-change'));
      alert('탈퇴가 완료되었습니다.');
      navigate('/');
    } catch {
      alert('탈퇴 처리 중 오류 발생');
    }
  }, [navigate]);

  //  정보 수정
  const updateUserInfo = async (updateData: Partial<Account>) => {
    try {
      const { data } = await api.patch('/api/auth/update', updateData);
      localStorage.setItem('currentUser', JSON.stringify(data));
      setUserInfo(data);
      window.dispatchEvent(new Event('auth-change'));
    } catch {
      alert('정보 수정 실패');
    }
  };

  //  권한 체크
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

  return {
    userInfo,
    login,
    logout,
    withdraw,
    requireAuth,
    updateUserInfo,
    isLoggedIn: !!userInfo,
  };
};
