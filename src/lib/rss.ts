import RSS from "rss";

import { getPosts } from "./api";

const generateRssXml = async (): Promise<string> => {
  const feed = new RSS({
    title: "/var/log/koka",
    description: "my log",
    site_url: "https://koka831.github.io/",
    feed_url: "https://koka831.github.io/feed/",
    language: "ja",
  });

  // 例としてpostsを含めるイメージ
  // このあたりの書き方はライブラリのドキュメントを参考にしてください
  const posts = await getPosts();
  posts?.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      date: new Date(post.date),
      url: `https://koka831.github.io/archives/${post.slug}`,
    });
  });

  return feed.xml();
};

export default generateRssXml;
