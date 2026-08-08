import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ breaks: true, gfm: true });

// Pure-JS sanitizer (no jsdom) — isomorphic-dompurify pulls in jsdom, which
// doesn't run reliably in Vercel's serverless functions and was crashing
// every article page with a 500.
export function renderMarkdown(source: string): string {
  const rawHtml = marked.parse(source ?? "", { async: false }) as string;
  return sanitizeHtml(rawHtml, {
    allowedTags: [
      "p", "br", "strong", "em", "a", "blockquote", "ul", "ol", "li",
      "h2", "h3", "h4", "img", "code", "pre", "hr",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
