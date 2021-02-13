import raw from "rehype-raw";
import html from "rehype-stringify";
import markdown from "remark-parse";
import remarkToRehype from "remark-rehype";
// @ts-ignore
import slug from "remark-slug";
import toc from "remark-toc";
import unified from "unified";

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
