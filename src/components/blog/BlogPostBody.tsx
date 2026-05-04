import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sanitizeBlogHtml } from "@/lib/htmlSanitizer";

export type BlogContent = {
  format?: "markdown" | "html";
  markdown?: string;
  html?: string;
};

type Props = {
  content: BlogContent | null | undefined;
};

export default function BlogPostBody({ content }: Props) {
  const format = content?.format ?? "markdown";
  const markdown = content?.markdown?.trim() ?? "";
  const html = content?.html?.trim() ?? "";

  if (format === "html" ? !html : !markdown) {
    return (
      <p className="text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>
        אין תוכן לפוסט זה.
      </p>
    );
  }

  if (format === "html") {
    // Saved posts are sanitized at API save time. Re-sanitize here so the
    // editor preview (which renders unsaved input) is also safe.
    const safe = sanitizeBlogHtml(html);
    return (
      <div
        className="blog-content blog-html-content"
        dir="rtl"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }

  return (
    <div className="blog-content" dir="rtl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h2
              className="font-bold mt-10 mb-4"
              style={{
                color: "#1d1d1f",
                fontSize: "clamp(1.4rem, 3vw, 1.75rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.224px",
              }}
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="font-bold mt-10 mb-4"
              style={{
                color: "#1d1d1f",
                fontSize: "clamp(1.3rem, 2.5vw, 1.5rem)",
                lineHeight: 1.3,
                letterSpacing: "-0.224px",
              }}
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="font-semibold mt-8 mb-3"
              style={{
                color: "#1d1d1f",
                fontSize: "1.15rem",
                lineHeight: 1.35,
              }}
              {...props}
            />
          ),
          p: (props) => (
            <p
              className="mb-5"
              style={{
                color: "rgba(0,0,0,0.78)",
                fontSize: "1rem",
                lineHeight: 1.8,
                letterSpacing: "-0.12px",
              }}
              {...props}
            />
          ),
          a: ({ href, children, ...rest }) => {
            const url = href ?? "#";
            const isExternal = /^https?:\/\//.test(url) && !url.startsWith("https://ad-phones.co.il");
            if (isExternal) {
              return (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                  style={{ color: "#0071e3" }}
                  {...rest}
                >
                  {children}
                </a>
              );
            }
            return (
              <Link
                href={url}
                className="underline hover:no-underline"
                style={{ color: "#0071e3" }}
                {...rest}
              >
                {children}
              </Link>
            );
          },
          ul: (props) => (
            <ul
              className="mb-5 pr-6 space-y-1.5 list-disc marker:text-slate-400"
              style={{ color: "rgba(0,0,0,0.78)", fontSize: "1rem", lineHeight: 1.8 }}
              {...props}
            />
          ),
          ol: (props) => (
            <ol
              className="mb-5 pr-6 space-y-1.5 list-decimal marker:text-slate-400"
              style={{ color: "rgba(0,0,0,0.78)", fontSize: "1rem", lineHeight: 1.8 }}
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="my-6 pr-4 italic"
              style={{
                borderRight: "3px solid #0071e3",
                color: "rgba(0,0,0,0.7)",
                fontSize: "1.05rem",
                lineHeight: 1.7,
              }}
              {...props}
            />
          ),
          code: ({ className, children, ...rest }) => {
            const isBlock = /language-/.test(className ?? "");
            if (isBlock) {
              return (
                <code
                  className={className}
                  style={{
                    display: "block",
                    background: "#f5f5f7",
                    padding: "16px",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    direction: "ltr",
                    overflow: "auto",
                  }}
                  {...rest}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                style={{
                  background: "#f5f5f7",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.875em",
                  direction: "ltr",
                  display: "inline-block",
                }}
                {...rest}
              >
                {children}
              </code>
            );
          },
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            return (
              <span className="block my-8 -mx-2 md:-mx-6">
                <span
                  className="relative block rounded-[12px] overflow-hidden bg-[#f5f5f7] flex items-center justify-center"
                  style={{ minHeight: 240 }}
                >
                  <Image
                    src={src}
                    alt={alt ?? ""}
                    width={800}
                    height={500}
                    className="w-full h-auto object-contain"
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </span>
                {alt && (
                  <span
                    className="block text-center mt-2 text-xs"
                    style={{ color: "rgba(0,0,0,0.6)" }}
                  >
                    {alt}
                  </span>
                )}
              </span>
            );
          },
          hr: () => (
            <hr
              className="my-10"
              style={{
                border: "none",
                borderTop: "1px solid rgba(0,0,0,0.08)",
              }}
            />
          ),
          strong: (props) => (
            <strong style={{ color: "#1d1d1f", fontWeight: 600 }} {...props} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
