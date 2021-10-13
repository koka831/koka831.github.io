import React from "react";
import { CommitLog } from "../../types";

import styles from "./CommitLogs.module.scss";

type Props = {
  logs: CommitLog[];
};

export const CommitLogs: React.VFC<Props> = ({ logs }: Props) => {
  return (
    <div className={styles.commit_logs} role="log">
      <h2>Commits</h2>
      {logs.map((log) => {
        return (
          <details key={log.hash}>
            <summary>
              <span className={styles.commit__date}>{log.date}</span>
              <span className={styles.commit__hash}>{log.hash}</span>
              <span className={styles.commit__message}>{log.title}</span>
            </summary>
            <div dangerouslySetInnerHTML={{ __html: log.diff }} />
          </details>
        );
      })}
    </div>
  );
};

export default CommitLogs;
