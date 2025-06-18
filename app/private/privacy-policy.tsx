import Head from "next/head";
import styles from "@/games/private/PrivacyPolicy.module.css";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p>This Privacy Policy outlines how we collect, use, and protect your information when you use our website.</p>

        <h2 className={styles.subtitle}>1. Information We Collect</h2>
        <p>We may collect personal information you provide (such as your name and email), and technical data (such as IP address and browser type).</p>

        <h2 className={styles.subtitle}>2. How We Use Your Information</h2>
        <p>We use your information to provide services, improve the website, and ensure security.</p>

        <h2 className={styles.subtitle}>3. Cookies</h2>
        <p>We may use cookies to enhance your experience. You can disable them through your browser settings.</p>

        <h2 className={styles.subtitle}>4. Third-Party Services</h2>
        <p>We may use trusted third parties like Google Analytics or Stripe. They have access only to necessary data.</p>

        <h2 className={styles.subtitle}>5. Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your data. You can also file a complaint with the appropriate authority.</p>

        <p className={styles.updated}>Last updated: June 5, 2025</p>

        <h2 className={styles.subtitle}>Contact</h2>
        <p>
          For any questions, email us at{" "}
          <a href="mailto:privacy@example.com" className={styles.link}>
            privacy@example.com
          </a>
        </p>
      </main>
    </>
  );
}
