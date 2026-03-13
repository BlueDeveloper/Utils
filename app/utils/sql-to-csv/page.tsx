'use client';

import { useState } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';

export default function SqlToCsvConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const parseSqlToCsv = (sql: string): string => {
    const lines = sql.trim().split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      throw new Error('SQL 결과를 입력해주세요');
    }

    // 이미 CSV 형식인지 확인 (쉼표로 구분되어 있고 파이프가 없음)
    const firstLine = lines[0];
    const hasCommas = firstLine.includes(',');
    const hasPipes = firstLine.includes('|');

    // 이미 CSV 형식이면 그대로 반환
    if (hasCommas && !hasPipes) {
      return lines.join('\n');
    }

    // 테이블 형태(파이프로 구분) 처리
    const headers = firstLine
      .split(/\s*\|\s*/)
      .filter(h => h.trim())
      .map(h => h.trim());

    const csvLines = [headers.join(',')];

    // 구분선(---|---) 건너뛰기
    let startIndex = 1;
    if (lines[1] && lines[1].includes('---')) {
      startIndex = 2;
    }

    // 데이터 행 처리
    for (let i = startIndex; i < lines.length; i++) {
      const values = lines[i]
        .split(/\s*\|\s*/)
        .filter(v => v.trim())
        .map(v => v.trim());

      if (values.length > 0) {
        const csvValues = values.map(v => {
          // 쉼표, 줄바꿈, 따옴표가 포함된 경우 따옴표로 감싸기
          if (v.includes(',') || v.includes('\n') || v.includes('"')) {
            return `"${v.replace(/"/g, '""')}"`;
          }
          return v;
        });
        csvLines.push(csvValues.join(','));
      }
    }

    return csvLines.join('\n');
  };

  const handleConvert = () => {
    setError('');

    try {
      if (!input.trim()) {
        setError('SQL 결과를 입력해주세요');
        return;
      }

      const result = parseSqlToCsv(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '변환 중 오류가 발생했습니다');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('복사되었습니다!');
  };

  const handleDownload = () => {
    // UTF-8 BOM 추가 (엑셀 호환성)
    const BOM = '\uFEFF';
    const csvContent = BOM + output;

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <UtilityLayout
      title="SQL → CSV 변환"
      description="SQL SELECT 결과를 CSV로 변환합니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>지원하는 형식:</strong>
          </p>
          <ul className="text-sm text-blue-800 list-disc list-inside mt-2">
            <li>테이블 형태 (파이프 | 로 구분)</li>
            <li>이미 CSV 형식인 경우 (쉼표로 구분)</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SQL 결과 입력
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm"
            placeholder={`테이블 형태:
id | name | age | city
---|------|-----|-------
1  | John | 30  | Seoul

또는 이미 CSV 형식:
id,name,age,city
1,John,30,Seoul`}
          />
          <p className="text-sm text-gray-500 mt-2">
            SQL 쿼리 결과를 그대로 붙여넣으세요
          </p>
        </div>

        <button
          onClick={handleConvert}
          className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 mb-6"
        >
          변환하기
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {output && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              결과 (CSV)
            </label>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50"
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleCopy}
                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              >
                복사
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                다운로드 (엑셀용)
              </button>
            </div>
          </div>
        )}
      </div>
    </UtilityLayout>
  );
}
