import Head from "next/head";
import styles from "@/styles/Home.module.css";

import Banner from '../components/banner/banner';
import NavBar from '../components/nav/navbar';
import SectionCards from '../components/card/section-cards';

import { getPopularVideos, getVideos, getWatchItAgainVideos } from "../lib/videos";
import useRedirectUser from "../utils/redirectUser";

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

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  const dreamworksVideos = await getVideos("dreamworks trailer");
  const kurzgesagtVideos = await getVideos("kurzgesagt");
  const infographicsVideos = await getVideos("infographics channel");
  const popularVideos = await getPopularVideos();

  return {
    props: {
      dreamworksVideos,
      kurzgesagtVideos,
      infographicsVideos,
      popularVideos,
      watchItAgainVideos
    },
  };
}

export default function Home({
  dreamworksVideos,
  kurzgesagtVideos,
  infographicsVideos,
  popularVideos,
  watchItAgainVideos = []
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Video Streaming App</title>
        <meta name="description" content="A video streaming application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <NavBar />
        <Banner
          videoId="dBxxi5XAm3U"
          title="Kurzgesagt"
          subTitle="Time Travel"
          imgUrl="/static/banner-image.jpg"
        />

        <div className={styles.sectionWrapper}>
          <SectionCards title="Dreamworks" videos={dreamworksVideos} size="large" />
          <SectionCards title="Watch it again" videos={watchItAgainVideos} size="small" />
          <SectionCards title="Kurzgesagt" videos={kurzgesagtVideos} size="small" />
          <SectionCards title="The Infographics Show" videos={infographicsVideos} size="medium" />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </main>
    </div>
  );
}