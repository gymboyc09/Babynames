import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NumerologyCalculator } from '@/components/NumerologyCalculator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function CalculatorPage() {
  const router = useRouter();
  const { name: urlName, s: sessionId } = router.query;
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.isReady && urlName) {
      const nameParam = urlName as string;
      
      // If we have a session ID, validate it
      if (sessionId) {
        const sessionParam = sessionId as string;
        
        fetch('/api/validate-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId: sessionParam }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.valid && data.name) {
            // Verify the name in the URL matches the name in the session
            const expectedUrlName = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            if (expectedUrlName === nameParam) {
              setName(data.name);
              setLoading(false);
            } else {
              // Fallback: use the name from URL if session name doesn't match
              const decodedName = nameParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              setName(decodedName);
              setLoading(false);
            }
          } else {
            // Fallback: use the name from URL if session is invalid
            const decodedName = nameParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            setName(decodedName);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Session validation error:', error);
          // Fallback: use the name from URL if session validation fails
          const decodedName = nameParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          setName(decodedName);
          setLoading(false);
        });
      } else {
        // No session ID, use the name from URL directly
        const decodedName = nameParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        setName(decodedName);
        setLoading(false);
      }
    } else if (router.isReady) {
      setError('Missing name parameter');
      setLoading(false);
    }
  }, [router.isReady, urlName, sessionId]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Baby Name Analysis - Numerology, Astrology & Phonology Calculator</title>
          <meta name="description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
          <meta name="keywords" content="baby names, numerology analysis, astrology names, phonology analysis, name suggestions, baby name calculator, name meanings, name vibrations" />
          <meta property="og:title" content="Baby Name Analysis - Numerology, Astrology & Phonology Calculator" />
          <meta property="og:description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Baby Name Analysis - Numerology, Astrology & Phonology Calculator" />
          <meta name="twitter:description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
        </Head>
        
        <div className="min-h-screen bg-gray-50">
          <Header activeTab="calculator" onTabChange={() => {}} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Baby Name Analysis Calculator
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Loading your personalized name analysis...
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <p className="text-blue-700 text-center">
                  Preparing your advanced numerology, astrology, and phonology analysis...
                </p>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Baby Name Analysis - Numerology, Astrology & Phonology Calculator</title>
          <meta name="description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
          <meta name="keywords" content="baby names, numerology analysis, astrology names, phonology analysis, name suggestions, baby name calculator, name meanings, name vibrations" />
          <meta property="og:title" content="Baby Name Analysis - Numerology, Astrology & Phonology Calculator" />
          <meta property="og:description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Baby Name Analysis - Numerology, Astrology & Phonology Calculator" />
          <meta name="twitter:description" content="Discover the perfect baby name using advanced numerology, astrology, and phonology analysis. Get personalized name suggestions with detailed insights and cultural meanings." />
        </Head>
        
        <div className="min-h-screen bg-gray-50">
          <Header activeTab="calculator" onTabChange={() => {}} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Baby Name Analysis Calculator
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Discover the perfect name for your baby using advanced analysis techniques
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                  Let's Find Your Perfect Baby Name
                </h2>
                <p className="text-yellow-700 mb-4">
                  It looks like there was an issue with the specific name you were looking for. 
                  Don't worry! You can still use our advanced name analysis tools to discover 
                  the perfect name for your little one.
                </p>
                <button 
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Name Analysis
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Numerology Analysis</h3>
                  <p className="text-gray-600 text-sm">
                    Discover the hidden meanings and vibrations of names through ancient numerology principles.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Astrology Integration</h3>
                  <p className="text-gray-600 text-sm">
                    Find names that align with astrological signs and planetary influences.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Phonology Analysis</h3>
                  <p className="text-gray-600 text-sm">
                    Understand the sound patterns and cultural significance of names.
                  </p>
                </div>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Numerology, Astrology, Phonology Name Analysis for {name}</title>
        <meta name="description" content={`Numerology name analysis for ${name} - Discover the hidden meanings, characteristics, and vibrations of the name ${name} through advanced numerology, astrology, and phonology analysis.`} />
        <meta name="keywords" content={`numerology name analysis for ${name}, astrology name analysis for ${name}, phonology name analysis for ${name}, ${name} name meaning, ${name} numerology, ${name} astrology, ${name} phonology`} />
        <meta property="og:title" content={`Numerology, Astrology, Phonology Name Analysis for ${name}`} />
        <meta property="og:description" content={`Discover the hidden meanings and vibrations of the name ${name} through advanced numerology, astrology, and phonology analysis.`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Numerology, Astrology, Phonology Name Analysis for ${name}`} />
        <meta name="twitter:description" content={`Discover the hidden meanings and vibrations of the name ${name} through advanced numerology, astrology, and phonology analysis.`} />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header activeTab="calculator" onTabChange={() => {}} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Advanced Numerology Calculator
            </h1>
            <p className="text-lg text-gray-600">
              Analyzing the name: <span className="font-semibold text-blue-600">{name}</span>
            </p>
          </div>
          
          <NumerologyCalculator initialName={name} />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
