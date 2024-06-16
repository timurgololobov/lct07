"use client";

import Script from "next/script";

import { useEffect, useRef } from "react";

export default function Components() {
  const iframeRef = useRef<HTMLIFrameElement>();
  return (
    <>
      <div className={`content-container open`} id="preview">
        <div id="app">
          <div id="myCanvas" className="container"></div>
        </div>
        <div
          style={{
            position: "absolute",
            top: "10px",
            opacity: "0.6",
            width: "100%",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div
            className="upload-btn"
            id="uploadBtn"
            style={{ pointerEvents: "auto" }}
          >
            <button id="uploadModelFile" type="button">
              Click to upload dxf/pdf file(s)
            </button>
            <label
              htmlFor="uploadModelFile"
              title="Choose one or more dxf/pdf files to load"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="17"
                viewBox="0 0 20 17"
              >
                <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
              </svg>
              <span>Upload dxf/pdf</span>
            </label>
          </div>
          <div
            style={{
              marginTop: "1em",
              pointerEvents: "auto",
              width: "fit-content",
              left: "calc(50% - 200px)",
              position: "absolute",
            }}
          >
            <input
              id="fileUrlInput"
              style={{ display: "inline-block", width: "20em", height: "2em" }}
            />
            <button
              style={{
                width: "8em",
                height: "2em",
                color: "#fff",
                opacity: 1,
                background: "#000",
                cursor: "pointer",
              }}
              id="loadDxf"
            >
              Load dxf/pdf
            </button>
          </div>
        </div>
      </div>
      <Script src="gemeni.js" strategy="afterInteractive" type="module" />
      <Script src="one.js" strategy="afterInteractive" type="module" />
    </>
  );
}
