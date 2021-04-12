import { GetServerSidePropsContext } from "next";
import generateRssXml from "../lib/rss";


// thanks to https://zenn.dev/catnose99/articles/c7754ba6e4adac
export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
  const xml = await generateRssXml();

  res.statusCode = 200;

  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate"); // 24時間キャッシュする
  res.setHeader("Content-Type", "text/xml");
  res.end(xml);

  return {
    props: {},
  };
};


const Page = (): null => null;

export default Page;
