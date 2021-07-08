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
           
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Footer;
