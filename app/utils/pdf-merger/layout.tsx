import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF 합치기 | 사무 유틸리티',
  description: '여러 PDF 파일을 하나로 합칩니다. 순서 조정 가능.',
  alternates: { canonical: 'https://bdarchive.site/utils/pdf-merger/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
