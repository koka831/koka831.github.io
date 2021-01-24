import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "_posts");

export type Post = {
  [key: string]: string;
}

export function getPostFiles(): string[] {
  return fs.readdirSync(postsDir);
}

export const getMarkdownContent = (file: string): Post => {
  const content = fs.readFileSync(path.join(postsDir, file), "utf8");
  return { text: content };
};

export function getPosts(): Post[] {
  const posts = getPostFiles()
    .map((file) => getMarkdownContent(file));
  return posts;
}
