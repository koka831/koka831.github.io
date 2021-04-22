import util from "util";
import path from "path";
import { exec as sync_exec } from "child_process";

import { CommitLog } from "../types";
import { postsDir } from "./api";
import markdownToHtml from "./interpreter";

const exec = util.promisify(sync_exec);

const execGitLogFollow = async (fname: string): Promise<string> => {
  const fullpath = path.join(postsDir, fname);
  const relative = path.relative(process.cwd(), fullpath);
  const { stdout, stderr } = await exec(`git log --follow -p ${relative}`);
  if (stderr) throw new Error(`failed to exec git log: ${stderr}`);

  return stdout;
};

const getCommitLogs = async (fname: string): Promise<CommitLog[]> => {
  const commits: CommitLog[] = [];
  const logs = await execGitLogFollow(fname);

  for (const commit of logs.split(/(?=commit \b[0-9a-f]{5,40}\b)/g)) {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [hash, _author, date, _empty, title] = commit.split("\n");
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const readableHash = hash.replace("commit ", "").substring(0, 8);

    const log = {
      title: title?.trim() || "commit",
      date: date.slice(6, -6),
      hash: readableHash,
      diff: await diffToHtml(readableHash, commit.trim()),
    } as CommitLog;

    commits.push(log);
  }
  return commits;
};

const diffToHtml = async (title: string, text: string): Promise<string> => {
  // add backslash before codeblock to avoid rendering codeblock in codeblock
  const escaped = text
    .replace(/```/g, "\\```")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const markdown = `
  \`\`\`git[class="language-diff"][data-file="${title}.patch"]
  ${escaped}
  \`\`\`
  `;

  console.log(markdown);

  // TODO into react component instead of dangerouslyInnerHtml
  return await markdownToHtml(markdown);
};

export default getCommitLogs;
