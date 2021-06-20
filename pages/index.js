import Head from 'next/head';
import Image from 'next/image';
import Header from '../src/components/header';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Automation Cloud</title>
        <meta name="description" content="automation cloud dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
        </h1>

        <div className={styles.grid}>
          <a href="#" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find Supported Graphs and Visualization.</p>
          </a>

          <a href="/example-dashboard" className={styles.card}>
            <h2>Example Dashboard &rarr;</h2>
          </a>

          <a href="/playground" className={styles.card}>
            <h2>Play with Graphs! &rarr;</h2>
            <p>Customize and build your charts and give a new meaning to your datas.</p>
          </a>
        </div>
      </main>
    </div>
  );
}
