import Head from 'next/head';
import NavBar from "../../components/nav/navbar";
import SectionCards from '../../components/card/section-cards';
import useRedirectUser from '../../utils/redirectUser';
import { getMyList } from '../../lib/videos';
import styles from '../../styles/MyList.module.css';

const MyList = ({ myListVideos = [] }) => {
  console.log('Rendering MyList component with videos:', myListVideos);
  
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
      console.log('No userId found, redirecting to login');
      return {
        props: {},
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    console.log('Fetching my list videos for user:', userId);
    const myListVideos = await getMyList(userId, token);
    console.log('Fetched myListVideos:', myListVideos);

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