import { useState, useEffect, useRef, useCallback } from 'react';
import { VALIDATION_PATTERNS } from '../types/Account';
import { useAuth } from './useAuth';
import type { Product } from '../types/Product';
import api from '../api/axios';

export const useMyPage = () => {
  const { userInfo, updateUserInfo, requireAuth } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialRender = useRef(true);

  const [activeTab, setActiveTab] = useState('상품');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [isIntroEditing, setIsIntroEditing] = useState(false);

  const [tempNickname, setTempNickname] = useState(userInfo?.nickname || '');
  const [tempIntro, setTempIntro] = useState(userInfo?.shopIntro || '');

  const userId = userInfo?.id;

  // 내 상품 조회 로직
  const fetchMyProducts = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await api.get('/api/products');
      const data: Product[] = Array.isArray(response.data)
        ? response.data
        : response.data.products || [];

      const filtered = data.filter((p) => String(p.sellerId) === String(userId));
      setMyProducts(filtered);
    } catch (error) {
      console.error('내 상품 로딩 실패:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (isInitialRender.current) {
      requireAuth();
      if (userId) {
        fetchMyProducts();
      }
      isInitialRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getOpenDays = (joinDate: string) => {
    if (!joinDate) return 1;
    const startDate = new Date(joinDate.replace(/\./g, '-'));
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const saveNickname = () => {
    if (!VALIDATION_PATTERNS.nickname.test(tempNickname)) {
      alert('닉네임은 한글, 영문, 숫자 조합 2~10자로 입력해주세요.');
      return;
    }
    updateUserInfo({ nickname: tempNickname });
    setIsNicknameEditing(false);
  };

  const saveIntro = () => {
    if (tempIntro.length > 1000) {
      alert('소개글은 최대 1000자까지 작성 가능합니다.');
      return;
    }
    updateUserInfo({ shopIntro: tempIntro });
    setIsIntroEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserInfo({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    userInfo,
    activeTab,
    setActiveTab,
    myProducts,
    isNicknameEditing,
    setIsNicknameEditing,
    isIntroEditing,
    setIsIntroEditing,
    tempNickname,
    setTempNickname,
    tempIntro,
    setTempIntro,
    fileInputRef,
    getOpenDays,
    saveNickname,
    saveIntro,
    handleImageChange,
  };
};
