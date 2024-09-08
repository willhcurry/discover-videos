import "../styles/globals.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { magic } from '../lib/magic-client';
import Loading from '../components/loading/loading';

// Define the App component
export default function App({ Component, pageProps }) {
  // Get the router object
  const router = useRouter();

  // Initialize state for loading status
  const [isLoading, setIsLoading] = useState(false);

  // Use effect to check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      // Check if the user is logged in using Magic
      const isLoggedIn = await magic.user.isLoggedIn();

      // Redirect to '/' if logged in, or '/login' if not
      if (isLoggedIn) {
        router.push('/');
      } else {
        router.push('/login');
      }
    };
    checkLoginStatus();
  }, []);

  // Return the Loading component if loading, otherwise return the page component
  return isLoading ? <Loading /> : <Component {...pageProps} />;
}