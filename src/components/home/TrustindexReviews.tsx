"use client";

import { useEffect, useRef } from "react";

const TRUSTINDEX_SRC =
  "https://cdn.trustindex.io/loader.js?a7c350e70b2d37117c262f1e46c";

export default function TrustindexReviews() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = TRUSTINDEX_SRC;
    script.async = true;
    script.defer = true;
    el.appendChild(script);
  }, []);

  return <div ref={ref} className="min-h-[200px]" />;
}
