import Link from "next/link";
import Card from './card';
import clsx from 'classnames';
import styles from './section-cards.module.css';

const SectionCards = ({ title, videos = [], size, shouldWrap = false }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, index) => {
          if (!video || !video.id) {
            console.error('Invalid video object:', video);
            return null;
          }
          const { kind, videoId } = video.id;
          let href = `/video/${videoId}`;
          if (kind === 'youtube#playlist') {
            href = `/playlist/${videoId}`;
          } else if (kind === 'youtube#channel') {
            href = `/channel/${videoId}`;
          }
          return (
            <Link key={`${kind}-${videoId}`} href={href}>
              <Card
                id={index}
                imgUrl={video.imgUrl}
                size={size}
                title={video.title}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;