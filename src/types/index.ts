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
    totalValue: number;
    reducedValue: number;
    meaning: string;
    characteristics: string[];
    compatibility: string[];
    warnings: string[];
  };
  phonology: {
    syllables: number;
    vowelCount: number;
    consonantCount: number;
    phoneticAnalysis: string;
    pronunciation: string;
    culturalNotes: string[];
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
