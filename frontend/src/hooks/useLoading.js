// src/hooks/useLoading.js
import { useState, useEffect } from 'react';

const useLoading = (minimumLoadingTime = 1000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    let slowConnectionTimer;
    let minimumTimer;


    slowConnectionTimer = setTimeout(() => {
      setIsSlowConnection(true);
    }, 500);


    minimumTimer = setTimeout(() => {
      setIsLoading(false);
    }, minimumLoadingTime);


    const handleLoad = () => {
      clearTimeout(slowConnectionTimer);
      clearTimeout(minimumTimer);
      setIsLoading(false);
      setIsSlowConnection(false);
    };


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