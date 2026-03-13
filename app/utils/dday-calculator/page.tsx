'use client';

import { useState } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';

export default function DdayCalculator() {
  const [targetDate, setTargetDate] = useState('');
  const [result, setResult] = useState<{
    days: number;
    isPast: boolean;
  } | null>(null);

  const calculateDday = () => {
    if (!targetDate) return;

    const target = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setResult({
      days: Math.abs(diffDays),
      isPast: diffDays < 0
    });
  };

  return (
    <UtilityLayout
      title="D-Day 계산기"
      description="특정 날짜까지 남은 일수를 계산합니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            목표 날짜
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={calculateDday}
          className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 mb-6"
        >
          계산하기
        </button>

        {result && (
          <div className="text-center p-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            {result.isPast ? (
              <>
                <div className="text-6xl font-bold text-gray-400 mb-4">
                  D+{result.days}
                </div>
                <div className="text-lg text-gray-600">
                  목표일이 {result.days}일 전에 지났습니다
                </div>
              </>
            ) : result.days === 0 ? (
              <>
                <div className="text-6xl font-bold text-green-600 mb-4">
                  D-Day
                </div>
                <div className="text-lg text-gray-600">
                  오늘이 바로 그날입니다!
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl font-bold text-blue-600 mb-4">
                  D-{result.days}
                </div>
                <div className="text-lg text-gray-600">
                  목표일까지 {result.days}일 남았습니다
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </UtilityLayout>
  );
}
