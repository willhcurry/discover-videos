import Link from "next/link";
import Card from './card';
import styles from './section-cards.module.css';

// Define the SectionCards component
const SectionCards = (props) => {
  // Destructure props into title, videos, and size
  const { title, videos = [], size } = props;

  // Return the SectionCards component
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, idx) => {
          // Map each video to a Card component wrapped in a Link
          return (
            <Link legacyBehavior href={`/video/${video.id}`}>
              <a>
                <Card
                  // Pass the index as the id prop
                  id={idx}
                  // Pass the video's imgUrl and size as props
                  imgUrl={video.imgUrl}
                  size={size}
                />
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

// Export the SectionCards component as the default export
export default SectionCards;