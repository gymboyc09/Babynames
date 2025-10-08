import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function PromotionalBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    // Navigate to the blog post using Next.js router
    router.push('/blog/how-to-choose-perfect-baby-name');
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            How to Choose the Perfect Baby Name for Your Girl or Boy
          </h3>
          <p className="text-sm text-gray-600">
            Discover the art of choosing the perfect baby name using astrology, numerology, and phonology.
          </p>
        </div>
        <div className="flex flex-col ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
          >
            <ChevronUp className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
          >
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-sm text-gray-700 mb-3">
            Learn how to combine astrology, numerology, and phonology to find the perfect name that brings positive energy and good fortune to your child.
          </p>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            <span>Read the full guide</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
