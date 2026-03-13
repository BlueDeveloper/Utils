'use client';

import { useState } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';
import { isWorkday } from '@/lib/constants/holidays';

export default function WorkdayCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<{
    totalDays: number;
    workdays: number;
    weekends: number;
    holidays: number;
  } | null>(null);
  const [error, setError] = useState('');

  const calculateWorkdays = () => {
    setError('');
    setResult(null);

    if (!startDate || !endDate) {
      setError('시작일과 종료일을 모두 입력해주세요');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setError('시작일이 종료일보다 늦을 수 없습니다');
      return;
    }

    let workdays = 0;
    let weekends = 0;
    let holidays = 0;

    const current = new Date(start);
    while (current <= end) {
      if (isWorkday(current)) {
        workdays++;
      } else {
        const day = current.getDay();
        if (day === 0 || day === 6) {
          weekends++;
        } else {
          holidays++;
        }
      }
      current.setDate(current.getDate() + 1);
    }

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    setResult({
      totalDays,
      workdays,
      weekends,
      holidays
    });
  };

  const calculateYearWorkdays = (year: number) => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    let workdays = 0;
    let weekends = 0;
    let holidays = 0;

    const current = new Date(start);
    while (current <= end) {
      if (isWorkday(current)) {
        workdays++;
      } else {
        const day = current.getDay();
        if (day === 0 || day === 6) {
          weekends++;
        } else {
          holidays++;
        }
      }
      current.setDate(current.getDate() + 1);
    }

    const totalDays = 365 + (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 1 : 0);

    setStartDate('');
    setEndDate('');
    setError('');
    setResult({
      totalDays,
      workdays,
      weekends,
      holidays
    });
  };

  return (
    <UtilityLayout
      title="근무일 계산기"
      description="주말과 공휴일을 제외한 근무일을 계산합니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* 년도별 빠른 조회 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">년도별 근무일 조회</h3>
          <div className="flex flex-wrap gap-3">
            {[2024, 2025, 2026, 2027].map(year => (
              <button
                key={year}
                onClick={() => calculateYearWorkdays(year)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {year}년
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 text-center text-gray-500">
          또는 직접 기간을 입력하세요
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작일
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료일
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
        </div>

        <button
          onClick={calculateWorkdays}
          className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 mb-6"
        >
          계산하기
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded">
              <div className="text-sm text-gray-600 mb-1">총 일수</div>
              <div className="text-3xl font-bold text-gray-900">{result.totalDays}일</div>
            </div>
            <div className="p-6 bg-green-50 border border-green-200 rounded">
              <div className="text-sm text-gray-600 mb-1">근무일</div>
              <div className="text-3xl font-bold text-green-700">{result.workdays}일</div>
            </div>
            <div className="p-6 bg-purple-50 border border-purple-200 rounded">
              <div className="text-sm text-gray-600 mb-1">주말</div>
              <div className="text-3xl font-bold text-purple-700">{result.weekends}일</div>
            </div>
            <div className="p-6 bg-orange-50 border border-orange-200 rounded">
              <div className="text-sm text-gray-600 mb-1">공휴일</div>
              <div className="text-3xl font-bold text-orange-700">{result.holidays}일</div>
            </div>
          </div>
        )}
      </div>
    </UtilityLayout>
  );
}
