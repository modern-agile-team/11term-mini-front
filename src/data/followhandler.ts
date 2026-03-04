import { http, HttpResponse } from 'msw';

const USERS_KEY = 'users';

const getEmailFromAuth = (authHeader: string | null) => {
  if (!authHeader) return null;
  const encoded = authHeader.split('-').pop();
  if (!encoded) return null;
  try {
    return atob(encoded);
  } catch {
    return null;
  }
};

const getUsers = (): any[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const setUsers = (users: any[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const ensureFollowFields = (user: any) => {
  if (!Array.isArray(user.following)) user.following = [];
  if (!Array.isArray(user.followers)) user.followers = [];
  return user;
};

const toShopSummary = (u: any) => ({
  id: String(u.id),
  nickname: u.nickname,
  avatar: u.avatar || '',
});

const findUserById = (users: any[], id: string) =>
  users.find((u) => String(u.id) === String(id));

export const followhandler = [
  // ✅ 내 정보(로그인 필요)
  http.get('/api/users/me', ({ request }) => {
    const email = getEmailFromAuth(request.headers.get('Authorization'));
    if (!email) return new HttpResponse(null, { status: 401 });

    const users = getUsers().map(ensureFollowFields);
    const me = users.find((u) => u.email === email);
    if (!me) return new HttpResponse(null, { status: 401 });

    return HttpResponse.json({
      id: String(me.id),
      email: me.email,
      nickname: me.nickname,
      avatar: me.avatar || '',
      shopIntro: me.shopIntro || '',
      followersCount: (me.followers as string[]).length,
      followingCount: (me.following as string[]).length,
    });
  }),

  // ✅ @상점명 검색용: nickname -> user id
  http.get('/api/users/by-nickname', ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname')?.trim();
    if (!nickname) return new HttpResponse(null, { status: 400 });

    const users = getUsers().map(ensureFollowFields);
    const user = users.find((u) => u.nickname === nickname);
    if (!user) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json({
      id: String(user.id),
      nickname: user.nickname,
      avatar: user.avatar || '',
      shopIntro: user.shopIntro || '',
      followersCount: (user.followers as string[]).length,
      followingCount: (user.following as string[]).length,
    });
  }),

  // ✅ 상점 정보(상단 표시: 소개/팔로워수/팔로잉수)
  http.get('/api/users/:id/shop', ({ params }) => {
    const users = getUsers().map(ensureFollowFields);
    const target = findUserById(users, String(params.id));
    if (!target) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json({
      id: String(target.id),
      nickname: target.nickname,
      avatar: target.avatar || '',
      shopIntro: target.shopIntro || '',
      followersCount: (target.followers as string[]).length,
      followingCount: (target.following as string[]).length,
    });
  }),

  // ✅ 팔로워 목록
  http.get('/api/users/:id/followers', ({ params }) => {
    const users = getUsers().map(ensureFollowFields);
    const target = findUserById(users, String(params.id));
    if (!target) return new HttpResponse(null, { status: 404 });

    const items = (target.followers as string[])
      .map((fid) => findUserById(users, String(fid)))
      .filter(Boolean)
      .map(toShopSummary);

    return HttpResponse.json({ items, total: items.length });
  }),

  // ✅ 팔로잉 목록
  http.get('/api/users/:id/following', ({ params }) => {
    const users = getUsers().map(ensureFollowFields);
    const target = findUserById(users, String(params.id));
    if (!target) return new HttpResponse(null, { status: 404 });

    const items = (target.following as string[])
      .map((fid) => findUserById(users, String(fid)))
      .filter(Boolean)
      .map(toShopSummary);

    return HttpResponse.json({ items, total: items.length });
  }),

  // ✅ 팔로우 상태(내가 target을 팔로우중?)
  http.get('/api/users/:id/follow-status', ({ request, params }) => {
    const email = getEmailFromAuth(request.headers.get('Authorization'));
    if (!email) return new HttpResponse(null, { status: 401 });

    const users = getUsers().map(ensureFollowFields);
    const me = users.find((u) => u.email === email);
    if (!me) return new HttpResponse(null, { status: 401 });

    const isFollowing = (me.following as string[]).some(
      (uid) => String(uid) === String(params.id),
    );

    return HttpResponse.json({ isFollowing });
  }),

  // ✅ 팔로우
  http.post('/api/users/:id/follow', ({ request, params }) => {
    const email = getEmailFromAuth(request.headers.get('Authorization'));
    if (!email) return new HttpResponse(null, { status: 401 });

    const users = getUsers().map(ensureFollowFields);
    const meIndex = users.findIndex((u) => u.email === email);
    const targetIndex = users.findIndex((u) => String(u.id) === String(params.id));

    if (meIndex === -1) return new HttpResponse(null, { status: 401 });
    if (targetIndex === -1) return new HttpResponse(null, { status: 404 });

    const me = users[meIndex];
    const target = users[targetIndex];

    if (String(me.id) === String(target.id)) {
      return new HttpResponse(null, { status: 400, statusText: 'Cannot follow yourself' });
    }

    if (!(me.following as string[]).includes(String(target.id))) {
      me.following.push(String(target.id));
    }
    if (!(target.followers as string[]).includes(String(me.id))) {
      target.followers.push(String(me.id));
    }

    users[meIndex] = me;
    users[targetIndex] = target;
    setUsers(users);

    return HttpResponse.json({
      isFollowing: true,
      followersCount: (target.followers as string[]).length,
      followingCount: (me.following as string[]).length,
    });
  }),

  // ✅ 언팔
  http.delete('/api/users/:id/follow', ({ request, params }) => {
    const email = getEmailFromAuth(request.headers.get('Authorization'));
    if (!email) return new HttpResponse(null, { status: 401 });

    const users = getUsers().map(ensureFollowFields);
    const meIndex = users.findIndex((u) => u.email === email);
    const targetIndex = users.findIndex((u) => String(u.id) === String(params.id));

    if (meIndex === -1) return new HttpResponse(null, { status: 401 });
    if (targetIndex === -1) return new HttpResponse(null, { status: 404 });

    const me = users[meIndex];
    const target = users[targetIndex];

    me.following = (me.following as string[]).filter(
      (uid) => String(uid) !== String(target.id),
    );
    target.followers = (target.followers as string[]).filter(
      (uid) => String(uid) !== String(me.id),
    );

    users[meIndex] = me;
    users[targetIndex] = target;
    setUsers(users);

    return HttpResponse.json({
      isFollowing: false,
      followersCount: (target.followers as string[]).length,
      followingCount: (me.following as string[]).length,
    });
  }),

  // ✅ 팔로워 관리(삭제): 내 상점에서 특정 팔로워를 강제로 제거
  // DELETE /api/users/:followerId/remove-follower
  http.delete('/api/users/:id/remove-follower', ({ request, params }) => {
    const followerId = String(params.id);
    const email = getEmailFromAuth(request.headers.get('Authorization'));
    if (!email) return new HttpResponse(null, { status: 401 });

    const users = getUsers().map(ensureFollowFields);
    const meIndex = users.findIndex((u) => u.email === email);
    const followerIndex = users.findIndex((u) => String(u.id) === String(followerId));

    if (meIndex === -1) return new HttpResponse(null, { status: 401 });
    if (followerIndex === -1) return new HttpResponse(null, { status: 404 });

    const me = users[meIndex];
    const follower = users[followerIndex];

    // follower가 me를 팔로우한 관계 끊기:
    // - me.followers에서 follower 제거
    // - follower.following에서 me 제거
    me.followers = (me.followers as string[]).filter((id) => String(id) !== String(follower.id));
    follower.following = (follower.following as string[]).filter(
      (id) => String(id) !== String(me.id),
    );

    users[meIndex] = me;
    users[followerIndex] = follower;
    setUsers(users);

    return HttpResponse.json({
      success: true,
      followersCount: (me.followers as string[]).length,
    });
  }),
];