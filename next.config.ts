import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 온보딩에서 전신·옷 사진 2장을 서버액션 body로 전송한다.
    // 기본 1MB로는 폰 원본 사진을 못 받아 저장이 통째로 실패하므로 상향한다.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "afvwsxvqwxoblmvtqupk.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default nextConfig;
