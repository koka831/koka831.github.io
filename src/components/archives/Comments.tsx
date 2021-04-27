import React, { useEffect } from "react";

import styles from "./Comments.module.scss";

const Comments: React.VFC = () => {
  useEffect(() => {
    // mount external script that loads iframe
    const comment = document.getElementById("github-comment-container");
    if (comment == null) return;

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.setAttribute("repo", "koka831/koka831.github.io");
    script.setAttribute("issue-term", "title");
    script.setAttribute("theme", "github-dark-orange");
    script.setAttribute("label", "blog-comment");

    comment.appendChild(script);
  }, []);

  return (
    <div className={styles.comment} role="comment">
      <h2 className={styles.title}>Comments</h2>
      <div id="github-comment-container" />
    </div>
  );
};

export default Comments;
