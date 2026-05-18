import type { Metadata } from 'next';
import Header from '@/components/layouts/Header';
import UtilityCard from '@/components/ui/UtilityCard';
import { utilities, getCategoryName } from '@/lib/constants/utilities';

export const metadata: Metadata = {
  title: '사무 유틸리티 - 업무에 필요한 모든 도구',
  description: '문서 변환, 날짜 계산, 파일 처리 등 사무 업무에 필요한 다양한 유틸리티를 제공합니다',
  alternates: { canonical: 'https://bdarchive.site/utils/' },
};

export default function Home() {
  const categories = ['document', 'date', 'file'] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            사무 업무를 위한 유틸리티
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            문서 변환, 날짜 계산, 파일 처리 등 업무에 필요한 다양한 도구를 무료로 사용하세요
          </p>
        </div>

        {categories.map((category) => {
          const categoryUtils = utilities.filter(u => u.category === category);

          return (
            <section key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {getCategoryName(category)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryUtils.map((utility) => (
                  <UtilityCard
                    key={utility.id}
                    title={utility.title}
                    description={utility.description}
                    href={utility.href}
                    icon={utility.icon}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>모든 처리는 브라우저에서 안전하게 수행됩니다. 파일이 서버에 저장되지 않습니다.</p>
        </div>
      </footer>
    </div>
  );
}
