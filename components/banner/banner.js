import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './banner.module.css';

// Define the Banner component
const Banner = (props) => {
  // Destructure props into title, subTitle, imgUrl, and videoId
  const { title, subTitle, imgUrl, videoId } = props;

  // Initialize the router
  const router = useRouter();

  // Define a function to handle the play button click
  const handleOnPlay = () => {
    console.log('handleOnPlay');
    // Navigate to the video page with the videoId
    router.push(`video/${videoId}`);
  };

  // Return the Banner component
  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          <div className={styles.nseriesWrapper}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.series}>S E R I E S</p>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <h3 className={styles.subTitle}>{subTitle}</h3>
          <div className={styles.playBtnWrapper}>
            <button
              className={styles.btnWithIcon}
              onClick={handleOnPlay}
            >
              <Image
                src="/static/play_arrow.svg"
                alt="Play icon"
                width="32"
                height="32"
              />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.bannerImg}
        style={{
          // Set the background image to the imgUrl prop
          backgroundImage: `url(${imgUrl})`,
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundSize: 'cover',
          backgroundPosition: '50% 50%',
        }}
      />
    </div>
  );
};

export default Banner;