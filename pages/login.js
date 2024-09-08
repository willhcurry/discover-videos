import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { magic } from '../lib/magic-client';
import { useEffect } from 'react';

// Define the Login component
const Login = () => {
  // State variables for email, user message, and loading status
  const [email, setEmail] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the router
  const router = useRouter();

  // Use effect to handle route changes and loading status
  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Clean up event listeners on component unmount
    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Handle email input change
  const handleOnChangeEmail = (e) => {
    setUserMsg('');
    const email = e.target.value;
    setEmail(email);
  };

  // Handle login with email
  const handleLoginWithEmail = async (e) => {
    e.preventDefault();

    if (email) {
      try {
        // Set loading status to true
        setIsLoading(true);

        // Login with Magic Link
        const didToken = await magic.auth.loginWithMagicLink({
          email,
        });

        if (didToken) {
          // Fetch login API with DID token
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${didToken}`,
              'Content-Type': 'application/json',
            },
          });

          // Get logged in response
          const loggedInResponse = await response.json();

          // Check if login is successful
          if (loggedInResponse.done) {
            console.log({ loggedInResponse });
            // Redirect to homepage
            router.push('/');
          } else {
            setIsLoading(false);
            setUserMsg("Something went wrong logging in");
          }
        } else {
          setIsLoading(false);
          setUserMsg("Something went wrong logging in");
        }
      } catch (error) {
        console.error('Something went wrong logging in', error);
        setIsLoading(false);
      }
    } else {
      setUserMsg('Enter a valid email address');
    }
  };

  // Render the login page
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Signin</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <a className={styles.logoLink} href='/'>
            <div className={styles.logoWrapper}>
              <Image
                src={"/static/netflix.svg"}
                alt="netflix logo"
                width="128"
                height="34"
              />
            </div>
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>
            Sign In
          </h1>
          <input
            type='text'
            placeholder='Email address'
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />

          <p className={styles.userMsg}>{userMsg}</p>

          <button
            onClick={handleLoginWithEmail}
            className={styles.loginBtn}
          >
            {isLoading ? 'Loading' : 'Sign In'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;