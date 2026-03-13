# archive-utils

개발자 유틸리티 모음 웹앱

## 기술 스택

- Next.js 16 (App Router, Static Export)
- React 19
- TypeScript 5
- papaparse (CSV 처리)
- pdf-lib (PDF 처리)

## 로컬 개발

```bash
npm install
npm run dev     # http://localhost:3001
npm run build   # out/ 디렉토리로 정적 빌드
```

## 배포

main 브랜치 push 시 Cloudflare Pages 자동 배포.

| 항목 | 값 |
|------|-----|
| 빌드 명령어 | npm install --legacy-peer-deps && npm run build |
| 출력 디렉토리 | out |
| 도메인 | archive-utils.pages.dev |

## 제공 도구

- CSV ↔ JSON 변환
- D-Day 계산기
- 파일 이름 변경기
- 이미지 변환기
- JSON 포매터
- 근무시간 계산기
- PDF 병합/분할
