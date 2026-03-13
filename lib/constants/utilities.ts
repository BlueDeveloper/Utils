export interface Utility {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  category: 'document' | 'date' | 'file';
}

export const utilities: Utility[] = [
  // 문서/텍스트 변환
  {
    id: 'csv-json',
    title: 'CSV ↔ JSON 변환',
    description: 'CSV 파일과 JSON 형식을 서로 변환합니다',
    href: '/utils/csv-json',
    icon: '📊',
    category: 'document'
  },
  {
    id: 'json-formatter',
    title: 'JSON 포맷터',
    description: 'JSON을 읽기 쉽게 정리하거나 압축합니다',
    href: '/utils/json-formatter',
    icon: '📝',
    category: 'document'
  },
  {
    id: 'sql-to-csv',
    title: 'SQL → CSV 변환',
    description: 'SQL SELECT 결과를 CSV로 변환합니다',
    href: '/utils/sql-to-csv',
    icon: '🗄️',
    category: 'document'
  },
  {
    id: 'text-cleaner',
    title: '텍스트 정리',
    description: '줄바꿈 제거 및 공백을 정리합니다',
    href: '/utils/text-cleaner',
    icon: '🧹',
    category: 'document'
  },

  // 날짜/근무 계산
  {
    id: 'workday-calculator',
    title: '근무일 계산기',
    description: '주말과 공휴일을 제외한 근무일을 계산합니다',
    href: '/utils/workday-calculator',
    icon: '📅',
    category: 'date'
  },
  {
    id: 'dday-calculator',
    title: 'D-Day 계산기',
    description: '특정 날짜까지 남은 일수를 계산합니다',
    href: '/utils/dday-calculator',
    icon: '⏰',
    category: 'date'
  },
  {
    id: 'monthly-work-hours',
    title: '월별 근무시간',
    description: '월별 총 근무시간을 계산합니다',
    href: '/utils/monthly-work-hours',
    icon: '⏱️',
    category: 'date'
  },

  // 파일/이미지 처리
  {
    id: 'image-converter',
    title: '이미지 변환',
    description: '이미지 크기 조정 및 포맷을 변환합니다',
    href: '/utils/image-converter',
    icon: '🖼️',
    category: 'file'
  },
  {
    id: 'pdf-splitter',
    title: 'PDF 페이지 분리',
    description: 'PDF 파일에서 원하는 페이지를 추출합니다',
    href: '/utils/pdf-splitter',
    icon: '📄',
    category: 'file'
  },
  {
    id: 'pdf-merger',
    title: 'PDF 합치기',
    description: '여러 PDF 파일을 하나로 합칩니다',
    href: '/utils/pdf-merger',
    icon: '📑',
    category: 'file'
  },
  {
    id: 'file-renamer',
    title: '파일명 일괄 변경',
    description: '여러 파일의 이름을 패턴에 따라 변경합니다',
    href: '/utils/file-renamer',
    icon: '📁',
    category: 'file'
  }
];

export const getCategoryName = (category: Utility['category']) => {
  const categoryNames = {
    document: '문서/텍스트 변환',
    date: '날짜/근무 계산',
    file: '파일/이미지 처리'
  };
  return categoryNames[category];
};
