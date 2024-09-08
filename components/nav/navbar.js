import { useEffect, useState } from 'react';
import styles from './navbar.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { magic } from '../../lib/magic-client';

// Define the NavBar component
const NavBar = () => {
  // Initialize state for dropdown visibility and username
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');

  // Initialize the router
  const router = useRouter();

  // Use effect to retrieve username on component mount
  useEffect(() => {
    async function getUsername() {
      try {
        // Get user metadata from Magic
        const { email, issuer } = await magic.user.getMetadata();
        const didToken = await magic.user.getIdToken();
        console.log({ didToken });

        // Set username if email is available
        if (email) {
          setUsername(email);
        }
      } catch (error) {
        console.log("Error retrieving email:", error);
      }
    }
    getUsername();
  }, []);

  // Define event handlers for navigation and dropdown
  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push('/');
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push('/browse/my-list');
  };

  const handleShowDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      // Log out user using Magic
      await magic.user.logout();
      console.log(await magic.user.isLoggedIn());
      router.push('/login');
    } catch (error) {
      console.error('Error logging out', error);
      router.push('/login');
    }
  };

  // Return the NavBar component
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>

        <nav className={styles.navContainer}>
          <div>
            <button
              className={styles.usernameBtn}
              onClick={handleShowDropdown}
            >
              <p className={styles.username}>{username}</p>
              <Image
                src={"/static/expand_more.svg"}
                alt="Expand dropdown"
                width="24"
                height="24"
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <Link legacyBehavior href="/login">
                  <a className={styles.linkName} onClick={handleSignout}>
                    Sign out
                  </a>
                </Link>
                <div className={styles.lineWrapper}></div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

// Export the NavBar component as the default export
export default NavBar;