import { GoogleUser, OAuthTokens } from '@/types/auth';
import { CACHE_KEYS } from "@/app/cacheKeys";

export interface GoogleAuthCache {
  user: GoogleUser;
  tokens: OAuthTokens | null;
  timestamp: number;
}

export function cacheGoogleAuth(user: GoogleUser, tokens: OAuthTokens | null = null) {
  const cache: GoogleAuthCache = {
    user,
    tokens,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEYS.googleAuth, JSON.stringify(cache));
}

export function getCachedGoogleAuth(): GoogleAuthCache | null {
  const raw = localStorage.getItem(CACHE_KEYS.googleAuth);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GoogleAuthCache;
  } catch {
    return null;
  }
}

export function clearCachedGoogleAuth() {
  localStorage.removeItem(CACHE_KEYS.googleAuth);
}
