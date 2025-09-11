// Core types for the Baby Name Suggestion App

export interface NumerologyResult {
  chaldean: {
    value: number;
    breakdown: LetterValue[];
    isMasterNumber: boolean;
    isSacredNumber: boolean;
  };
  pythagorean: {
    value: number;
    breakdown: LetterValue[];
    isMasterNumber: boolean;
  };
}

export interface LetterValue {
  letter: string;
  chaldeanValue: number;
  pythagoreanValue: number;
}

export interface NameAnalysis {
  name: string;
  numerology: NumerologyResult;
  phonology: PhonologyAnalysis;
  cultural: CulturalInfo;
  astrology?: AstrologyInfo;
}

export interface PhonologyAnalysis {
  syllables: number;
  pronunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  stressPattern: string;
  phoneticTranscription: string;
  nicknamePotential: string[];
  vibration: {
    type: 'positive' | 'negative' | 'neutral';
    positiveCombinations: string[];
    negativeCombinations: string[];
    score: number;
    numerologyWarning: boolean;
  };
}

export interface CulturalInfo {
  origin: string;
  meaning: string;
  popularity: number;
  famousNamesakes: string[];
  culturalSignificance: string;
  religiousSignificance?: string;
}

export interface AstrologyInfo {
  sunSign: string;
  moonSign?: string;
  risingSign?: string;
  luckyNumbers: number[];
  luckyLetters: string[];
  compatibility: number; // 0-100
}

export interface NameSuggestion {
  name: string;
  numerology: NumerologyResult;
  cultural: CulturalInfo;
  score: number;
  reasons: string[];
}

export interface SearchFilters {
  numerologyTarget?: number;
  gender?: 'male' | 'female' | 'unisex' | 'any';
  origin?: string;
  minLength?: number;
  maxLength?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'any';
  modernOnly?: boolean;
  traditionalOnly?: boolean;
}

export interface UserPreferences {
  savedNames: string[];
  favoriteOrigins: string[];
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  darkMode: boolean;
  language: string;
}

export interface BirthData {
  date: string;
  time?: string;
  location: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  timezone: string;
}

// UI Component Types
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  error?: string;
  className?: string;
}
