import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import Modal from "../Modal";

import {
  onClose as login_Close,
  addId,
  login as logins,
} from "../../store/LoginStore";
import {
  onOpen as register_Open,
  onClose as register_Close,
} from "../../store/RegisterStore";

import { ReduxType } from "../../types/redux";

import styles from "../../style/Modal/Modal.module.css";
import { AiFillCloseCircle } from "react-icons/ai";

export default function LoginModal() {
  const dispatch = useDispatch();

  const [id, setId] = useState<string>();
  const [pw, setPw] = useState<string>();

  let login = useSelector((state: ReduxType) => {
    return state.login;
  });

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/login", { id: id, pw: pw });
      if (response.data.login) {
        dispatch(addId(response.data._id));
        dispatch(logins());
        dispatch(login_Close());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const title = <div className={styles.title}>로그인</div>;
  const input = (
    <div>
      <div className={styles.id}>
        <label>아이디</label>
        <input
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setId(e.target.value);
          }}
        />
      </div>
      <div className={styles.pw}>
        <label>비밀번호</label>
        <input
          type="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPw(e.target.value);
          }}
        />
      </div>
    </div>
  );
  const button = (
    <div className={styles.btn}>
      <button
        className={styles.login_btn}
        onClick={() => {
          handleLogin();
        }}
      >
        로그인
      </button>
      <button
        className={styles.register_btn}
        onClick={() => {
          dispatch(register_Open());
          dispatch(login_Close());
        }}
      >
        회원가입
      </button>
    </div>
  );

  const close = (
    <button
      className={styles.close}
      onClick={() => {
        dispatch(login_Close());
        dispatch(register_Close());
      }}
    >
      <AiFillCloseCircle />
    </button>
  );

  return (
    <Modal
      isOpen={login}
      title={title}
      input={input}
      button={button}
      close={close}
    />
  );
}
