import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NumerologyCalculator } from '@/components/NumerologyCalculator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { validateToken } from '@/lib/security';

export default function CalculatorPage() {
  const router = useRouter();
  const { name: urlName, t: token } = router.query;
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.isReady && urlName && token) {
      const nameParam = urlName as string;
      const tokenParam = token as string;
      
      // Validate secure token
      const validation = validateToken(tokenParam);
      
      if (validation.valid && validation.name) {
        // Verify the name in the URL matches the name in the token
        if (validation.name.toLowerCase() === nameParam.replace(/-/g, ' ')) {
          setName(validation.name);
          setLoading(false);
        } else {
          setError('Invalid name in URL');
          setLoading(false);
        }
      } else {
        setError(validation.error || 'Invalid or expired token');
        setLoading(false);
      }
    } else if (router.isReady) {
      setError('Missing required parameters');
      setLoading(false);
    }
  }, [router.isReady, urlName, token]);

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
  );
}
