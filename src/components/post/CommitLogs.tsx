import React from "react";
import { CommitLog } from "../../types";

import styles from "./commit-logs.module.scss";

type Props = {
  logs: CommitLog[];
}

export const CommitLogs: React.FC<Props> = ({ logs }: Props) => {
  return (
    <div className={styles.commit_logs} role="log">
      <h2>Commits</h2>
      {logs.map((log) => {
        return (
          <details key={log.hash}>
            <summary>{log.title} | {log.hash} | {log.date}</summary>
            <p dangerouslySetInnerHTML={{__html: log.diff}} />
          </details>
        );
      })}
    </div>
  );
};

export default CommitLogs;
