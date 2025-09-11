# Baby Name Suggestion App

A comprehensive, mobile-first web application that helps expecting parents find the perfect baby name using numerology, phonology, and astrology principles.

## Features

### ✅ Implemented
- **Numerology Calculator**: Calculate Chaldean and Pythagorean numerology values for any name
- **Name Suggestion Engine**: Find names based on numerology, gender, origin, and other criteria
- **Favorites System**: Save and manage your favorite names
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **PWA Support**: Installable as a Progressive Web App
- **Real-time Analysis**: Instant numerology and phonology analysis

### 🚧 Coming Soon
- **Astrology Integration**: Birth chart analysis and astrological compatibility
- **Cultural Explorer**: Detailed etymology and cultural significance
- **Advanced Phonology**: Pronunciation guides and sound analysis
- **User Accounts**: Save preferences and sync across devices
- **Social Features**: Share and discuss names with others

## Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4+
- **State Management**: Zustand
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **PWA**: Service Worker and Web App Manifest

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd babynames
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Navigation.tsx  # Main navigation
│   ├── NumerologyCalculator.tsx
│   ├── NameSuggestionEngine.tsx
│   └── FavoritesList.tsx
├── lib/                # Utility functions and logic
│   ├── numerology.ts   # Numerology calculations
│   ├── phonology.ts    # Phonology analysis
│   ├── utils.ts        # General utilities
│   └── store.ts        # Zustand state management
├── types/              # TypeScript type definitions
└── data/               # Sample data and constants
```

## Numerology Systems

### Chaldean Numerology
- A=1, B=2, C=3, D=4, E=5, F=8, G=3, H=5, I=1, J=1, K=2, L=3, M=4, N=5, O=7, P=8, Q=1, R=2, S=3, T=4, U=6, V=6, W=6, X=5, Y=1, Z=7
- 9 is considered a sacred number (not reduced)
- Master numbers: 11, 22, 33

### Pythagorean Numerology
- A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9, S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8
- Standard reduction to single digit
- Master numbers preserved: 11, 22, 33

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Numerology calculations based on traditional Chaldean and Pythagorean systems
- Sample name data from various cultural sources
- UI design inspired by Material Design 3.0 principles
