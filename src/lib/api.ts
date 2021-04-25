import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

import { Post } from "../types";
import interpreter from "./interpreter";
import getCommitLogs from "./commit-log";
import Moment from "./moment";

import * as CONST from "./const";

const POST_EXT = ".md";

export const postsDir = path.join(process.cwd(), "_posts");

export const getPosts = async (): Promise<Post[]> => {
  const files = await fs.readdir(postsDir);
  const posts = await Promise.all(files.map(async (file) => await getMarkdownContent(file)));

  // order by latest
  return posts.reverse();
};

export const getSlugs = async (): Promise<string[]> => {
  const files = await fs.readdir(postsDir);
  const slugs = files.map((fname) => fname.replace(RegExp(`${POST_EXT}$`), ""));

  return slugs.reverse();
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const post = await getMarkdownContent(`${slug}${POST_EXT}`);

  return post;
};

const getMarkdownContent = async (fname: string): Promise<Post> => {
  const rawContent = await fs.readFile(path.join(postsDir, fname), "utf8");
  const { content, data } = matter(rawContent);
  const html = await interpreter(content);
  const commits = await getCommitLogs(fname);

  const post: Post = {
    slug: fname.replace(RegExp(`${POST_EXT}$`), ""),
    title: data.title,
    categories: data.categories || [],
    image: `${CONST.PUBLIC_IMAGE_DIR}/${data.image}` || CONST.DEFAULT_OGP_IMAGE,
    tags: data.tags || [],
    content: html,
    // create excerpt from the beginning of the content
    description: data.description || `${content.slice(0, 100)}...`,
    commits,
    // NOTE `Date` object cannot be serialized in `getStaticProps`
    publishedAt: new Moment(data.date)?.getYMD() || "-",
    updatedAt: "-",
  };

  if (commits[0]?.date) {
    console.log(commits[0]);
    // extract latest edit date from commit history
    post.updatedAt = new Moment(commits[0].date)?.getYMD();

  }

  return post;
};
