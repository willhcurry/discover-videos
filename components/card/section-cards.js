import Link from "next/link";
import Card from './card';
import styles from './section-cards.module.css';

const SectionCards = (props) => {
  const { title, videos = [], size } = props;

  const getVideoId = (video) => {
    if (typeof video.id === 'string') return video.id;
    if (video.id.videoId) return video.id.videoId;
    if (video.id.channelId) return video.id.channelId;
    if (video.id.playlistId) return video.id.playlistId;
    return null;
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video) => {
          const videoId = getVideoId(video);
          return (
            <Link key={videoId} href={`/video/${videoId}`}>
              <Card
                id={videoId}
                imgUrl={video.imgUrl}
                size={size}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;