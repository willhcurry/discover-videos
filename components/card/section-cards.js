import Link from "next/link";
import Card from './card';
import clsx from 'classnames';
import styles from './section-cards.module.css';

const SectionCards = ({ title, videos = [], size, shouldWrap = false }) => {
  console.log(`${title} - Videos to be rendered:`, videos);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, index) => {
          if (!video?.id) {
            console.warn('Video without ID:', video);
            return null;
          }

          // Add logging to check routing
          let href;
          const { id } = video;
          if (id.kind === 'youtube#channel') {
            href = `/channel/${id.channelId}`;
          } else if (id.kind === 'youtube#playlist') {
            href = `/playlist/${id.playlistId}`;
          } else {
            href = `/video/${id.videoId}`;
          }
          
          console.log('Link generated for item:', {
            kind: id.kind,
            href,
            originalId: id
          });

          return (
            <Link 
              key={`${id.kind}-${id.videoId || id.channelId || id.playlistId}`} 
              href={href}
            >
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