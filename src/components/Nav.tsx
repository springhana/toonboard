import styles from "../style/Nav.module.css";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./search/SearchBar";
import Logo from "./Logo";

function Nav() {
  const location = useLocation();
  function NowLoaction(url: string) {
    if (url === location.pathname.split("/")[3]) {
      return styles.location;
    } else if (url === location.pathname.split("/")[2]) {
      return styles.location;
    } else {
      return null;
    }
  }

  return (
    <div className={styles.nav}>
      <div className={styles.nav_Logo}>
        <h1>
          <Link to={"/"}>
            <Logo />
          </Link>
        </h1>
        <div>
          <SearchBar />
        </div>
      </div>

      <div className={styles.nav_service}>
        <ul>
          <div className={styles.nav_service_category}>
            <Link to={"/"}>
              <li
                style={{ width: "100%" }}
                className={location.pathname === "/" ? styles.location : null}
              >
                홈
              </li>
            </Link>
            <Link to={"/webtoon/naver"}>
              <li style={{ width: "100%" }} className={NowLoaction("naver")}>
                네이버
              </li>
            </Link>
            <Link to={"/webtoon/kakao"}>
              <li style={{ width: "100%" }} className={NowLoaction("kakao")}>
                카카오
              </li>
            </Link>
            <Link to={"/webtoon/kakaoPage"}>
              <li
                style={{ width: "100%" }}
                className={NowLoaction("kakaoPage")}
              >
                카카오 페이지
              </li>
            </Link>
          </div>
        </ul>
      </div>
    </div>
  );
}

export default Nav;
