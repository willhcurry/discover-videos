import styles from './loading.module.css';

// Define the Loading component
const Loading = () => {
  // Return a paragraph element with the loader class
  return <p className={styles.loader}>Loading...</p>;
};

// Export the Loading component as the default export
export default Loading;