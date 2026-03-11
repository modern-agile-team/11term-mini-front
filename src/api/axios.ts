import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.DEV ? '/api' : 'https://api.samgakmarket.shop'),
});

const shouldAttachUserHeader = (baseURL: string | undefined): boolean => {
  if (!baseURL || baseURL.startsWith('/')) return true;

  try {
    if (typeof window === 'undefined') return false;
    const targetOrigin = new URL(baseURL, window.location.origin).origin;
    return targetOrigin === window.location.origin;
  } catch {
    return false;
  }
};

const parseUserId = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const ANON_CHAT_USER_KEY = 'anonChatUserId';

const getOrCreateAnonymousUserId = (): number => {
  const existing = localStorage.getItem(ANON_CHAT_USER_KEY);
  const parsedExisting = parseUserId(existing);
  if (parsedExisting !== null) return parsedExisting;

  const generated = Date.now();
  localStorage.setItem(ANON_CHAT_USER_KEY, String(generated));
  return generated;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const currentUserRaw = localStorage.getItem('currentUser');
    const attachUserHeader = shouldAttachUserHeader(config.baseURL);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!attachUserHeader) {
      if (config.headers && 'x-user-id' in config.headers) {
        delete (config.headers as Record<string, unknown>)['x-user-id'];
      }
      return config;
    }

    if (currentUserRaw) {
      try {
        const currentUser = JSON.parse(currentUserRaw) as { id?: unknown; userId?: unknown };
        const userId = parseUserId(currentUser.id) ?? parseUserId(currentUser.userId);
        if (userId !== null) {
          config.headers['x-user-id'] = String(userId);
          return config;
        }
      } catch {
        // ignore invalid currentUser storage format
      }
    }

    config.headers['x-user-id'] = String(getOrCreateAnonymousUserId());
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    if (response.data === undefined || response.data === null) {
      response.data = [];
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
