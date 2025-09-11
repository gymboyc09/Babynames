import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserPreferences, NameAnalysis, SearchFilters, BirthData } from '@/types';

interface AppState {
  // User preferences
  preferences: UserPreferences;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Current analysis
  currentAnalysis: NameAnalysis | null;
  setCurrentAnalysis: (analysis: NameAnalysis | null) => void;
  
  // Search filters
  searchFilters: SearchFilters;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  
  // Birth data for astrology
  birthData: BirthData | null;
  setBirthData: (data: BirthData | null) => void;
  
  // UI state
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Favorites
  favoriteNames: string[];
  addToFavorites: (name: string) => void;
  removeFromFavorites: (name: string) => void;
  isFavorite: (name: string) => boolean;
  
  // Search history
  searchHistory: string[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  
  // Recent calculations
  recentCalculations: NameAnalysis[];
  addToRecentCalculations: (analysis: NameAnalysis) => void;
  clearRecentCalculations: () => void;
  
  // Data management
  exportData: () => string;
  importData: (data: string) => boolean;
  clearAllData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      preferences: {
        savedNames: [],
        favoriteOrigins: [],
        preferredDifficulty: 'medium',
        darkMode: false,
        language: 'en'
      },
      
      currentAnalysis: null,
      searchFilters: {},
      birthData: null,
      isDarkMode: false,
      isLoading: false,
      favoriteNames: [],
      searchHistory: [],
      recentCalculations: [],
      
      // Actions
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        })),
      
      setCurrentAnalysis: (analysis) =>
        set({ currentAnalysis: analysis }),
      
      setSearchFilters: (filters) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters }
        })),
      
      setBirthData: (data) =>
        set({ birthData: data }),
      
      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
          preferences: {
            ...state.preferences,
            darkMode: !state.isDarkMode
          }
        })),
      
      setIsLoading: (loading) =>
        set({ isLoading: loading }),
      
      addToFavorites: (name) =>
        set((state) => ({
          favoriteNames: [...state.favoriteNames, name]
        })),
      
      removeFromFavorites: (name) =>
        set((state) => ({
          favoriteNames: state.favoriteNames.filter(n => n !== name)
        })),
      
      isFavorite: (name) => {
        const state = get();
        return state.favoriteNames.includes(name);
      },
      
      addToHistory: (query) =>
        set((state) => {
          const newHistory = [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 10);
          return { searchHistory: newHistory };
        }),
      
      clearHistory: () =>
        set({ searchHistory: [] }),
      
      addToRecentCalculations: (analysis) =>
        set((state) => {
          const newCalculations = [analysis, ...state.recentCalculations.filter(a => a.name !== analysis.name)].slice(0, 20);
          return { recentCalculations: newCalculations };
        }),
      
      clearRecentCalculations: () =>
        set({ recentCalculations: [] }),
      
      // Data management functions
      exportData: () => {
        const state = get();
        const exportData = {
          preferences: state.preferences,
          favoriteNames: state.favoriteNames,
          searchHistory: state.searchHistory,
          recentCalculations: state.recentCalculations,
          isDarkMode: state.isDarkMode,
          exportDate: new Date().toISOString(),
          version: '1.0'
        };
        return JSON.stringify(exportData, null, 2);
      },
      
      importData: (data: string) => {
        try {
          const importedData = JSON.parse(data);
          
          // Validate the imported data structure
          if (!importedData || typeof importedData !== 'object') {
            return false;
          }
          
          // Update state with imported data
          set({
            preferences: importedData.preferences || get().preferences,
            favoriteNames: Array.isArray(importedData.favoriteNames) ? importedData.favoriteNames : [],
            searchHistory: Array.isArray(importedData.searchHistory) ? importedData.searchHistory : [],
            recentCalculations: Array.isArray(importedData.recentCalculations) ? importedData.recentCalculations : [],
            isDarkMode: Boolean(importedData.isDarkMode)
          });
          
          return true;
        } catch (error) {
          console.error('Failed to import data:', error);
          return false;
        }
      },
      
      clearAllData: () => {
        set({
          preferences: {
            savedNames: [],
            favoriteOrigins: [],
            preferredDifficulty: 'medium',
            darkMode: false,
            language: 'en'
          },
          favoriteNames: [],
          searchHistory: [],
          recentCalculations: [],
          isDarkMode: false,
          currentAnalysis: null,
          searchFilters: {},
          birthData: null,
          isLoading: false
        });
      }
    }),
    {
      name: 'baby-names-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        };
      }),
      partialize: (state) => ({
        preferences: state.preferences,
        favoriteNames: state.favoriteNames,
        searchHistory: state.searchHistory,
        recentCalculations: state.recentCalculations,
        isDarkMode: state.isDarkMode
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Data restored from localStorage');
        }
      }
    }
  )
);

// Selectors for common use cases
export const usePreferences = () => useAppStore((state) => state.preferences);
export const useCurrentAnalysis = () => useAppStore((state) => state.currentAnalysis);
export const useSearchFilters = () => useAppStore((state) => state.searchFilters);
export const useBirthData = () => useAppStore((state) => state.birthData);
export const useIsDarkMode = () => useAppStore((state) => state.isDarkMode);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useFavoriteNames = () => useAppStore((state) => state.favoriteNames);
export const useSearchHistory = () => useAppStore((state) => state.searchHistory);
export const useRecentCalculations = () => useAppStore((state) => state.recentCalculations);
