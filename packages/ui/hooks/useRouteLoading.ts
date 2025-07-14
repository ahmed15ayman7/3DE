'use client';
import { useState, useEffect } from 'react';

export const useRouteLoading = () => {
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsRouteChanging(true);
    };

    const handleComplete = () => {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setIsRouteChanging(false);
      }, 100);
    };

    // Listen for route changes
    const handleRouteChangeStart = () => {
      handleStart();
    };

    const handleRouteChangeComplete = () => {
      handleComplete();
    };

    const handleRouteChangeError = () => {
      handleComplete();
    };

    // Store original history methods
    let originalPushState: typeof history.pushState;
    let originalReplaceState: typeof history.replaceState;

    // Add event listeners for route changes
    if (typeof window !== 'undefined') {
      // Listen for popstate events (browser back/forward)
      window.addEventListener('popstate', handleRouteChangeStart);
      
      // Listen for beforeunload events
      window.addEventListener('beforeunload', handleRouteChangeStart);
      
      // Listen for pushstate events (programmatic navigation)
      originalPushState = history.pushState;
      originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        originalPushState.apply(history, args);
        handleRouteChangeStart();
        setTimeout(handleRouteChangeComplete, 300);
      };
      
      history.replaceState = function(...args) {
        originalReplaceState.apply(history, args);
        handleRouteChangeStart();
        setTimeout(handleRouteChangeComplete, 300);
      };
    }

    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handleRouteChangeStart);
        window.removeEventListener('beforeunload', handleRouteChangeStart);
        
        // Restore original history methods
        if (originalPushState && history.pushState !== originalPushState) {
          history.pushState = originalPushState;
        }
        if (originalReplaceState && history.replaceState !== originalReplaceState) {
          history.replaceState = originalReplaceState;
        }
      }
    };
  }, []);

  return { isRouteChanging };
}; 