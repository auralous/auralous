import android from "../assets/android.svg";
import apple from "../assets/apple.svg";
import logo from "../assets/logo.svg";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div class="container">
      <div class={styles.first}>
        <div class={styles.logo}>
          <img src={logo} />
        </div>
        <p class={styles.motto}>Listen Together</p>
        <div class={styles.launches}>
          <a
            class={`${styles.launch} ${styles.launchWeb}`}
            href="https://app.auralous.com"
          >
            Web App
          </a>
          <a class={`${styles.launch} ${styles.launchNative}`}>
            <img width={24} alt="Apple" src={apple} /> Coming soon
          </a>
          <a class={`${styles.launch} ${styles.launchNative}`}>
            <img width={24} alt="Android" src={android} /> Coming soon
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
