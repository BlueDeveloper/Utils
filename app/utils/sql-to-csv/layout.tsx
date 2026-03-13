import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SQL → CSV 변환 | 사무 유틸리티',
  description: 'SQL SELECT 결과를 CSV 형식으로 변환합니다. 테이블 형태의 데이터 지원.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
