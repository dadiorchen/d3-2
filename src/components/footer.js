import React from 'react';
import styles from '../../styles/Home.module.css';
import Image from 'next/image';

const Footer = () => {
  return (
    <div>
      <footer className={styles.footer}>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/WorkFusion_2.svg" alt="Vercel Logo" width={122} height={30} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Footer;
