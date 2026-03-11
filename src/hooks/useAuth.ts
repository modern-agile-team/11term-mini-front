import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../api/axios';
import type { Account, LoginData, LoginResponse } from '../types/Account';

let isAlerting = false;

const normalizeUser = (user: Account | null): Account | null => {
  if (!user) return null;

  return {
    ...user,
    avatar: user.avatar || '',
    shopIntro: user.shopIntro || '',
    wishList: Array.isArray(user.wishList) ? user.wishList : [],
    followers: Array.isArray(user.followers) ? user.followers : [],
    following: Array.isArray(user.following) ? user.following : [],
    createdAt: user.createdAt || new Date().toISOString(),
  };
};

export const useAuth = () => {
  const navigate = useNavigate();

  const getStoredUser = (): Account | null => {
    const saved = localStorage.getItem('currentUser');
    try {
      return saved ? (normalizeUser(JSON.parse(saved) as Account) as Account) : null;
    } catch {
      return null;
    }
  };

  const [userInfo, setUserInfo] = useState<Account | null>(getStoredUser);

  const refreshAuth = useCallback(() => {
    setUserInfo(normalizeUser(getStoredUser()));
  }, []);

  useEffect(() => {
    window.addEventListener('auth-change', refreshAuth);
    window.addEventListener('storage', refreshAuth);
    return () => {
      window.removeEventListener('auth-change', refreshAuth);
      window.removeEventListener('storage', refreshAuth);
    };
  }, [refreshAuth]);

  // 1. 로그인
  const login = async (credentials: LoginData): Promise<boolean> => {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', credentials);

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setUserInfo(data.user);

      window.dispatchEvent(new Event('auth-change'));
      return true;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || '이메일 또는 비밀번호를 확인해주세요.');
      } else {
        alert('로그인 처리 중 오류가 발생했습니다.');
      }
      return false;
    }
  };

  // 2. 로그아웃
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('wish_list');
    setUserInfo(null);
    window.dispatchEvent(new Event('auth-change'));
    alert('로그아웃 되었습니다.');
    navigate('/');
  }, [navigate]);

  // 3. 회원 탈퇴
  const withdraw = useCallback(async () => {
    try {
      await api.delete('/auth/withdraw');

      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('wish_list');
      setUserInfo(null);

      window.dispatchEvent(new Event('auth-change'));
      alert('탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
      navigate('/');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || '탈퇴 처리 중 오류가 발생했습니다.');
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  }, [navigate]);

  // 4. 정보 수정
  const updateUserInfo = async (updateData: Partial<Account>): Promise<boolean> => {
    try {
      const { data } = await api.patch<{ user: Account }>('/auth/update', updateData);

      const updatedUser = data.user || data;
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
      
      window.dispatchEvent(new Event('auth-change'));
      return true;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || '정보 수정에 실패했습니다.');
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
      return false;
    }
  };

  // 5. 권한 체크
  const requireAuth = useCallback(() => {
    if (!userInfo) {
      if (!isAlerting) {
        isAlerting = true;
        alert('로그인이 필요한 서비스입니다.');
        navigate('/');
        setTimeout(() => {
          isAlerting = false;
        }, 1000);
      }
    }
  }, [userInfo, navigate]);

  return { userInfo, login, logout, withdraw, updateUserInfo, requireAuth };
};
