import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSV ↔ JSON 변환 | 사무 유틸리티',
  description: 'CSV 파일과 JSON 형식을 무료로 서로 변환합니다. 파일 업로드 및 텍스트 입력 지원.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
