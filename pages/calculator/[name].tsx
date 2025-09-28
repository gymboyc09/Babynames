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
    if (router.isReady && urlName && sessionId) {
      const nameParam = urlName as string;
      const sessionParam = sessionId as string;
      
      // Validate session
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
            setError('Invalid name in URL');
            setLoading(false);
          }
        } else {
          setError(data.error || 'Invalid or expired session');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Session validation error:', error);
        setError('Session validation failed');
        setLoading(false);
      });
    } else if (router.isReady) {
      setError('Missing required parameters');
      setLoading(false);
    }
  }, [router.isReady, urlName, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading calculator...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Home
          </button>
        </div>
      </div>
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
