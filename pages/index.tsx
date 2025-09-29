import React, { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { MobileSidebar } from '@/components/MobileSidebar'
import { Footer } from '@/components/Footer'
import { NumerologyCalculator } from '@/components/NumerologyCalculator'
import { NameSuggestionEngine } from '@/components/NameSuggestionEngine'
import { FavoritesList } from '@/components/FavoritesList'
import { TrendingNames } from '@/components/TrendingNames'
import { RecentCalculations } from '@/components/RecentCalculations'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { NavigationTab } from '@/types'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<NavigationTab>('suggestions')
  const [loading, setLoading] = useState(false)
  const [calculatorName, setCalculatorName] = useState('')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleNavigateToCalculator = (name: string) => {
    setCalculatorName(name)
    setActiveTab('calculator')
  }

  // Handle URL parameters for direct navigation to calculator (legacy support)
  useEffect(() => {
    if (router.isReady) {
      const { name, tab } = router.query
      
      if (name && typeof name === 'string') {
        setCalculatorName(decodeURIComponent(name))
      }
      
      if (tab && typeof tab === 'string' && tab === 'calculator') {
        setActiveTab('calculator')
      }
    }
  }, [router.isReady, router.query])

  // Handle tab changes with authentication checks
  const handleTabChange = (tab: NavigationTab) => {
    const authRequiredTabs: NavigationTab[] = ['favorites', 'history', 'astrology', 'settings']
    
    if (authRequiredTabs.includes(tab) && !session) {
      // For non-authenticated users, redirect to suggestions tab
      setActiveTab('suggestions')
      return
    }
    
    setActiveTab(tab)
  }

  // Ensure active tab is always accessible for the current user
  React.useEffect(() => {
    const authRequiredTabs: NavigationTab[] = ['favorites', 'history', 'astrology', 'settings']
    
    if (authRequiredTabs.includes(activeTab) && !session) {
      // If current tab requires auth but user is not logged in, switch to suggestions
      setActiveTab('suggestions')
    }
  }, [session, activeTab])

  if (status === "loading") {
    return (
      <>
        <Head>
          <title>Baby Names - Numerology, Astrology & Phonology Analysis</title>
          <meta name="description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
          <meta name="keywords" content="baby names, numerology analysis, astrology names, phonology analysis, name suggestions, baby name calculator, name meanings, name vibrations" />
          <meta property="og:title" content="Baby Names - Numerology, Astrology & Phonology Analysis" />
          <meta property="og:description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Baby Names - Numerology, Astrology & Phonology Analysis" />
          <meta name="twitter:description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
        </Head>
        
        <div className="min-h-screen bg-gray-50">
          <Header activeTab="suggestions" onTabChange={() => {}} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Baby Name Analysis
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Loading your personalized name analysis tools...
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <p className="text-blue-700 text-center">
                  Preparing your advanced numerology, astrology, and phonology analysis tools...
                </p>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    )
  }

  // Allow anonymous users to access Calculator and Find Names
  // Only require login for Favorites, History, Astrology, Settings

  return (
    <>
      <Head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MEE4YRMFZL"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MEE4YRMFZL');
            `,
          }}
        />
        
        <title>Baby Names - Numerology, Astrology & Phonology Analysis</title>
        <meta name="description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
        <meta name="keywords" content="baby names, numerology analysis, astrology names, phonology analysis, name suggestions, baby name calculator, name meanings, name vibrations" />
        <meta property="og:title" content="Baby Names - Numerology, Astrology & Phonology Analysis" />
        <meta property="og:description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Baby Names - Numerology, Astrology & Phonology Analysis" />
        <meta name="twitter:description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header activeTab={activeTab} onTabChange={handleTabChange} />
        <MobileSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          isOpen={mobileSidebarOpen}
          onToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Description text */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the perfect name for your baby using advanced analysis techniques. 
              Get personalized suggestions with detailed insights and cultural meanings.
            </p>
          </div>

        {/* Main Content */}
          {activeTab === 'calculator' && <NumerologyCalculator initialName={calculatorName} />}
          {activeTab === 'suggestions' && <NameSuggestionEngine />}
        {activeTab === 'trending' && <TrendingNames />}
          {activeTab === 'favorites' && <FavoritesList onNavigateToCalculator={handleNavigateToCalculator} />}
          {activeTab === 'history' && <RecentCalculations onNavigateToCalculator={handleNavigateToCalculator} />}
          {activeTab === 'astrology' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Astrology Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Astrology features are coming soon! This will include birth chart analysis, 
                  astrological compatibility with names, and personalized recommendations 
                  based on planetary positions.
                </p>
              </CardContent>
            </Card>
          )}
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Settings and preferences will be available here soon.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  )
}
