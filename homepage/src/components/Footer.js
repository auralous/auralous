import { Link } from "preact-router/match";
import constants from "../constants.js";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer class={styles.footer}>
      <div class={styles.links}>
        <a href={constants.facebook.href}>Facebook</a>
        <a href={constants.twitter.href}>Twitter</a>
        <Link href="/privacy">Privacy</Link>
        <a href={constants.github.href}>GitHub</a>
      </div>
    </footer>
  );
};

export default Footer;
