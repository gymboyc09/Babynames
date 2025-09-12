import React from 'react';
import { InputProps } from '@/types';

export function Input({ 
  value, 
  onChange, 
  placeholder = '', 
  disabled = false, 
  className = '',
  id
}: InputProps) {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed';
  
  return (
    <input
      type="text"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
    />
  );
}
