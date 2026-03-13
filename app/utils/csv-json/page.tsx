'use client';

import { useState } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';
import Papa from 'papaparse';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TEXT_LENGTH = 1024 * 1024; // 1MB 텍스트

export default function CsvJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // 파일 크기 검사
    if (file.size > MAX_FILE_SIZE) {
      setError(`파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 가능합니다.`);
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text.length > MAX_TEXT_LENGTH) {
        setError(`파일 내용이 너무 깁니다. 최대 ${MAX_TEXT_LENGTH / 1024}KB까지 가능합니다.`);
        setLoading(false);
        return;
      }
      setInput(text);
      setLoading(false);
    };

    reader.onerror = () => {
      setError('파일을 읽는 중 오류가 발생했습니다.');
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const csvToJson = (csv: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            const errorMsg = results.errors.map(e => e.message).join(', ');
            reject(new Error(`CSV 파싱 오류: ${errorMsg}`));
            return;
          }

          if (results.data.length === 0) {
            reject(new Error('CSV 데이터가 비어있습니다'));
            return;
          }

          resolve(JSON.stringify(results.data, null, 2));
        },
        error: (error: Error) => {
          reject(new Error(`CSV 파싱 실패: ${error.message}`));
        }
      });
    });
  };

  const jsonToCsv = (json: string): string => {
    const data = JSON.parse(json);

    if (!Array.isArray(data)) {
      throw new Error('JSON 배열이 필요합니다. 예: [{"name":"John","age":30}]');
    }

    if (data.length === 0) {
      throw new Error('빈 배열은 변환할 수 없습니다');
    }

    // papaparse를 사용하여 JSON을 CSV로 변환
    const csv = Papa.unparse(data, {
      quotes: true,
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ',',
      header: true,
      newline: '\n'
    });

    return csv;
  };

  const handleConvert = async () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('입력값을 입력해주세요');
      return;
    }

    // 텍스트 크기 검사
    if (input.length > MAX_TEXT_LENGTH) {
      setError(`입력 텍스트가 너무 깁니다. 최대 ${MAX_TEXT_LENGTH / 1024}KB까지 가능합니다.`);
      return;
    }

    setLoading(true);

    try {
      let result: string;

      if (mode === 'csv-to-json') {
        result = await csvToJson(input);
      } else {
        result = jsonToCsv(input);
      }

      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '변환 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('복사되었습니다!');
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'csv-to-json' ? 'result.json' : 'result.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <UtilityLayout
      title="CSV ↔ JSON 변환"
      description="CSV 파일과 JSON 형식을 서로 변환합니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            변환 모드
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setMode('csv-to-json');
                setInput('');
                setOutput('');
                setError('');
              }}
              className={`px-4 py-2 rounded ${
                mode === 'csv-to-json'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              CSV → JSON
            </button>
            <button
              onClick={() => {
                setMode('json-to-csv');
                setInput('');
                setOutput('');
                setError('');
              }}
              className={`px-4 py-2 rounded ${
                mode === 'json-to-csv'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              JSON → CSV
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            파일 업로드 (선택사항)
          </label>
          <input
            type="file"
            accept={mode === 'csv-to-json' ? '.csv' : '.json'}
            onChange={handleFileUpload}
            className="w-full p-3 border border-gray-300 rounded"
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-2">
            최대 파일 크기: {MAX_FILE_SIZE / 1024 / 1024}MB
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            입력 ({mode === 'csv-to-json' ? 'CSV' : 'JSON'})
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm"
            placeholder={
              mode === 'csv-to-json'
                ? 'name,age,city\nJohn,30,Seoul\n"Jane Doe",25,"Busan, Korea"'
                : '[{"name":"John","age":30,"city":"Seoul"}]'
            }
            disabled={loading}
          />
        </div>

        <button
          onClick={handleConvert}
          disabled={loading}
          className={`w-full py-3 rounded font-medium mb-6 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {loading ? '변환 중...' : '변환하기'}
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {output && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              결과 ({mode === 'csv-to-json' ? 'JSON' : 'CSV'})
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
                다운로드
              </button>
            </div>
          </div>
        )}
      </div>
    </UtilityLayout>
  );
}
