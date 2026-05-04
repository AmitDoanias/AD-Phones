"use client";

import Script from "next/script";

const ELFSIGHT_APP_ID = "9dafafb2-e13f-49c3-9ece-196fe4e38e70";

export default function ElfsightReviews() {
  return (
    <>
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="afterInteractive"
      />
      <div
        className={`elfsight-app-${ELFSIGHT_APP_ID} min-h-[400px]`}
      />
    </>
  );
}
