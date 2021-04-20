import CommitLog from "./git";

type Post = {
  slug: string;
  title: string;
  categories: string[];
  tags: string[];
  coverImage?: string;
  ogImage?: string;
  content: string;
  description: string;
  commits: CommitLog[];
  publishedAt: string;
  updatedAt: string;
}

export default Post;
