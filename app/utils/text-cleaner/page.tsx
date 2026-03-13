'use client';

import { useState, useRef, useEffect } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';

export default function TextCleaner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 결과가 생성되면 결과 영역으로 스크롤
    if (output && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [output]);

  const removeLineBreaks = () => {
    const result = input.replace(/\n/g, ' ').replace(/\r/g, '');
    setOutput(result);
  };

  const removeExtraSpaces = () => {
    const result = input.replace(/\s+/g, ' ');
    setOutput(result);
  };

  const trimSpaces = () => {
    const result = input.trim();
    setOutput(result);
  };

  const cleanAll = () => {
    let result = input;
    result = result.replace(/\n/g, ' ').replace(/\r/g, '');
    result = result.replace(/\s+/g, ' ');
    result = result.trim();
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('복사되었습니다!');
  };

  return (
    <UtilityLayout
      title="텍스트 정리"
      description="줄바꿈 제거 및 공백을 정리합니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* 입력 영역 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              텍스트 입력
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-96 p-3 border border-gray-300 rounded font-mono text-sm"
              placeholder="정리할 텍스트를 입력하세요"
            />
          </div>

          {/* 결과 영역 */}
          <div ref={outputRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              결과
            </label>
            <textarea
              value={output}
              readOnly
              className="w-full h-96 p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50"
              placeholder="변환 결과가 여기에 표시됩니다"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <button
              onClick={removeLineBreaks}
              disabled={!input}
              className={`py-3 rounded font-medium ${
                input
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              줄바꿈 제거
            </button>
            <button
              onClick={removeExtraSpaces}
              disabled={!input}
              className={`py-3 rounded font-medium ${
                input
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              연속 공백 제거
            </button>
            <button
              onClick={trimSpaces}
              disabled={!input}
              className={`py-3 rounded font-medium ${
                input
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              앞뒤 공백 제거
            </button>
            <button
              onClick={cleanAll}
              disabled={!input}
              className={`py-3 rounded font-medium ${
                input
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              모두 정리
            </button>
          </div>

          {output && (
            <button
              onClick={handleCopy}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              결과 복사
            </button>
          )}
        </div>
      </div>
    </UtilityLayout>
  );
}
