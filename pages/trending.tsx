import React, { useState } from 'react'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { MobileSidebar } from '@/components/MobileSidebar'
import { Footer } from '@/components/Footer'
import { TrendingNames } from '@/components/TrendingNames'
import { NavigationTab } from '@/types'

export default function TrendingPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleTabChange = (tab: NavigationTab) => {
    if (tab === 'trending') {
      // Already on trending page, do nothing
      return
    } else if (tab === 'blog') {
      window.location.href = '/blog'
    } else {
      window.location.href = '/'
    }
  }

  const oneDayAgo = React.useMemo(() => {
    const d = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return d.toLocaleString()
  }, [])

  return (
    <>
      <Head>
        <title>Trending Baby Names - Numerology, Astrology & Phonology</title>
        <meta name="description" content="Explore trending baby names and analyze them with numerology, astrology, and phonology insights. Updated by our admin to reflect popular choices." />
        <meta name="keywords" content="trending baby names, popular names, numerology analysis, astrology names, phonology analysis" />
        <meta property="og:title" content="Trending Baby Names - Numerology, Astrology & Phonology" />
        <meta property="og:description" content="Explore trending baby names and analyze them with numerology, astrology, and phonology insights." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Header activeTab="trending" onTabChange={handleTabChange} />
        <MobileSidebar 
          activeTab="trending" 
          onTabChange={handleTabChange}
          isOpen={mobileSidebarOpen}
          onToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trending Baby Names</h1>
            <p className="text-lg text-gray-600">Top Trending Baby Names: Instant Analysis of Gender, Numerology, and Astrology. Find Your Child's Perfect Name!</p>
          </div>
          <TrendingNames />
          <div className="text-center text-sm text-gray-500 mt-6">
            Last updated: {oneDayAgo}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}


