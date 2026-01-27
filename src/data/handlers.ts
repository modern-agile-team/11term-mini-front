import { http, HttpResponse } from 'msw';
import type { Account, LoginData, SignupData } from '../types/Account';

export const handlers = [
  // 1. 로그인: wishList 필드 추가 반환
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginData;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: LoginData) => u.email === email && u.password === password);

    if (!user) {
      return new HttpResponse(null, { status: 401, statusText: 'Invalid credentials' });
    }

    const accessToken = `fake-jwt-token-${btoa(email)}`;

    const userInfo: Account = {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      phone: user.phone,
      birth: user.birth,
      joinDate: user.joinDate,
      avatar: user.avatar || '',
      shopIntro: user.shopIntro || '',
      wishList: user.wishList || [],
    };

    return HttpResponse.json({ accessToken, user: userInfo }, { status: 200 });
  }),

  // 2. 회원가입: 기본 wishList 배열 초기화
  http.post('/api/auth/signup', async ({ request }) => {
    const formData = (await request.json()) as SignupData;
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((u: Account) => u.email === formData.email)) {
      return new HttpResponse(null, { status: 400, statusText: 'Email already exists' });
    }

    const newAccount = {
      ...formData,
      id: Date.now().toString(),
      joinDate: new Date().toLocaleDateString(),
      avatar: '',
      shopIntro: `안녕하세요, ${formData.nickname}의 상점입니다.`,
      wishList: [],
    };

    localStorage.setItem('users', JSON.stringify([...users, newAccount]));
    return HttpResponse.json({ success: true }, { status: 201 });
  }),

  // 3. 닉네임 중복 검사
  http.get('/api/auth/check-nickname', ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const isDuplicate = users.some((u: Account) => u.nickname === nickname);
    return HttpResponse.json({ isDuplicate });
  }),

  // 4. 회원 정보 수정
  http.patch('/api/auth/update', async ({ request }) => {
    const updateData = (await request.json()) as Partial<Account>;
    const authHeader = request.headers.get('Authorization');
    const email = authHeader?.split('-').pop() ? atob(authHeader.split('-').pop()!) : null;

    if (!email) return new HttpResponse(null, { status: 401 });

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: Account) => u.email === email);
    if (userIndex === -1) return new HttpResponse(null, { status: 404 });

    const updatedUser = { ...users[userIndex], ...updateData };
    users[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));

    return HttpResponse.json(updatedUser);
  }),

  // 5.  찜하기 토글 API
  http.post('/api/auth/wish', async ({ request }) => {
    const { productId } = (await request.json()) as { productId: number };
    const authHeader = request.headers.get('Authorization');
    const email = authHeader?.split('-').pop() ? atob(authHeader.split('-').pop()!) : null;

    if (!email) return new HttpResponse(null, { status: 401 });

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: LoginData) => u.email === email);

    if (userIndex === -1) return new HttpResponse(null, { status: 404 });

    const user = users[userIndex];
    const wishList: number[] = user.wishList || [];
    const isExisting = wishList.includes(productId);

    // 찜 목록 토글 로직
    const updatedWishList = isExisting
      ? wishList.filter((id) => id !== productId)
      : [...wishList, productId];

    // 데이터베이스(LocalStorage) 동기화
    users[userIndex] = { ...user, wishList: updatedWishList };
    localStorage.setItem('users', JSON.stringify(users));

    return HttpResponse.json({ wishList: updatedWishList });
  }),

  // 6. 회원 탈퇴
  http.delete('/api/auth/withdraw', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const email = authHeader?.split('-').pop() ? atob(authHeader.split('-').pop()!) : null;
    if (!email) return new HttpResponse(null, { status: 401 });

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter((u: Account) => u.email !== email);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    return HttpResponse.json({ success: true });
  }),
];
