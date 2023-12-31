import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../../style/Nav/SearchBar.module.css";
import { BsSearch } from "react-icons/bs";

function SearchBar() {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>();

  return (
    <div className={styles.finder}>
      <input
        className={styles.finder__input}
        type="text"
        placeholder="제목, 작가를 검색할 수 있습니다."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
      />
      <div
        className={styles.finder__icon}
        onClick={() => {
          navigate(`/webtoon/search/${title}`);
        }}
      >
        <BsSearch />
      </div>
    </div>
  );
}
export default SearchBar;
