import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

import type { Post } from "../types";
import { markdownToHtml } from "./interpreter";
import getCommitLogs from "./commit-log";
import Moment from "./moment";

import * as CONST from "./const";

export const getPosts = async (): Promise<Post[]> => {
  const files = await fs.readdir(CONST.POSTS_DIR);
  const posts = await Promise.all(
    files.map(async (file) => await getMarkdownContent(file)),
  );

  // order by latest
  return posts.reverse();
};

export const getSlugs = async (): Promise<string[]> => {
  const files = await fs.readdir(CONST.POSTS_DIR);
  const slugs = files.map((fname) =>
    fname.replace(RegExp(`${CONST.POST_EXT}$`), ""),
  );

  return slugs.reverse();
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const post = await getMarkdownContent(`${slug}${CONST.POST_EXT}`);

  return post;
};

const getMarkdownContent = async (fname: string): Promise<Post> => {
  const rawContent = await fs.readFile(
    path.join(CONST.POSTS_DIR, fname),
    "utf8",
  );
  const { content, data } = matter(rawContent);
  const html = await markdownToHtml(content);
  const commits = await getCommitLogs(fname);

  const post: Post = {
    slug: fname.replace(RegExp(`${CONST.POST_EXT}$`), ""),
    title: data.title,
    categories: data.categories || [],
    image: data.image
      ? `${CONST.PUBLIC_IMAGE_DIR}/${data.image}`
      : CONST.DEFAULT_OGP_IMAGE,
    tags: data.tags || [],
    content: html,
    // create excerpt from the beginning of the content
    description: data.description || `${content.slice(0, 100)}...`,
    commits,
    // NOTE `Date` object cannot be serialized in `getStaticProps`
    publishedAt: new Moment(data.date)?.getYMD() || "-",
    updatedAt: "-",
  };

  if (commits.length > 0) {
    // extract latest edit date from commit history
    post.updatedAt = new Moment(commits[0].date)?.getYMD();
  }

  return post;
};
