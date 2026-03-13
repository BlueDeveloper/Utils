import Header from '@/components/layouts/Header';
import Link from 'next/link';

interface UtilityLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function UtilityLayout({ title, description, children }: UtilityLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← 홈으로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        {children}
      </main>
    </div>
  );
}
