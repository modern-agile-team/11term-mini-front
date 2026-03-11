import { io, type Socket } from 'socket.io-client';

declare global {
  interface Window {
    __talkSocket?: Socket;
    __talkSocketInfo?: {
      url: string;
      path: string;
      connected: boolean;
      id?: string;
      lastError?: string;
    };
  }
}

const parseUserId = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const getOrCreateAnonymousUserId = (): number => {
  const key = 'anonChatUserId';
  const existing = localStorage.getItem(key);
  const parsed = parseUserId(existing);
  if (parsed !== null) return parsed;

  const generated = Date.now();
  localStorage.setItem(key, String(generated));
  return generated;
};

const resolveSocketUserId = (): number => {
  const raw = localStorage.getItem('currentUser');
  if (!raw) return getOrCreateAnonymousUserId();

  try {
    const parsed = JSON.parse(raw) as { id?: unknown; userId?: unknown };
    return parseUserId(parsed.id) ?? parseUserId(parsed.userId) ?? getOrCreateAnonymousUserId();
  } catch {
    return getOrCreateAnonymousUserId();
  }
};

let talkSocket: Socket | null = null;

const resolveSocketUrl = (): string | null => {
  const explicit = import.meta.env.VITE_TALK_SOCKET_URL as string | undefined;
  if (explicit && explicit.trim() !== '') return explicit.trim();

  const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (apiBase && /^https?:\/\//.test(apiBase)) {
    try {
      return new URL(apiBase).origin;
    } catch {
      // ignore malformed URL
    }
  }

  return null;
};

const resolveSocketPath = (): string => {
  const path = import.meta.env.VITE_TALK_SOCKET_PATH as string | undefined;
  if (!path || path.trim() === '') return '/socket.io';
  const normalized = path.trim();
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
};

export const initTalkSocket = (): Socket | null => {
  const socketUrl = resolveSocketUrl();
  const socketPath = resolveSocketPath();

  if (talkSocket) return talkSocket;
  if (!socketUrl) {
    console.warn('[talk-socket] skipped: set VITE_TALK_SOCKET_URL (and optional VITE_TALK_SOCKET_PATH)');
    return null;
  }

  const token = localStorage.getItem('accessToken') ?? '';
  const userId = resolveSocketUserId();

  talkSocket = io(socketUrl, {
    path: socketPath,
    transports: ['websocket'],
    auth: {
      token,
      userId,
    },
    extraHeaders: {
      Authorization: token ? `Bearer ${token}` : '',
      'x-user-id': String(userId),
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  window.__talkSocket = talkSocket;
  window.__talkSocketInfo = {
    url: socketUrl,
    path: socketPath,
    connected: talkSocket.connected,
  };

  talkSocket.on('connect', () => {
    window.__talkSocketInfo = {
      url: socketUrl,
      path: socketPath,
      connected: true,
      id: talkSocket?.id,
    };
    console.info('[talk-socket] connected', { url: socketUrl, path: socketPath, id: talkSocket?.id });
  });

  talkSocket.on('connect_error', (error) => {
    window.__talkSocketInfo = {
      url: socketUrl,
      path: socketPath,
      connected: false,
      lastError: error.message,
    };
    console.error('[talk-socket] connect_error', {
      url: socketUrl,
      path: socketPath,
      message: error.message,
    });
  });

  talkSocket.on('disconnect', (reason) => {
    window.__talkSocketInfo = {
      url: socketUrl,
      path: socketPath,
      connected: false,
      id: talkSocket?.id,
      lastError: reason,
    };
    console.warn('[talk-socket] disconnected', { url: socketUrl, path: socketPath, reason });
  });

  console.info('[talk-socket] init', {
    url: socketUrl,
    path: socketPath,
    hasToken: Boolean(token),
    userId,
  });

  return talkSocket;
};

export const closeTalkSocket = (): void => {
  if (!talkSocket) return;
  talkSocket.disconnect();
  talkSocket = null;
  if (window.__talkSocket) {
    delete window.__talkSocket;
  }
  if (window.__talkSocketInfo) {
    delete window.__talkSocketInfo;
  }
};
