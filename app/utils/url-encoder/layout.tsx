import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL 인코더 / 디코더 - 한글 URL 변환 무료 도구 | 사무 유틸리티',
  description: 'URL을 percent-encoding(%EA%B0%80 형식)으로 인코딩하거나 다시 사람이 읽을 수 있는 형태로 디코딩합니다. 한글·특수문자·쿼리 파라미터 안전 처리. 브라우저에서 즉시 변환, 서버 업로드 없음.',
  keywords: [
    'URL 인코더', 'URL 디코더', 'URL 인코딩', 'URL 디코딩',
    '한글 URL 변환', '퍼센트 인코딩', 'percent encoding', 'URI encoder',
    'URL 변환', '주소 변환', '특수문자 URL', '쿼리스트링 인코딩',
    'encodeURIComponent', 'decodeURIComponent', '온라인 URL 도구',
  ],
  alternates: { canonical: 'https://bdarchive.site/utils/url-encoder/' },
  openGraph: {
    title: 'URL 인코더 / 디코더 - 한글 URL 변환 무료 도구',
    description: 'URL percent-encoding 변환. 한글·특수문자·쿼리 안전 처리. 서버 업로드 없음.',
    url: 'https://bdarchive.site/utils/url-encoder/',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
