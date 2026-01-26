import { useState, useEffect, useRef } from 'react';
import { VALIDATION_PATTERNS } from '../types/Account';
import { useAuth } from './useAuth';

export const useMyPage = () => {
  const { userInfo, updateUserInfo, requireAuth } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState('상품');
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [isIntroEditing, setIsIntroEditing] = useState(false);

  const [tempNickname, setTempNickname] = useState(userInfo?.nickname || '');
  const [tempIntro, setTempIntro] = useState(userInfo?.shopIntro || '');

  // 페이지 진입 시 로그인 체크
  useEffect(() => {
    requireAuth();
  }, [userInfo]);

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
