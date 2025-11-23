// src/hooks/useLoading.js
import { useState, useEffect } from 'react';

const useLoading = (minimumLoadingTime = 1000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    let slowConnectionTimer;
    let minimumTimer;

    // Check if connection is slow (taking more than 500ms)
    slowConnectionTimer = setTimeout(() => {
      setIsSlowConnection(true);
    }, 500);

    // Minimum loading time to prevent flash
    minimumTimer = setTimeout(() => {
      setIsLoading(false);
    }, minimumLoadingTime);

    // Simulate actual loading completion
    const handleLoad = () => {
      clearTimeout(slowConnectionTimer);
      clearTimeout(minimumTimer);
      setIsLoading(false);
      setIsSlowConnection(false);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(slowConnectionTimer);
      clearTimeout(minimumTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, [minimumLoadingTime]);

  return { isLoading, isSlowConnection };
};

export default useLoading;