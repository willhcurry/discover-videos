import Image from 'next/image';
import styles from './card.module.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import cls from 'classnames';

const Card = ({ imgUrl = '/static/fallback-image.jpg', size = 'medium', id, title = 'No Title' }) => {
  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = {
    'large': styles.lgItem,
    'medium': styles.mdItem,
    'small': styles.smItem,
  };

  const handleOnError = () => {
    console.log(`Image load error for: ${imgSrc}`);
    setImgSrc('/static/fallback-image.jpg');
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, classMap[size])}
        whileHover={{ ...scale }}
      >
        <Image
          src={imgSrc}
          alt={title}
          fill
          onError={handleOnError}
          className={styles.cardImg}
        />
      </motion.div>
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default Card;