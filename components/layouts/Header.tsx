import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            사무 유틸리티
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/utils/csv-json" className="text-gray-600 hover:text-gray-900">
              문서변환
            </Link>
            <Link href="/utils/workday-calculator" className="text-gray-600 hover:text-gray-900">
              날짜계산
            </Link>
            <Link href="/utils/image-converter" className="text-gray-600 hover:text-gray-900">
              파일처리
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
