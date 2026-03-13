// 한국 공휴일 데이터 (2024-2026년)
// 음력 공휴일은 간소화를 위해 주요 연도만 포함

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

export const holidays: Holiday[] = [
  // 2024년
  { date: '2024-01-01', name: '신정' },
  { date: '2024-02-09', name: '설날 연휴' },
  { date: '2024-02-10', name: '설날' },
  { date: '2024-02-11', name: '설날 연휴' },
  { date: '2024-02-12', name: '대체공휴일' },
  { date: '2024-03-01', name: '3.1절' },
  { date: '2024-04-10', name: '제22대 국회의원 선거일' },
  { date: '2024-05-05', name: '어린이날' },
  { date: '2024-05-06', name: '대체공휴일' },
  { date: '2024-05-15', name: '부처님오신날' },
  { date: '2024-06-06', name: '현충일' },
  { date: '2024-08-15', name: '광복절' },
  { date: '2024-09-16', name: '추석 연휴' },
  { date: '2024-09-17', name: '추석' },
  { date: '2024-09-18', name: '추석 연휴' },
  { date: '2024-10-03', name: '개천절' },
  { date: '2024-10-09', name: '한글날' },
  { date: '2024-12-25', name: '크리스마스' },

  // 2025년
  { date: '2025-01-01', name: '신정' },
  { date: '2025-01-28', name: '설날 연휴' },
  { date: '2025-01-29', name: '설날' },
  { date: '2025-01-30', name: '설날 연휴' },
  { date: '2025-03-01', name: '3.1절' },
  { date: '2025-03-03', name: '대체공휴일' },
  { date: '2025-05-05', name: '어린이날' },
  { date: '2025-05-06', name: '부처님오신날' },
  { date: '2025-06-06', name: '현충일' },
  { date: '2025-08-15', name: '광복절' },
  { date: '2025-10-05', name: '추석 연휴' },
  { date: '2025-10-06', name: '추석' },
  { date: '2025-10-07', name: '추석 연휴' },
  { date: '2025-10-08', name: '대체공휴일' },
  { date: '2025-10-03', name: '개천절' },
  { date: '2025-10-09', name: '한글날' },
  { date: '2025-12-25', name: '크리스마스' },

  // 2026년
  { date: '2026-01-01', name: '신정' },
  { date: '2026-02-16', name: '설날 연휴' },
  { date: '2026-02-17', name: '설날' },
  { date: '2026-02-18', name: '설날 연휴' },
  { date: '2026-03-01', name: '3.1절' },
  { date: '2026-05-05', name: '어린이날' },
  { date: '2026-05-25', name: '부처님오신날' },
  { date: '2026-06-06', name: '현충일' },
  { date: '2026-08-15', name: '광복절' },
  { date: '2026-09-24', name: '추석 연휴' },
  { date: '2026-09-25', name: '추석' },
  { date: '2026-09-26', name: '추석 연휴' },
  { date: '2026-10-03', name: '개천절' },
  { date: '2026-10-05', name: '대체공휴일' },
  { date: '2026-10-09', name: '한글날' },
  { date: '2026-12-25', name: '크리스마스' },
];

export const isHoliday = (date: Date): boolean => {
  const dateStr = date.toISOString().split('T')[0];
  return holidays.some(h => h.date === dateStr);
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 일요일(0) 또는 토요일(6)
};

export const isWorkday = (date: Date): boolean => {
  return !isWeekend(date) && !isHoliday(date);
};
