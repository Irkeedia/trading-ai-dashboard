"use client";

import dynamic from "next/dynamic";

const TopNav = dynamic(
  () => import("@/components/top-nav").then((m) => m.TopNav),
  { ssr: false }
);

export function TopNavLoader() {
  return <TopNav />;
}
