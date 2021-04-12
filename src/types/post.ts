type Post = {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  coverImage?: string;
  ogImage?: string;
  content: string;
  description: string;
}

export default Post;
