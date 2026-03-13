import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF 페이지 분리 | 사무 유틸리티',
  description: 'PDF 파일에서 원하는 페이지만 추출합니다.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
