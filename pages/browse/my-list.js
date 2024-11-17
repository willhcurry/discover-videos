import Head from 'next/head';
import NavBar from "../../components/nav/navbar";
import SectionCards from '../../components/card/section-cards';
import useRedirectUser from '../../utils/redirectUser';
import { getMyList } from '../../lib/videos';
import styles from '../../styles/MyList.module.css';

const MyList = ({ myListVideos = [] }) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          {myListVideos.length > 0 ? (
            <SectionCards
              title="My List"
              videos={myListVideos}
              size="small"
              shouldWrap
            />
          ) : (
            <div className={styles.emptyMessage}>
              No videos in your list yet!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const { userId, token } = await useRedirectUser(context);

    if (!userId) {
      return {
        props: {},
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const myListVideos = await getMyList(userId, token);

    return {
      props: {
        myListVideos,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        myListVideos: [],
      },
    };
  }
}

export default MyList;