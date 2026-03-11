import { useState, useEffect, useRef } from 'react';
import { VALIDATION_PATTERNS } from '../types/Account';
import { useAuth } from './useAuth';
import type { Product, SaleStatus } from '../types/Product';
import api from '../api/axios';

interface ProductsResponse {
  products?: Product[];
  data?: Product[];
}

export const useMyPage = () => {
  const { userInfo, updateUserInfo } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState('상품');
  const [myProducts, setMyProducts] = useState<Product[]>([]);

  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [isIntroEditing, setIsIntroEditing] = useState(false);

  const [tempNickname, setTempNickname] = useState('');
  const [tempIntro, setTempIntro] = useState('');

  const userId = userInfo?.userId;

  const sortProducts = (products: Product[]) => {
    return [...products].sort((a, b) => {
      if (a.saleStatus === 'SOLD_OUT' && b.saleStatus !== 'SOLD_OUT') return 1;
      if (a.saleStatus !== 'SOLD_OUT' && b.saleStatus === 'SOLD_OUT') return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const startEditingNickname = () => {
    setTempNickname(userInfo?.nickname || '');
    setIsNicknameEditing(true);
  };

  const startEditingIntro = () => {
    setTempIntro(userInfo?.shopIntro || '');
    setIsIntroEditing(true);
  };

  useEffect(() => {
    let ignore = false;

    const fetchMyProducts = async () => {
      if (!userId) return;
      try {
        const response = await api.get<Product[] | ProductsResponse>('/products');
        const responseData = response.data;

        const data: Product[] = Array.isArray(responseData)
          ? responseData
          : responseData.products || responseData.data || [];

        const my = data.filter((product) => String(product.sellerId) === String(userId));

        if (!ignore) {
          setMyProducts(sortProducts(my));
        }
      } catch (error: unknown) {
        console.error('내 상품 로딩 실패:', error);
      }
    };

    fetchMyProducts();

    return () => {
      ignore = true;
    };
  }, [userId]);

  const updateProductStatus = async (productId: number, newStatus: SaleStatus) => {
    try {
      await api.patch(`/products/${productId}/status`, { saleStatus: newStatus });
      setMyProducts((prev) =>
        sortProducts(prev.map((p) => (p.id === productId ? { ...p, saleStatus: newStatus } : p))),
      );
    } catch (error: unknown) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/products/${productId}`);
      setMyProducts((prev) => prev.filter((p) => p.id !== productId));
      alert('상품이 삭제되었습니다.');
    } catch (error: unknown) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const getOpenDays = (joinDate?: string) => {
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
        updateUserInfo({ imageUrl: reader.result as string });
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
    updateProductStatus,
    deleteProduct,
    startEditingNickname,
    startEditingIntro,
  };
};
