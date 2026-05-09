import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 러닝메이트 ivory + 라임/딥그린 팔레트 (iOS Theme.swift 와 일치)
        ivory: "#F9F8F3",
        cream: "#F1EFE7",
        deepGreen: "#1F4F2A",
        neon: "#B7E04C",
        neonDim: "#9CC53A",
        textPrimary: "#1A1F18",
        textSecondary: "#475240",
        textMuted: "#8A8F84",
        border: "#E2DFD3",
        surface: "#FFFFFF",
        surfaceMuted: "#F4F2EA",
        // 파스텔 (마이룸 카드들과 동일)
        pastelLime: "#D6EFB1",
        pastelSky: "#C4E4F0",
        pastelPink: "#F7C9D6",
        pastelLilac: "#E0CFF0",
        pastelSand: "#F0DDB7",
      },
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
        pixel: ["Galmuri11", "DungGeunMo", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
