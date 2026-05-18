import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D-Day 계산기 | 사무 유틸리티',
  description: '특정 날짜까지 남은 일수를 계산합니다. 중요한 날짜를 놓치지 마세요.',
  alternates: { canonical: 'https://bdarchive.site/utils/dday-calculator/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
