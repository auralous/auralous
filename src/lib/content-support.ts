import { join } from "path";
import { readdirSync, readFileSync } from "fs";
import remark from "remark";
import matter from "gray-matter";
import { SupportArticle } from "../types";

const pageDir = join(process.cwd(), "src", "content", "support");

const getAllPageSlugs = () => {
  return readdirSync(pageDir).filter((dir) => !dir.startsWith("_"));
};

export const getPage = (slug: string): SupportArticle => {
  const pagePath = join(pageDir, slug);
  const source = readFileSync(join(pagePath, "index.md"), "utf8");
  const { data, content } = matter(source);
  return {
    title: data.title,
    subtitle: data.subtitle,
    slug,
    content: remark().processSync(content).toString(),
  };
};

export const getPages = (): SupportArticle[] => {
  return getAllPageSlugs().map((slug) => getPage(slug));
};
