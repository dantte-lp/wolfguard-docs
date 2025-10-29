import React, { useEffect } from 'react';
import { Redirect } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  // Automatic redirect after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/docs/';
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout
      title="Welcome"
      description="OpenConnect Protocol Documentation - Cisco Secure Client 5.x+ Reverse Engineering">
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            🛡️ WolfGuard Documentation
          </h1>
          <p className={styles.subtitle}>
            {siteConfig.tagline}
          </p>

          <div className={styles.buttons}>
            <Link
              className={styles.buttonPrimary}
              to="/docs/">
              📚 View Documentation
            </Link>
            <Link
              className={styles.buttonSecondary}
              to="/docs/wolfguard/getting-started/quick-start">
              🚀 Quick Start
            </Link>
            <Link
              className={styles.buttonSecondary}
              to="/docs/openconnect-protocol/intro">
              📡 Protocol Analysis
            </Link>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>🔬 Reverse Engineering</h3>
              <p>
                Complete analysis of Cisco Secure Client 5.x+ protocol through
                binary reverse engineering and network traffic analysis.
              </p>
            </div>
            <div className={styles.feature}>
              <h3>🔒 Security Research</h3>
              <p>
                In-depth cryptographic analysis including TLS 1.3, DTLS,
                and custom authentication mechanisms.
              </p>
            </div>
            <div className={styles.feature}>
              <h3>⚡ Modern Implementation</h3>
              <p>
                WolfGuard server built with WolfSSL, implementing the full
                OpenConnect protocol with C23 standards.
              </p>
            </div>
          </div>

          <p className={styles.redirect}>
            Redirecting to documentation in 2 seconds...
          </p>
        </div>
      </main>
    </Layout>
  );
}
