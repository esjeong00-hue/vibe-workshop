# vibe-workshop

사내 AI 강의 **"AI 바이브 코딩 마스터클래스"** 신청 페이지입니다.
Next.js (App Router) + TypeScript + Tailwind CSS v4 기반이며, Vercel 배포를 전제로 만들어졌습니다.

## 개발 서버 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 구조

- `src/app/page.tsx` — 헤드라인 · 강의 소개 · 행사 정보 · 푸터 (서버 컴포넌트)
- `src/app/components/RegistrationForm.tsx` — 신청 폼 (클라이언트 컴포넌트)
- `src/app/globals.css` — 색상 토큰 (네이비 배경 / 화이트 텍스트 / 오렌지 `#ff6b35` 포인트)

## 폼 동작 (현재 상태)

- 필수 필드 검증, 회사 이메일 형식 검증, 프론트엔드 기준 중복 이메일 방지
- 제출 시 데이터는 **서버로 전송되지 않고** `console.log`로만 출력됩니다.
- 제출 성공 시 완료 메시지(🎉)를 표시합니다.

## 향후 작업 (Supabase 연동)

`RegistrationForm.tsx`의 `handleSubmit` 안에 있는 `console.log("신청 데이터:", payload)`
지점을 Supabase insert 호출로 교체하면 됩니다. (`// TODO: 추후 Supabase 연결` 주석 참고)

## Vercel 배포

저장소를 Vercel에 연결하면 추가 설정 없이 빌드됩니다. (`npm run build`)
