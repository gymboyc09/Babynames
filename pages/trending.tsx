import React from 'react'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { TrendingNames } from '@/components/TrendingNames'

export default function TrendingPage() {
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
        <Header activeTab="trending" onTabChange={() => {}} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trending Baby Names</h1>
            <p className="text-lg text-gray-600">Admin-curated list of names currently trending. Click Analyze to view detailed insights.</p>
          </div>
          <TrendingNames />
        </main>
        <Footer />
      </div>
    </>
  )
}


