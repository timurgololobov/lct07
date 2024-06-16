"use client";

import Script from "next/script";

import { useEffect, useRef } from "react";

export default function Components() {
  const iframeRef = useRef<HTMLIFrameElement>();
  return (
    <>
      <div className={`content-container open`} id="preview"></div>
      <Script src="gemeni.js" strategy="afterInteractive" type="module" />
      <Script src="script.js" strategy="afterInteractive" type="module" />
    </>
  );
}
