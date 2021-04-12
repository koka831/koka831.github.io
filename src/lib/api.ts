import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

import { Post } from "../types";
import interpreter from "./interpreter";
import getCommitLogs from "./commit-log";

const POST_EXT = ".md";

export const postsDir = path.join(process.cwd(), "_posts");

export const getPosts = async (): Promise<Post[]> => {
  const files = await fs.readdir(postsDir);
  const posts = await Promise.all(files.map(async (file) => await getMarkdownContent(file)));

  // order by latest
  return posts.reverse();
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const commits = await getCommitLogs(slug);
  const post = await getMarkdownContent(`${slug}${POST_EXT}`);
  post.commits = commits;

  return post;
};

// TODO: refac data type
const getMarkdownContent = async (fname: string): Promise<Post> => {
  const rawContent = await fs.readFile(path.join(postsDir, fname), "utf8");
  const { content, data } = matter(rawContent);
  const html = await interpreter(content);

  const post: Post = {
    slug: fname.replace(RegExp(`${POST_EXT}$`), ""),
    title: data.title,
    // NOTE `Date` object cannot be serialized in `getStaticProps`
    date: new Date(data.date)?.toDateString() || "-",
    categories: data.categories || [],
    tags: data.tags || [],
    content: html,
    // create excerpt from the beginning of the content
    description: data.description || `${content.slice(0, 100)}...`,
    commits: [],
  };

  return post;
};
