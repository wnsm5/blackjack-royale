import { create } from 'zustand';
import api from '../services/api';
import { User, Profile } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  login: (emailOrUsername: string, password: String) => Promise<void>;
  register: (username: string, email: string, password: String) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  setCredits: (credits: number) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  profile: null,
  isLoading: false,
  error: null,

  login: async (emailOrUsername, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { emailOrUsername, password });
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, profile: user.profile, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Erreur de connexion', isLoading: false });
      throw err;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { username, email, password });
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, profile: user.profile, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Erreur d\'inscription', isLoading: false });
      throw err;
    }
  },

  loginAsGuest: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/guest');
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, profile: user.profile, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Erreur création compte invité', isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, profile: null });
  },

  fetchProfile: async () => {
    try {
      const res = await api.get('/profile');
      set({ profile: res.data.profile, user: res.data.user });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  },

  setCredits: (credits: number) => {
    const current = get().profile;
    if (current) {
      set({ profile: { ...current, credits } });
    }
  },
}));
