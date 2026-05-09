# RunningMate Landing

[러닝메이트 iOS 앱](https://github.com/g1-ang/RunningMate) 의 마케팅 랜딩 페이지.

## 로컬 실행

```bash
npm install
npm run dev
# http://localhost:3000
```

## Vercel 배포

```bash
npx vercel        # 프리뷰 배포 (테스트용)
npx vercel --prod # 프로덕션 배포
```

또는 GitHub 레포에 push 후 Vercel 대시보드에서 import.

## 구조

- `app/page.tsx` — 단일 랜딩 페이지 (Hero + Features + Screenshots + Privacy + FAQ + Footer)
- `app/globals.css` — Tailwind + Pretendard + Galmuri11 픽셀 한글 폰트
- `tailwind.config.ts` — iOS 앱 Theme.swift 와 동일한 ivory + 라임 + 딥그린 팔레트
- `public/screenshots/` — iPhone 16 Pro Max 시뮬레이터 캡처 7장 (UITest 자동화로 생성됨)

## 디자인 일관성

iOS 앱과 동일한 컬러 팔레트 + Galmuri11 픽셀 폰트로 마이룸 비주얼 정체성 유지. 신규 화면 추가 시:
- 본문은 Pretendard
- 제목·강조는 Galmuri11 (font-pixel)
- 색상은 tailwind config 의 deepGreen / neon / pastel 시리즈 우선
