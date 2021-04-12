import util from "util";
import path from "path";
import { exec as sync_exec } from "child_process";

import { CommitLog } from "../types";
import { postsDir } from "./api";
import markdownToHtml from "./interpreter";

const exec = util.promisify(sync_exec);

const execGitLogFollow = async(slug: string): Promise<string> => {
  const fullpath = path.join(postsDir, `${slug}.md`);
  const fname = path.relative(process.cwd(), fullpath);
  const { stdout, stderr } = await exec(`git log --follow -p ${fname}`);
  if (stderr) throw new Error(`failed to exec git log: ${stderr}`);

  return stdout;
};

const getCommitLogs = async(fname: string): Promise<CommitLog[]> => {
  const logs = await execGitLogFollow(fname);
  const commits: CommitLog[] = [];

  logs.split(/(?=commit)/g).forEach(async (diff) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [hash, author, date, empty, title] = diff.split("\n");
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const readableHash = hash.replace("commit ", "").substring(0, 8);
    const log = {
      title,
      date,
      hash: readableHash,
      diff: await diffToHtml(readableHash, diff.trim()),
    } as CommitLog;

    commits.push(log);
  });

  return commits;
};

const diffToHtml = async (title: string, text: string): Promise<string> => {
  const escaped = text.replace(/```/gi, "\\```");
  const markdown = `
  \`\`\`git[class="language-diff"][data-file="${title}.patch"]
  ${escaped}
  \`\`\`
  `;

  // TODO into react component instead of dangerouslyInnerHtml
  return await markdownToHtml(markdown);
};

export default getCommitLogs;
