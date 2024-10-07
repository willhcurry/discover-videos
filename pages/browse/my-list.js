import Head from 'next/head';
import NavBar from "../../components/nav/navbar";
import SectionCards from '../../components/card/section-cards';
import useRedirectUser from '../../utils/redirectUser';
import { getMyList } from '../../lib/videos';
import styles from '../../styles/MyList.module.css';

export async function getServerSideProps(context) {
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
    console.log('myListVideos in getServerSideProps:', myListVideos);
    

    return {
        props: {
            myListVideos,
        },
    };
}

const MyList = ({ myListVideos }) => {
    console.log('myListVideos in MyList component:', myListVideos);
    

    return <div>
        <Head>
            <title>My List</title>
        </Head>
        <main className={styles.main}>
            <NavBar />
            <div classname={styles.sectionWrapper}>
                <SectionCards
                    title="My List"
                    videos={myListVideos}
                    size="small"
                />
            </div>
        </main>
    </div>
}

export default MyList;