import React, { useState, useEffect } from 'react';

export function AnimatedHeadline() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const words = ['Astrology', 'Numerology', 'Phonology'];
  const baseText = 'Find the Perfect Baby Name by using ';
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 2000;

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => {
            setIsDeleting(true);
          }, pauseTime);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {baseText}
        <span className="text-blue-600 inline-block min-h-[1.2em]">
          {currentText}
          <span 
            className={`inline-block w-0.5 h-[1em] bg-blue-600 ml-1 ${
              showCursor ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-100`}
          />
        </span>
      </h1>
      <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
        Discover the perfect name for your baby using advanced analysis techniques. 
        Get personalized suggestions with detailed insights and cultural meanings.
      </p>
    </div>
  );
}
