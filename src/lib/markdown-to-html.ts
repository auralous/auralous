import unified from "unified";
import remarkToRehype from "remark-rehype";
import raw from "rehype-raw";
import markdown from "remark-parse";
import html from "rehype-stringify";
import toc from "remark-toc";
// @ts-ignore
import slug from "remark-slug";

export default function markdownToHtml(md: string) {
  const processor = unified()
    .use(markdown)
    .use(toc, { tight: true })
    .use(slug)
    .use(remarkToRehype, { allowDangerousHtml: true })
    // Add custom HTML found in the markdown file to the AST
    .use(raw)
    .use(html);
  return processor.process(md);
}
