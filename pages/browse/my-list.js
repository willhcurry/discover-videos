import Head from 'next/head';
import NavBar from "../../components/nav/navbar";
import SectionCards from '../../components/card/section-cards';

import styles from '../../styles/MyList.module.css';

const MyList = () => {
    return <div>
        <Head>
            <title>My List</title>
        </Head>
        <main className={styles.main}>
            <NavBar />
            <div classname={styles.sectionWrapper}>
                <SectionCards
                    title="My List"
                    videos={[]}
                    size="small"
                />
            </div>
        </main>
    </div>
}

export default MyList;