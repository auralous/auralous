import { Link } from "preact-router/match";
import logo from "../assets/logo.svg";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <div class={styles.header}>
      <Link href="/" alt="Homepage">
        <img src={logo} width={148} />
      </Link>
    </div>
  );
};

export default Header;
