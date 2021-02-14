type Post = {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  coverImage?: string;
  ogImage?: string;
  content: string;
}

export default Post;
