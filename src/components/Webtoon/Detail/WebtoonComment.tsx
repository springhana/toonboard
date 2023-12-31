import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { commentType } from "../../../types/comment";
import { ReduxType } from "../../../types/redux";
import styles from "../../../style/Webtoon/Detail/WebtoonComment.module.css";

import { AiFillLike, AiOutlineLike } from "react-icons/ai";

export default function WebtoonComment({ webtoonID }: { webtoonID: string }) {
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [commentAll, setCommentAll] = useState<commentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [commentId, setCommentId] = useState("");
  const [chaneg, setChaneg] = useState(0);
  const [yesNo, setYesNo] = useState(false);

  const [id, setId] = useState(""); // 수정을 위한 state

  const login = useSelector((state: ReduxType) => {
    return state;
  });

  useEffect(() => {
    GetComment();
  }, [yesNo]);

  const GetComment = async () => {
    try {
      const response = await axios.get("/api/webtoon/commentAll", {
        params: { webtoonID: webtoonID },
      });
      setCommentAll(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // 좋아요 수정
  const like = async (_id: string) => {
    try {
      const response = await axios.put("/api/webtoon/like", {
        _id: _id,
      });
    } catch (error) {
      console.log(error);
    } finally {
      GetComment();
      console.log("finally");
    }
  };

  // 댓글 쓰기
  const PostComment = async () => {
    try {
      const response = await axios.post("/api/webtoon/comment", {
        comment: comment,
        webtoonID: webtoonID,
      });
      GetComment();
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };
  // 댓글 삭제
  const removeComment = async (id: string) => {
    try {
      const response = await axios.delete("/api/webtoon/delete", {
        params: { _id: id },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 이미지 업로디 핸들러
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      const response = await fetch("/api/webtoon/update", {
        method: "put",
        body: new FormData(event.currentTarget), // 폼 데이터를 직접 전송
      });
      if (response.ok) {
        navigate(0);
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <div className={styles.webtoon_comment}>
      <h3 className={styles.webtoon_comment_logo}>Comments</h3>
      {login.loginCheck.login ? (
        <div className={styles.webtoon_comment_post}>
          <input
            type="text"
            name="comment"
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setComment(e.target.value);
            }}
          />
          <button
            onClick={() => {
              PostComment();
            }}
            className={styles.webtoon_comment_btn}
          >
            댓글 쓰기
          </button>
        </div>
      ) : (
        <div className={styles.webtoon_comment_login}>
          로그인해야 댓글을 등록할 수 있습니다.
        </div>
      )}

      <div className={styles.webtoon_comment_outter}>
        {/* 댓글 내용 */}
        {loading
          ? "Loading..."
          : commentAll.map((data: commentType, index: number) => (
              <div key={index} className={styles.webtoon_comment_container}>
                <p className={styles.webtoon_comment_author}>
                  {data.author}
                  <span className={styles.webtoon_comment_date}>
                    {data.date}
                  </span>
                </p>
                <div className={styles.webtoon_comment_comments}>
                  {data.comment}
                </div>
                <div
                  onClick={() => {
                    like(data._id);
                  }}
                  className={styles.webtoon_comment_like}
                >
                  {data.likedIds && data.likedIds.length > 0 ? (
                    <div className={styles.webtoon_comment_like_inner}>
                      <AiFillLike />
                      <span className={styles.webtoon_comment_like_length}>
                        {data.likedIds.length}
                      </span>
                    </div>
                  ) : (
                    <div className={styles.webtoon_comment_like_inner}>
                      <AiOutlineLike />
                      <span className={styles.webtoon_comment_like_length}>
                        {data.likedIds.length}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.webtoon_comment_post_container}>
                  {/* 수정 */}
                  {login.loginCheck.login &&
                  login.loginCheck._id === data.userId ? (
                    id === data._id && yesNo ? (
                      <form
                        method="POST"
                        action="/api/webtoon/update?_method=PUT"
                        className={styles.webtoon_comment_post}
                        onSubmit={handleSubmit}
                      >
                        <input
                          type="text"
                          name="comment"
                          value={value}
                          onChange={(e: any) => {
                            setValue(e.target.value);
                          }}
                        />
                        <input type="hidden" name="_id" value={id} />
                        <button
                          type="submit"
                          className={styles.webtoon_comment_btn}
                        >
                          수정
                        </button>
                        <button
                          className={styles.webtoon_comment_btn}
                          onClick={() => {
                            setId("");
                            setChaneg(0);
                            setValue("");
                          }}
                        >
                          취소
                        </button>
                      </form>
                    ) : chaneg === 1 && id === data._id ? null : (
                      <div className={styles.webtoon_comment_update}>
                        <button
                          onClick={() => {
                            setChaneg((prev) => (prev = 2));
                            setId((prev) => (prev = data._id));
                            setValue(data.comment);
                            setYesNo(true);
                          }}
                        >
                          수정
                        </button>
                      </div>
                    )
                  ) : null}

                  {/* 삭제 */}
                  {login.loginCheck.login &&
                  login.loginCheck._id === data.userId ? (
                    id === data._id && !yesNo ? (
                      <div className={styles.webtoon_comment_post}>
                        <span
                          onClick={() => {
                            setYesNo(false);
                            removeComment(commentId);
                            setChaneg(0);
                          }}
                          className={styles.webtoon_comment_btn}
                        >
                          삭제
                        </span>
                        <span
                          onClick={() => {
                            setYesNo(true);
                            setId("");
                            setChaneg(0);
                          }}
                          className={styles.webtoon_comment_btn}
                        >
                          취소
                        </span>
                      </div>
                    ) : chaneg === 2 && id === data._id ? null : (
                      <div className={styles.webtoon_comment_update}>
                        <button
                          onClick={() => {
                            setCommentId(data._id);
                            setId(data._id);
                            setYesNo(false);
                            setChaneg((prev) => (prev = 1));
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
