import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '텍스트 정리 | 사무 유틸리티',
  description: '줄바꿈 제거, 연속 공백 제거, 앞뒤 공백 제거 등 텍스트를 깔끔하게 정리합니다.',
  alternates: { canonical: 'https://bdarchive.site/utils/text-cleaner/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
