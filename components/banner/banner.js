import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './banner.module.css';

const Banner = ({ title, subTitle, imgUrl, videoId }) => {
  const router = useRouter();
  const fallbackImgUrl = '/static/banner-fallback.jpg';

  const handleOnPlay = () => {
    console.log('handleOnPlay');
    router.push(`video/${videoId}`);
  };

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
                width={32}
                height={32}
              />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imgUrl}), url(${fallbackImgUrl})`,
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