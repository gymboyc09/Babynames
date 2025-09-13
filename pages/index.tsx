import React, { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Header } from '@/components/Header'
import { Navigation, NavigationTab } from '@/components/Navigation'
import { MobileNavigation } from '@/components/MobileNavigation'
import { NumerologyCalculator } from '@/components/NumerologyCalculator'
import { NameSuggestionEngine } from '@/components/NameSuggestionEngine'
import { FavoritesList } from '@/components/FavoritesList'
import { RecentCalculations } from '@/components/RecentCalculations'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<NavigationTab>('calculator')
  const [loading, setLoading] = useState(false)
  const [calculatorName, setCalculatorName] = useState('')

  const handleNavigateToCalculator = (name: string) => {
    setCalculatorName(name)
    setActiveTab('calculator')
  }

  // Handle tab changes with authentication checks
  const handleTabChange = (tab: NavigationTab) => {
    const authRequiredTabs: NavigationTab[] = ['favorites', 'history', 'astrology', 'settings']
    
    if (authRequiredTabs.includes(tab) && !session) {
      // For non-authenticated users, redirect to calculator tab
      setActiveTab('calculator')
      return
    }
    
    setActiveTab(tab)
  }

  // Ensure active tab is always accessible for the current user
  React.useEffect(() => {
    const authRequiredTabs: NavigationTab[] = ['favorites', 'history', 'astrology', 'settings']
    
    if (authRequiredTabs.includes(activeTab) && !session) {
      // If current tab requires auth but user is not logged in, switch to calculator
      setActiveTab('calculator')
    }
  }, [session, activeTab])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  // Allow anonymous users to access Calculator and Find Names
  // Only require login for Favorites, History, Astrology, Settings

  return (
    <div className="min-h-screen bg-gray-50">
             <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Find the Perfect
            <span className="text-blue-600"> Baby Name</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the perfect name for your baby using numerology, phonology, and cultural insights. 
            Get personalized suggestions with detailed analysis.
          </p>
        </div>

        {/* Navigation */}
        <div className="hidden md:block mb-8">
          <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Main Content */}
        {activeTab === 'calculator' && <NumerologyCalculator initialName={calculatorName} />}
        {activeTab === 'suggestions' && <NameSuggestionEngine />}
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
      
      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
