import { useRouter } from 'next/router';
import Modal from 'react-modal';
import styles from '../../styles/Video.module.css';

import clsx from "classnames";

Modal.setAppElement('#__next')

const Video = () => {
    const router = useRouter();
    console.log({ router });

    const video = {
        title: 'In a nutshell',
        publishTime: '1999-01-0',
        description: 'A simple explanation for the people to understand complex topics',
        channelTitle: "Kurgesagt",
        viewCount: 10000
    };

    const { title, publishTime, description, channelTitle, viewCount } = video;
    
    return <div className={styles.container}>
                <Modal
                    isOpen={true}
                    contentLabel='Watch Video'
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
                        src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
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
                                        <span className={styles.textColor}>Cast: </span>
                                        <span className={styles.channelTitle}>
                                            {channelTitle}
                                        </span>
                                    </p>
                                    <p className={clsx(styles.subText, styles.subTextWrapper)}>
                                        <span className={styles.textColor}>View Count: </span>
                                        <span className={styles.channelTitle}>
                                            {viewCount}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                </Modal>
            </div>
};

export default Video;