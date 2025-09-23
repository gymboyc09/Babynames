import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NumerologyCalculator } from '@/components/NumerologyCalculator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function CalculatorPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const { token, name: nameParam } = router.query;
      
      if (token && typeof token === 'string') {
        // Validate secure token
        fetch('/api/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.valid && data.name) {
            setName(data.name);
            setLoading(false);
          } else {
            setError('Invalid or expired token');
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Token validation error:', error);
          setError('Token validation failed');
          setLoading(false);
        });
      } else if (nameParam && typeof nameParam === 'string') {
        // Fallback for direct name parameter (less secure)
        setName(decodeURIComponent(nameParam));
        setLoading(false);
      } else {
        setError('No valid name or token provided');
        setLoading(false);
      }
    }
  }, [router.isReady, router.query]);

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
