import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON 포맷터 - JSON 정렬 / 압축 / 검증 무료 도구 | 사무 유틸리티',
  description: 'JSON 데이터를 한 번에 보기 좋게 정렬(Pretty Print)하거나 한 줄로 압축(Minify)합니다. 문법 오류 자동 검증, 들여쓰기 조정, 키 정렬, 브라우저에서 안전하게 처리(서버 업로드 없음).',
  keywords: [
    'JSON 포맷터', 'JSON 정렬', 'JSON 압축', 'JSON minify',
    'JSON 검증', 'JSON validator', 'JSON 들여쓰기', 'JSON pretty',
    'JSON 정리', 'JSON beautifier', 'JSON 변환', '제이슨 포맷',
    '온라인 JSON 도구', '무료 JSON 도구'
  ],
  alternates: { canonical: 'https://bdarchive.site/utils/json-formatter/' },
  openGraph: {
    title: 'JSON 포맷터 - 정렬·압축·검증 무료 도구',
    description: 'JSON Pretty Print, Minify, 문법 검증을 브라우저에서 즉시 처리. 서버 업로드 없음.',
    url: 'https://bdarchive.site/utils/json-formatter/',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
