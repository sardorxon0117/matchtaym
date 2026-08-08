import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

marked.setOptions({ breaks: true, gfm: true });

export function renderMarkdown(source: string): string {
  const rawHtml = marked.parse(source ?? "", { async: false }) as string;
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "a", "blockquote", "ul", "ol", "li",
      "h2", "h3", "h4", "img", "code", "pre", "hr",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel"],
  });
}
