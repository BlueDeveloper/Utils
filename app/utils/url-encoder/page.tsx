'use client';

import { useState } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    setError('');
    if (!input.trim()) {
      setError('URL 또는 텍스트를 입력해주세요');
      return;
    }
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      setError('인코딩 중 오류가 발생했습니다');
    }
  };

  const handleDecode = () => {
    setError('');
    if (!input.trim()) {
      setError('인코딩된 URL을 입력해주세요');
      return;
    }
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      setError('올바른 인코딩 형식이 아닙니다 (불완전한 %XX 시퀀스)');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('복사되었습니다!');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <UtilityLayout
      title="URL 인코더 / 디코더"
      description="한글·특수문자가 포함된 URL을 percent-encoding(%XX) 형식으로 변환하거나 되돌립니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            입력
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded font-mono text-sm"
            placeholder="https://example.com/검색?q=한글 또는 https%3A%2F%2Fexample.com%2F%EA%B2%80%EC%83%89"
          />
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleEncode}
            className="flex-1 bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700"
          >
            인코딩 (Encode)
          </button>
          <button
            onClick={handleDecode}
            className="flex-1 bg-purple-600 text-white py-3 rounded font-medium hover:bg-purple-700"
          >
            디코딩 (Decode)
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
              className="w-full h-40 p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCopy}
                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              >
                복사
              </button>
              <button
                onClick={handleSwap}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
              >
                결과를 입력으로 (역변환)
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="mt-8 bg-white rounded-lg shadow-sm p-6 prose max-w-none">
        <h2 className="text-xl font-bold mb-3">URL 인코딩이 필요한 이유</h2>
        <p className="text-gray-700">
          URL에는 안전하게 사용 가능한 문자가 정해져 있습니다. 한글, 공백, 특수문자(`@`, `#`, `?`, `&` 등)는
          그대로 두면 브라우저나 서버가 다르게 해석할 수 있어 percent-encoding(%XX)으로 변환해야 합니다.
          이 도구는 입력 문자열을 표준 RFC 3986 방식으로 인코딩하고, 반대로 디코딩도 수행합니다.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3">언제 쓰면 좋은가</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>한글 검색어를 URL 파라미터로 넘겨야 할 때</li>
          <li>API 요청에 특수문자가 포함된 쿼리스트링을 만들 때</li>
          <li>이메일·문자에 포함된 알 수 없는 `%XX` 문자열을 사람이 읽을 수 있게 디코딩</li>
          <li>로그 파일에서 인코딩된 URL을 분석할 때</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3">encodeURIComponent vs encodeURI</h2>
        <p className="text-gray-700">
          이 도구는 `encodeURIComponent`를 사용합니다. `encodeURI`는 `:/?#&` 같은 구분자를 그대로 두지만,
          `encodeURIComponent`는 모두 인코딩합니다. 쿼리 파라미터 값 하나를 인코딩할 때는 후자,
          전체 URL을 한 번에 처리할 때는 전자가 적합합니다.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3">개인정보 안전성</h2>
        <p className="text-gray-700">
          모든 인코딩/디코딩은 사용자 브라우저 안에서만 처리됩니다. 입력 데이터는 서버로 전송되지 않으며
          페이지를 떠나는 즉시 흔적이 남지 않습니다. 토큰, 세션 ID, 개인정보가 포함된 URL도 안심하고 변환할 수 있습니다.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-3">자주 묻는 질문</h2>
        <dl className="space-y-3 text-gray-700">
          <div>
            <dt className="font-semibold">Q. `+` 와 `%20` 차이는?</dt>
            <dd className="pl-4">A. 둘 다 공백을 표현하지만 `+`는 폼 데이터 인코딩(application/x-www-form-urlencoded), `%20`은 URL 경로 인코딩에 사용됩니다. 이 도구는 RFC 3986에 따라 `%20`을 사용합니다.</dd>
          </div>
          <div>
            <dt className="font-semibold">Q. 한글 한 글자가 왜 9자로 변환되나요?</dt>
            <dd className="pl-4">A. UTF-8 한글 한 글자는 3바이트이며 각 바이트가 `%EA` 처럼 3자(%XX) 표기로 변환되어 총 9자가 됩니다.</dd>
          </div>
          <div>
            <dt className="font-semibold">Q. 이미 인코딩된 URL을 다시 인코딩하면?</dt>
            <dd className="pl-4">A. `%` 문자 자체가 `%25`로 인코딩되어 이중 인코딩 상태가 됩니다. 디코딩 두 번 해야 원복됩니다. 인코딩 전 입력이 이미 인코딩됐는지 확인하세요.</dd>
          </div>
        </dl>
      </section>
    </UtilityLayout>
  );
}
