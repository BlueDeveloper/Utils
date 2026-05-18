import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON 포맷터 | 사무 유틸리티',
  description: 'JSON을 읽기 쉽게 정리하거나 압축합니다. Pretty Print 및 Minify 기능 제공.',
  alternates: { canonical: 'https://bdarchive.site/utils/json-formatter/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
