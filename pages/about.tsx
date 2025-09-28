import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NavigationTab } from '@/types';

export default function AboutUs() {
  const handleTabChange = (tab: NavigationTab) => {
    // Redirect to home page for navigation
    window.location.href = '/';
  };

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
        
        <title>About Us - Baby Names Analysis</title>
        <meta name="description" content="Learn about our advanced baby name analysis platform that combines numerology, astrology, and phonology to help parents find the perfect name for their child." />
        <meta name="keywords" content="about baby names, numerology analysis, astrology names, phonology analysis, baby name calculator" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header activeTab="suggestions" onTabChange={handleTabChange} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600">
            Helping parents find the perfect name for their little ones
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                At Baby Names, we believe that choosing a name for your child is one of the most important decisions 
                you'll make as a parent. Our mission is to provide you with comprehensive tools and insights to help 
                you find the perfect name that resonates with your family's values, cultural background, and personal preferences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">🔢</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Numerology Analysis</h3>
                  <p className="text-gray-600 text-sm">
                    Discover the hidden meanings and vibrations behind names using ancient numerological principles.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">🎵</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phonology Insights</h3>
                  <p className="text-gray-600 text-sm">
                    Understand the sound patterns, pronunciation, and linguistic beauty of potential names.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">⭐</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Astrology Integration</h3>
                  <p className="text-gray-600 text-sm">
                    Explore how names align with astrological signs and cosmic energies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Baby Names was born from the personal experience of our founders, who struggled to find the perfect 
                name for their own children. We realized that while there were many name databases available, there 
                was a lack of comprehensive analysis tools that could help parents understand the deeper meanings 
                and implications of their name choices.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Today, we combine traditional wisdom with modern technology to provide you with detailed insights 
                that go beyond simple name lists. Our platform helps you make an informed decision that you'll 
                be proud of for years to come.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Choose Us?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Comprehensive analysis using multiple methodologies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Personalized recommendations based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Cultural and linguistic insights for diverse backgrounds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Easy-to-use interface designed for busy parents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Save and organize your favorite names</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      </div>
    </>
  );
}
