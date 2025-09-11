import { create } from 'zustand';
import { UserData } from './database';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  } | null;
  userData: UserData | null;
  isLoading: boolean;
  setAuth: (isAuthenticated: boolean, user: AuthState['user']) => void;
  setUserData: (userData: UserData | null) => void;
  setIsLoading: (loading: boolean) => void;
  
  // API methods
  fetchUserData: () => Promise<void>;
  updateUserData: (updates: Partial<UserData>) => Promise<void>;
  addFavorite: (name: string) => Promise<void>;
  removeFavorite: (name: string) => Promise<void>;
  addRecentCalculation: (analysis: {
    name: string;
    numerology: unknown;
    phonology: unknown;
    cultural: unknown;
  }) => Promise<void>;
  clearRecentCalculations: () => Promise<void>;
  migrateLocalData: (localData: {
    favoriteNames: string[];
    recentCalculations: unknown[];
    searchHistory: string[];
    preferences: unknown;
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  userData: null,
  isLoading: false,

  setAuth: (isAuthenticated, user) => set({ isAuthenticated, user }),
  setUserData: (userData) => set({ userData }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  fetchUserData: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/user/data');
      if (response.ok) {
        const userData = await response.json();
        set({ userData });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserData: async (updates) => {
    try {
      const response = await fetch('/api/user/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        const userData = await response.json();
        set({ userData });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  },

  addFavorite: async (name) => {
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      
      if (response.ok) {
        const { favorites } = await response.json();
        const currentUserData = get().userData;
        if (currentUserData) {
          set({ userData: { ...currentUserData, favoriteNames: favorites } });
        }
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  removeFavorite: async (name) => {
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      
      if (response.ok) {
        const { favorites } = await response.json();
        const currentUserData = get().userData;
        if (currentUserData) {
          set({ userData: { ...currentUserData, favoriteNames: favorites } });
        }
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  addRecentCalculation: async (analysis) => {
    try {
      const response = await fetch('/api/user/recent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysis),
      });
      
      if (response.ok) {
        const { recentCalculations } = await response.json();
        const currentUserData = get().userData;
        if (currentUserData) {
          set({ userData: { ...currentUserData, recentCalculations } });
        }
      }
    } catch (error) {
      console.error('Error adding recent calculation:', error);
    }
  },

  clearRecentCalculations: async () => {
    try {
      const response = await fetch('/api/user/recent', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const currentUserData = get().userData;
        if (currentUserData) {
          set({ userData: { ...currentUserData, recentCalculations: [] } });
        }
      }
    } catch (error) {
      console.error('Error clearing recent calculations:', error);
    }
  },

  migrateLocalData: async (localData) => {
    try {
      const response = await fetch('/api/user/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localData),
      });
      
      if (response.ok) {
        const { data } = await response.json();
        set({ userData: data });
      }
    } catch (error) {
      console.error('Error migrating data:', error);
    }
  },
}));
