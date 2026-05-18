import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '근무일 계산기 | 사무 유틸리티',
  description: '주말과 한국 공휴일을 제외한 실제 근무일을 계산합니다.',
  alternates: { canonical: 'https://bdarchive.site/utils/workday-calculator/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
