import { http, HttpResponse } from 'msw';
import type { Account, FollowUserItem, LoginData, SignupData, UserProfile } from '../types/Account';

type StoredUser = Account & { password?: string };

const parseUsers = (): StoredUser[] => {
  const raw = localStorage.getItem('users');
  try {
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
};

const getTokenEmail = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '') || '';
  const encoded = token.split('-').pop();
  if (!encoded) return null;

  try {
    return atob(encoded);
  } catch {
    return null;
  }
};

const normalizeUser = (user: StoredUser): StoredUser => ({
  ...user,
  avatar: user.avatar || '',
  shopIntro: user.shopIntro || '',
  wishList: Array.isArray(user.wishList) ? user.wishList : [],
  followers: Array.isArray(user.followers) ? user.followers : [],
  following: Array.isArray(user.following) ? user.following : [],
  createdAt: user.createdAt || new Date().toISOString(),
});

const sanitizeUser = (user: StoredUser): Account => {
  const normalized = normalizeUser(user);
  return {
    id: normalized.id,
    email: normalized.email,
    name: normalized.name,
    nickname: normalized.nickname,
    phone: normalized.phone,
    birth: normalized.birth,
    joinDate: normalized.joinDate,
    avatar: normalized.avatar,
    shopIntro: normalized.shopIntro,
    wishList: normalized.wishList,
    followers: normalized.followers,
    following: normalized.following,
    createdAt: normalized.createdAt,
  };
};

const toFollowUserItem = (user: StoredUser): FollowUserItem => ({
  id: user.id,
  nickname: user.nickname,
  avatar: user.avatar,
  shopIntro: user.shopIntro,
});

export const authhandler = [
  // 1. 로그인
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginData;
    const users = parseUsers().map(normalizeUser);
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return new HttpResponse(null, { status: 401, statusText: 'Invalid credentials' });
    }

    const accessToken = `fake-jwt-token-${btoa(email)}`;
    return HttpResponse.json({ accessToken, user: sanitizeUser(user) }, { status: 200 });
  }),

  // 2. 회원가입
  http.post('/api/auth/signup', async ({ request }) => {
    const formData = (await request.json()) as SignupData;
    const users = parseUsers().map(normalizeUser);

    if (users.some((u) => u.email === formData.email)) {
      return new HttpResponse(null, { status: 400, statusText: 'Email already exists' });
    }

    const nowIso = new Date().toISOString();
    const newAccount: StoredUser = {
      ...formData,
      id: Date.now().toString(),
      joinDate: new Date().toLocaleDateString(),
      createdAt: nowIso,
      avatar: '',
      shopIntro: `안녕하세요, ${formData.nickname}의 상점입니다.`,
      wishList: [],
      followers: [],
      following: [],
    };

    localStorage.setItem('users', JSON.stringify([...users, newAccount]));
    return HttpResponse.json({ success: true }, { status: 201 });
  }),

  // 3. 닉네임 중복 검사 (기존/신규 경로 모두 지원)
  http.get('/api/auth/check-nickname', ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    const users = parseUsers().map(normalizeUser);
    const isDuplicate = users.some((u) => u.nickname === nickname);
    return HttpResponse.json({ isDuplicate });
  }),
  http.get('/api/auth/check', ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    const users = parseUsers().map(normalizeUser);
    const isDuplicate = users.some((u) => u.nickname === nickname);
    return HttpResponse.json({ isDuplicate });
  }),

  // 4. 회원 정보 수정
  http.patch('/api/auth/update', async ({ request }) => {
    const updateData = (await request.json()) as Partial<Account>;
    const email = getTokenEmail(request);
    if (!email) return new HttpResponse(null, { status: 401 });

    const users = parseUsers().map(normalizeUser);
    const userIndex = users.findIndex((u) => u.email === email);
    if (userIndex === -1) return new HttpResponse(null, { status: 404 });

    const updatedUser = normalizeUser({ ...users[userIndex], ...updateData });
    users[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));

    return HttpResponse.json(sanitizeUser(updatedUser));
  }),

  // 5.  찜하기 토글 API
  http.post('/api/auth/wish', async ({ request }) => {
    const { productId } = (await request.json()) as { productId: number };
    const email = getTokenEmail(request);
    if (!email) return new HttpResponse(null, { status: 401 });

    const users = parseUsers().map(normalizeUser);
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) return new HttpResponse(null, { status: 404 });

    const user = users[userIndex];
    const wishList = user.wishList.map(String);
    const productIdStr = String(productId);
    const isExisting = wishList.includes(productIdStr);
    const updatedWishList = isExisting
      ? wishList.filter((id) => id !== productIdStr)
      : [...wishList, productIdStr];

    users[userIndex] = { ...user, wishList: updatedWishList };
    localStorage.setItem('users', JSON.stringify(users));

    return HttpResponse.json({ wishList: updatedWishList });
  }),

  // 6. 팔로우/언팔로우 토글
  http.post('/api/auth/follow', async ({ request }) => {
    const { targetUserId } = (await request.json()) as { targetUserId?: string };
    const email = getTokenEmail(request);

    if (!email) return new HttpResponse(null, { status: 401 });
    if (!targetUserId) return new HttpResponse(null, { status: 400, statusText: 'Invalid target' });

    const users = parseUsers().map(normalizeUser);
    const meIndex = users.findIndex((u) => u.email === email);
    const targetIndex = users.findIndex((u) => String(u.id) === String(targetUserId));

    if (meIndex === -1 || targetIndex === -1) return new HttpResponse(null, { status: 404 });
    if (users[meIndex].id === users[targetIndex].id) {
      return new HttpResponse(null, { status: 400, statusText: 'Cannot follow yourself' });
    }

    const me = users[meIndex];
    const target = users[targetIndex];
    const isFollowing = me.following.includes(target.id);

    users[meIndex] = normalizeUser({
      ...me,
      following: isFollowing
        ? me.following.filter((id) => id !== target.id)
        : [...me.following, target.id],
    });
    users[targetIndex] = normalizeUser({
      ...target,
      followers: isFollowing
        ? target.followers.filter((id) => id !== me.id)
        : [...target.followers, me.id],
    });

    localStorage.setItem('users', JSON.stringify(users));

    return HttpResponse.json({
      currentUser: sanitizeUser(users[meIndex]),
      targetUserId: users[targetIndex].id,
      isFollowing: !isFollowing,
      followerCount: users[targetIndex].followers.length,
      followingCount: users[targetIndex].following.length,
    });
  }),

  // 7. 유저 프로필 조회 (팔로우 상태/카운트 포함)
  http.get('/api/users/:id', ({ params, request }) => {
    const targetUserId = String(params.id);
    const users = parseUsers().map(normalizeUser);
    const target = users.find((u) => String(u.id) === targetUserId);
    if (!target) return new HttpResponse(null, { status: 404 });

    const email = getTokenEmail(request);
    const currentUser = users.find((u) => u.email === email);
    const profile: UserProfile = {
      id: target.id,
      nickname: target.nickname,
      avatar: target.avatar,
      shopIntro: target.shopIntro,
      followerCount: target.followers.length,
      followingCount: target.following.length,
      isFollowing: currentUser ? currentUser.following.includes(target.id) : false,
    };

    return HttpResponse.json(profile);
  }),

  // 8. 팔로워 목록 조회
  http.get('/api/users/:id/followers', ({ params }) => {
    const targetUserId = String(params.id);
    const users = parseUsers().map(normalizeUser);
    const target = users.find((user) => String(user.id) === targetUserId);
    if (!target) return new HttpResponse(null, { status: 404 });

    const followers = users
      .filter((user) => target.followers.includes(user.id))
      .map(toFollowUserItem);

    return HttpResponse.json({ users: followers });
  }),

  // 9. 팔로잉 목록 조회
  http.get('/api/users/:id/following', ({ params }) => {
    const targetUserId = String(params.id);
    const users = parseUsers().map(normalizeUser);
    const target = users.find((user) => String(user.id) === targetUserId);
    if (!target) return new HttpResponse(null, { status: 404 });

    const following = users
      .filter((user) => target.following.includes(user.id))
      .map(toFollowUserItem);

    return HttpResponse.json({ users: following });
  }),

  // 10. 회원 탈퇴
  http.delete('/api/auth/withdraw', async ({ request }) => {
    const email = getTokenEmail(request);
    if (!email) return new HttpResponse(null, { status: 401 });

    const users = parseUsers().map(normalizeUser);
    const me = users.find((u) => u.email === email);
    if (!me) return new HttpResponse(null, { status: 404 });

    const filteredUsers = users
      .filter((u) => u.email !== email)
      .map((u) => ({
        ...u,
        followers: u.followers.filter((id) => id !== me.id),
        following: u.following.filter((id) => id !== me.id),
      }));

    localStorage.setItem('users', JSON.stringify(filteredUsers));

    return HttpResponse.json({ success: true });
  }),
];
