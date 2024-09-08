import Image from 'next/image';
import styles from './card.module.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import cls from 'classnames';

// Define the Card component
const Card = (props) => {
  // Destructure props into imgUrl, size, and id
  const {
    imgUrl = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80',
    size = 'medium',
    id,
  } = props;

  // Initialize state for image source
  const [imgSrc, setImgSrc] = useState(imgUrl);

  // Define a class map for different sizes
  const classMap = {
    'large': styles.lgItem,
    'medium': styles.mdItem,
    'small': styles.smItem,
  };

  // Define a function to handle image errors
  const handleOnError = () => {
    console.log("ERROR");
    // Set a default image on error
    setImgSrc('https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80');
  };

  // Define scale animation based on id
  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  // Return the Card component
  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, classMap[size])}
        whileHover={{ ...scale }}
      >
        <Image
          src={imgSrc}
          alt="Image"
          fill={true}
          onError={handleOnError}
          className={styles.cardImg}
        />
      </motion.div>
    </div>
  );
};

// Export the Card component as the default export
export default Card;