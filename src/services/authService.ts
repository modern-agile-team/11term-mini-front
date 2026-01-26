import type { Account, LoginData, SignupData } from '../types/Account';

export const authService = {
  getUsers: (): (Account & { password: string })[] => {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch {
      return [];
    }
  },

  login: (data: LoginData): Account | null => {
    const users = authService.getUsers();
    const user = users.find((u) => u.email === data.email && u.password === data.password);

    if (user) {
      const userInfo: Account = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        birth: user.birth,
        nickname: user.nickname,
        joinDate: user.joinDate,
        avatar: user.avatar,
        shopIntro: user.shopIntro,
      };

      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      window.dispatchEvent(new Event('auth-change'));
      return userInfo;
    }
    return null;
  },

  checkNicknameDuplicate: (nickname: string): boolean => {
    const users = authService.getUsers();
    return users.some((u) => u.nickname === nickname);
  },

  signup: (formData: SignupData): boolean => {
    const users = authService.getUsers();
    if (users.some((u) => u.email === formData.email)) return false;

    const newAccount: Account & { password: string } = {
      ...formData,
      id: Date.now().toString(),
      joinDate: new Date().toLocaleDateString(),
      avatar: '',
      shopIntro: `안녕하세요, ${formData.nickname}의 상점입니다.`,
    };

    localStorage.setItem('users', JSON.stringify([...users, newAccount]));
    return true;
  },
};
