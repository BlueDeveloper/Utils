import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이미지 변환 | 사무 유틸리티',
  description: '이미지 크기 조정 및 포맷 변환 (PNG, WebP, JPEG). 브라우저에서 안전하게 처리.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
