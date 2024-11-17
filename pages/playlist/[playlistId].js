import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import NavBar from "../../components/nav/navbar";
import clsx from "classnames";
import { getYoutubePlaylistById } from "../../lib/videos";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  const playlistId = context.params.playlistId;
  const playlistArray = await getYoutubePlaylistById(playlistId);

  return {
    props: {
      playlist: playlistArray.length > 0 ? playlistArray[0] : {},
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const listOfPlaylists = [];
  const paths = listOfPlaylists.map((playlistId) => ({
    params: { playlistId },
  }));
  return { paths, fallback: "blocking" };
}

const Playlist = ({ playlist }) => {
  const router = useRouter();
  const playlistId = router.query.playlistId;

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics = { viewCount: 0 },
  } = playlist;

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Watch the playlist"
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
          src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=0&origin=http://example.com&controls=1`}
          frameBorder="0"
        ></iframe>
        
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Channel: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              {statistics?.viewCount && (
                <p className={clsx(styles.subText, styles.subTextWrapper)}>
                  <span className={styles.textColor}>View Count: </span>
                  <span className={styles.channelTitle}>{statistics.viewCount}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Playlist;