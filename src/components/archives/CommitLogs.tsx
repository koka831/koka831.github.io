import type { CommitLog } from "../../types";

import styles from "./CommitLogs.module.css";

type Props = {
  logs: CommitLog[];
};

export const CommitLogs = ({ logs }: Props) => {
  return (
    <div className={styles.commit_logs} role="log">
      <h2>Commits</h2>
      {logs.map((log) => {
        return (
          <details key={log.hash}>
            <summary className={styles.summary}>
              <span className={styles.commit__date}>{log.date}</span>
              <span className={styles.commit__hash}>{log.hash}</span>
              <span className={styles.commit__message}>{log.title}</span>
            </summary>
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted git diff content
              dangerouslySetInnerHTML={{ __html: log.diff }}
            />
          </details>
        );
      })}
    </div>
  );
};
