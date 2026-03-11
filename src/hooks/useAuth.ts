import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../api/axios';
import type { Account, LoginData, LoginResponse } from '../types/Account';

let isAlerting = false;

export const useAuth = () => {
  const navigate = useNavigate();

  const getStoredUser = (): Account | null => {
    const saved = localStorage.getItem('currentUser');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const [userInfo, setUserInfo] = useState<Account | null>(getStoredUser);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUserInfo(null);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      // 백엔드가 객체를 한 번 더 감싸서 보낼 경우를 대비
      const userData = response.data?.data || response.data;

      const mergedUser = { ...getStoredUser(), ...userData };
      localStorage.setItem('currentUser', JSON.stringify(mergedUser));
      setUserInfo(mergedUser);
    } catch (error) {
      console.error('사용자 최신 정보 갱신 실패:', error);
    }
  }, []);

  useEffect(() => {
    fetchMe();
    window.addEventListener('auth-change', fetchMe);
    window.addEventListener('storage', fetchMe);
    return () => {
      window.removeEventListener('auth-change', fetchMe);
      window.removeEventListener('storage', fetchMe);
    };
  }, [fetchMe]);

  const login = async (credentials: LoginData): Promise<boolean> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const data = response.data;

      // 혹시 데이터 포맷이 깊을 경우를 대비
      const userData = (data as any).data?.user || data.user || data;

      localStorage.setItem('accessToken', data.accessToken || (data as any).token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUserInfo(userData);

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

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('wish_list');
    setUserInfo(null);
    window.dispatchEvent(new Event('auth-change'));
    alert('로그아웃 되었습니다.');
    navigate('/');
  }, [navigate]);

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

  const updateUserInfo = async (updateData: Partial<Account>): Promise<boolean> => {
    try {
      const response = await api.patch('/auth/update', updateData);
      const data = response.data;
      const updatedUser = data.data?.user || data.user || data;

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
