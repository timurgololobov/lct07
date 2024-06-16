import styles from "@/app/page.module.css";
import "./style.css";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const DynamicModelWithNoSSR = dynamic(() => import("./Components"), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DynamicModelWithNoSSR />
    </Suspense>
  );
}
