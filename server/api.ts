import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

import interpreter from "./interpreter";

const postsDir = path.join(process.cwd(), "_posts");

export type Post = {
  [key: string]: string;
}

export const getPostFiles = async (): Promise<string[]> => {
  return fs.readdir(postsDir);
};

export const getMarkdownContent = async (file: string): Promise<Post> => {
  const rawContent = await fs.readFile(path.join(postsDir, file), "utf8");
  const { content } = matter(rawContent);
  return { text: await interpreter(content) };
};

export const getPosts = async (): Promise<Post[]> => {
  const files = await getPostFiles();
  const posts = Promise.all(files.map(async (file) => await getMarkdownContent(file)));

  return posts;
};
