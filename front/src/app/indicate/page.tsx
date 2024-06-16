import { Suspense } from "react";
import dynamic from "next/dynamic";

const DynamicModelWithNoSSR = dynamic(() => import("./Components"), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      >
        Текст
      </div>
      <DynamicModelWithNoSSR />
    </Suspense>
  );
}
