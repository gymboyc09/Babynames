export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface NameAnalysis {
  id: string;
  name: string;
  numerology: {
    pythagorean: {
      totalValue: number;
      reducedValue: number;
      meaning: string;
      characteristics: string[];
      compatibility: string[];
      warnings: string[];
      letterBreakdown: { letter: string; value: number }[];
    };
    chaldean: {
      totalValue: number;
      reducedValue: number;
      meaning: string;
      characteristics: string[];
      compatibility: string[];
      warnings: string[];
      letterBreakdown: { letter: string; value: number }[];
    };
    coreNumbers: {
      lifePath: number;         // Sum of birth date (DOB based)
      destiny: number;          // Sum of all letters (full name)
      soul: number;            // Sum of vowels only (Heart Desire)
      personality: number;     // Sum of consonants only
      radical: number;         // Sum of first name only
    };
  };
  phonology: {
    syllables: number;
    vowelCount: number;
    consonantCount: number;
    phoneticAnalysis: string;
    pronunciation: string;
    culturalNotes: string[];
    vibrations: {
      energy: number;
      frequency: string;
      resonance: string;
      harmony: string;
      score: number;
      rating: string;
    };
    soundPatterns: {
      alliteration: string[];
      assonance: string[];
      rhythm: string;
      flow: string;
    };
    vibratoryScience: {
      positiveCombinations: string[];
      negativeCombinations: string[];
      overallVibration: 'Positive' | 'Negative' | 'Neutral';
      avoidableNumbers: number[];
    };
  };
  timestamp: Date;
  isFavorite?: boolean;
}

export interface UserData {
  id: string;
  email: string;
  favoriteNames: NameAnalysis[];
  recentCalculations: NameAnalysis[];
  createdAt: Date;
  updatedAt: Date;
}

export type NavigationTab = 'calculator' | 'suggestions' | 'favorites' | 'history' | 'astrology' | 'settings';
