import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '월별 근무시간 계산기 | 사무 유틸리티',
  description: '월별 총 근무시간을 계산하고 주 52시간 제도와 비교합니다.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
