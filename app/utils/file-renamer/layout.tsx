import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '파일명 일괄 변경 | 사무 유틸리티',
  description: '여러 파일의 이름을 패턴에 따라 일괄 변경합니다. 배치 파일 다운로드 지원.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
