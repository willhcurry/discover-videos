import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Login.module.css';

const Login = () => {

    const handleLoginWithEmail = (e) => {
        e.preventDefault();
        console.log("BUTTON");
        
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix Signin</title>
            </Head>

            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <a className={styles.logoLink} href='/'>
                        <div className={styles.logoWrapper}>
                            <Image 
                                src={"/static/netflix.svg"} 
                                alt="netflix logo" 
                                width="128" 
                                height="34"
                            />
                        </div>
                    </a>
                </div>
                </header>

                <main className={styles.main}>
                    <div className={styles.mainWrapper}>
                        <h1 className={styles.signinHeader}>
                            Sign In
                        </h1>
                        <input 
                            type='text' 
                            placeholder='Email address' 
                            className={styles.emailInput}
                        />

                        <p className={styles.userMsg}></p>

                        <button 
                            onClick={handleLoginWithEmail}
                            className={styles.loginBtn}
                        >
                            Sign In
                        </button>
                    </div>
                </main>

            
        </div>
    )
};

export default Login;

/*{ <Link className={styles.logoLink} href="/"> /** <--- this is the Link component **/
//   <a>
//     <div className={styles.logoWrapper}>
//       <Image
//         src="/static/netflix.svg"
//         alt="Netflix logo"
//         width="128px"
//         height="34px"
//       />
//     </div>
//   </a>
// </Link> */}