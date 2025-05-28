"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// 在客户端组件内部使用动态导入
const ClientWrapper = dynamic(() => import("./ClientWrapper"), {
  ssr: false,
  loading: () => (
    <div className="text-center py-10">
      <p className="mb-4 text-lg">加载应用中...</p>
      <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function ClientEntry() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-10">
          <p className="mb-4">加载中...</p>
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ClientWrapper />
    </Suspense>
  );
}
