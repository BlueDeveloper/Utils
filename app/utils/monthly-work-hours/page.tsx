'use client';

import { useState } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';
import { isWorkday } from '@/lib/constants/holidays';

export default function MonthlyWorkHours() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [dailyHours, setDailyHours] = useState('8');
  const [result, setResult] = useState<{
    workdays: number;
    totalHours: number;
    standardHours: number;
    weeklyHours: number;
  } | null>(null);

  const calculateWorkHours = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const hours = parseFloat(dailyHours);

    if (!y || !m || !hours) return;

    // 해당 월의 근무일 수 계산
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0);

    let workdays = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      if (isWorkday(current)) {
        workdays++;
      }
      current.setDate(current.getDate() + 1);
    }

    const totalHours = workdays * hours;
    const standardHours = 209; // 한국 법정 월 근로시간 (주 40시간 * 52주 / 12개월)
    const weeklyHours = (totalHours * 12) / 52;

    setResult({
      workdays,
      totalHours,
      standardHours,
      weeklyHours
    });
  };

  return (
    <UtilityLayout
      title="월별 근무시간 계산기"
      description="월별 총 근무시간을 계산합니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              년도
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              min="2024"
              max="2030"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              일일 근무시간
            </label>
            <input
              type="number"
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              step="0.5"
              min="1"
              max="24"
            />
          </div>
        </div>

        <button
          onClick={calculateWorkHours}
          className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 mb-6"
        >
          계산하기
        </button>

        {result && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded">
              <div className="text-sm text-gray-600 mb-1">근무일수</div>
              <div className="text-3xl font-bold text-blue-700">
                {result.workdays}일
              </div>
            </div>
            <div className="p-6 bg-green-50 border border-green-200 rounded">
              <div className="text-sm text-gray-600 mb-1">총 근무시간</div>
              <div className="text-3xl font-bold text-green-700">
                {result.totalHours}시간
              </div>
            </div>
            <div className="p-6 bg-purple-50 border border-purple-200 rounded">
              <div className="text-sm text-gray-600 mb-1">법정 월 근로시간</div>
              <div className="text-3xl font-bold text-purple-700">
                {result.standardHours}시간
              </div>
              <div className="text-xs text-gray-500 mt-1">
                주 40시간 기준
              </div>
            </div>
            <div className="p-6 bg-orange-50 border border-orange-200 rounded">
              <div className="text-sm text-gray-600 mb-1">주당 평균 근무시간</div>
              <div className="text-3xl font-bold text-orange-700">
                {result.weeklyHours.toFixed(1)}시간
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {result.weeklyHours > 52 ? '주 52시간 초과' : '주 52시간 이하'}
              </div>
            </div>
          </div>
        )}
      </div>
    </UtilityLayout>
  );
}
