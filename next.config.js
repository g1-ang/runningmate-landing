const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next 16 가 상위 디렉터리의 다른 package-lock.json 을 workspace root 로
  // 잘못 잡아서 react/jsx-runtime 해석이 깨지는 문제 회피.
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingRoot: path.resolve(__dirname),
};

module.exports = nextConfig;
