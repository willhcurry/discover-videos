import { useRouter } from 'next/router';
import Modal from 'react-modal';
import styles from '../../styles/Video.module.css';
import clsx from "classnames";
import { getYoutubeVideoById } from '../../lib/videos';
import NavBar from '../../components/nav/navbar';
import LikeIcon from '../../components/icons/like-icon';
import DislikeIcon from '../../components/icons/dislike-icon';
import { useState } from 'react';
import { stringify } from 'querystring';

// Set the app element for React Modal
Modal.setAppElement('#__next');

// Define getStaticProps to pre-render video pages
export async function getStaticProps(context) {
  // Get the video ID from the URL parameters
  const videoId = context.params.videoId;

  // Fetch video data from the YouTube API
  const videoArray = await getYoutubeVideoById(videoId);

  // Return the video data as props
  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    // Revalidate the page every 10 seconds
    revalidate: 10,
  };
}

// Define getStaticPaths to pre-render video pages
export async function getStaticPaths() {
  // Define a list of video IDs to pre-render
  const listOfVideos = ["dBxxi5XAm3U", "fozrKigg7t0", "lbaG6JqnEZs"];

  // Create an array of URL parameters for each video
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  // Return the paths and set fallback to 'blocking'
  return { paths, fallback: 'blocking' };
}

// Define the Video component
const Video = ({ video }) => {
  // If no video data is available, display a loading message
  if (!video) return <div>Loading...</div>;

  // Get the router object
  const router = useRouter();

  const videoId = router.query.videoId;

  // Toggle state of like and dislike
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);
  
  // Destructure video data
  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  const runRatingService = async (favorited) => {
    return await fetch("/api/stats", {
      method: 'POST',
        body: JSON.stringify({
            videoId, 
            favorited
        }),
        headers: {
            "Content-Type" : "application/json"
        },
    });
  }

  // Toggle like and dislike handlers
  const handleToggleDislike = async () => {
    console.log('handleToggleDislike');
    const val = !toggleDislike;
    setToggleDislike(val);
    setToggleLike(toggleDislike);

    const favorited = val ? 0 : 1;
    const response = await runRatingService(favorited);
    console.log("data", await response.json());
  }

  const handleToggleLike = async () => {
    console.log('handleToggleLike');
    const val = !toggleLike;
    setToggleLike(val);
    setToggleDislike(toggleLike);

    const favorited = val ? 0 : 1;
    const response = await runRatingService(favorited);
    console.log("data", await response.json());
  }

  // Return the Video component
  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Watch Video"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
          frameBorder="0"
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
            <div className={styles.likeBtnWrapper}>
                <button onClick={handleToggleLike}>
                    <div className={styles.btnWrapper}>
                        <LikeIcon selected={toggleLike} />
                    </div>
                </button>
            </div>
            <button onClick={handleToggleDislike}>
                <div className={styles.btnWrapper}>
                    <DislikeIcon selected={toggleDislike} />
                </div>
            </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p
                className={clsx(
                  styles.subText,
                  styles.subTextWrapper
                )}
              >
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p
                className={clsx(
                  styles.subText,
                  styles.subTextWrapper
                )}
              >
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Export the Video component as the default export
export default Video;