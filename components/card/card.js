import Image from 'next/image';
import styles from './card.module.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import cls from 'classnames';

const Card = (props) => {
  const {
    imgUrl = '/path/to/fallback/image.jpg',
    size = 'medium',
    id,
  } = props;

  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = {
    'large': styles.lgItem,
    'medium': styles.mdItem,
    'small': styles.smItem,
  };

  const handleOnError = () => {
    console.log("Image load error for:", imgSrc);
    setImgSrc('/path/to/fallback/image.jpg');
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
          alt={`Card ${id}`}
          fill={true}
          onError={handleOnError}
          className={styles.cardImg}
        />
      </motion.div>
    </div>
  );
};

export default Card;