import React from 'react';
import Link from 'next/link';

import styles from '../../styles/Home.module.css';

const Header = () => {
  return (
    <div className={styles.header}>
      <nav className={styles.usecase}>
        <h3>KYC Document Handling</h3>
      </nav>
      <div className={styles.menuItems}>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>
        </nav>
        <nav>
          <Link href="/example-dashboard">
            <a>Dashboard</a>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
