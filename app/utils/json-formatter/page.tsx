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

      <section className="mt-8 bg-white rounded-lg shadow-sm p-6 prose max-w-none">
        <h2 className="text-xl font-bold mb-3">JSON 포맷터로 할 수 있는 일</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li><strong>JSON 정렬 (Pretty Print)</strong> — 한 줄로 압축된 JSON을 들여쓰기 적용해 사람이 읽기 좋은 형태로 변환합니다.</li>
          <li><strong>JSON 압축 (Minify)</strong> — 공백과 줄바꿈을 제거해 데이터 크기를 줄입니다. API 요청 본문이나 설정 파일 최소화에 유용.</li>
          <li><strong>JSON 검증</strong> — 입력 데이터에 문법 오류가 있으면 즉시 표시. 따옴표 누락, 콤마 위치 오류 등 자주 발생하는 실수를 잡아냅니다.</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3">언제 쓰면 좋은가</h2>
        <p className="text-gray-700">
          API 응답을 디버깅할 때, 로그 파일에서 JSON 부분만 깔끔하게 보고 싶을 때,
          설정 파일을 사람이 편집하기 좋은 형태로 정리하고 싶을 때,
          또는 minify된 JSON 응답을 사람이 읽을 수 있는 형태로 펼쳐서 분석할 때 가장 빠른 도구입니다.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3">개인정보 안전성</h2>
        <p className="text-gray-700">
          모든 처리는 사용자 브라우저 안에서만 일어납니다. 입력한 JSON 데이터는 서버로 전송되지 않으며,
          페이지를 떠나는 순간 흔적이 남지 않습니다. 민감한 데이터(API 키, 개인정보, 내부 시스템 응답)도
          안심하고 사용할 수 있습니다.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3">자주 묻는 질문</h2>
        <dl className="space-y-3 text-gray-700">
          <div>
            <dt className="font-semibold">Q. 매우 큰 JSON도 처리되나요?</dt>
            <dd className="pl-4">A. 수 MB 단위까지 브라우저 메모리 한도 안에서 처리 가능합니다. 수십 MB 이상이면 브라우저가 멈출 수 있으니 명령줄 도구(jq 등) 권장.</dd>
          </div>
          <div>
            <dt className="font-semibold">Q. JSON5 같은 변형 문법도 지원하나요?</dt>
            <dd className="pl-4">A. 표준 JSON만 지원합니다. 주석이나 trailing comma는 오류로 처리됩니다.</dd>
          </div>
          <div>
            <dt className="font-semibold">Q. 키 정렬은 지원하나요?</dt>
            <dd className="pl-4">A. 현재는 입력 순서를 유지합니다. 키 알파벳 정렬 기능은 향후 추가 예정.</dd>
          </div>
        </dl>
      </section>
    </UtilityLayout>
  );
}
