import "../styles/globals.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { magic } from '../lib/magic-client';

import Loading from '../components/loading/loading';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const checkLoginStatus = async () => {
    const isLoggedIn = await magic.user.isLoggedIn();
    if (isLoggedIn) {
      router.push('/');
    } else {
      router.push('/login');
    }
  };
  checkLoginStatus();
}, []);

useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />;
}

