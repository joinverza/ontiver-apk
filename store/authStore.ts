import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isBiometricEnabled: boolean;
  user: any | null; // Replace with proper user type later
  setAuthenticated: (value: boolean) => void;
  setBiometricEnabled: (value: boolean) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isBiometricEnabled: false,
  user: null,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setBiometricEnabled: (value) => set({ isBiometricEnabled: value }),
  setUser: (user) => set({ user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
