'use client';

import { useState } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handlePrettify = () => {
    setError('');

    try {
      if (!input.trim()) {
        setError('JSON을 입력해주세요');
        return;
      }

      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
    } catch (err) {
      setError('올바른 JSON 형식이 아닙니다');
    }
  };

  const handleMinify = () => {
    setError('');

    try {
      if (!input.trim()) {
        setError('JSON을 입력해주세요');
        return;
      }

      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (err) {
      setError('올바른 JSON 형식이 아닙니다');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('복사되었습니다!');
  };

  return (
    <UtilityLayout
      title="JSON 포맷터"
      description="JSON을 읽기 쉽게 정리하거나 압축합니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            JSON 입력
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm"
            placeholder='{"name":"John","age":30,"city":"Seoul"}'
          />
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handlePrettify}
            className="flex-1 bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700"
          >
            정리하기 (Pretty)
          </button>
          <button
            onClick={handleMinify}
            className="flex-1 bg-purple-600 text-white py-3 rounded font-medium hover:bg-purple-700"
          >
            압축하기 (Minify)
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {output && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              결과
            </label>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50"
            />
            <button
              onClick={handleCopy}
              className="w-full mt-4 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              복사
            </button>
          </div>
        )}
      </div>
    </UtilityLayout>
  );
}
