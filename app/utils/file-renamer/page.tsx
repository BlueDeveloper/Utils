'use client';

import { useState } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';

interface FileItem {
  original: string;
  renamed: string;
}

export default function FileRenamer() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [pattern, setPattern] = useState('');
  const [startNumber, setStartNumber] = useState('1');
  const [numberPattern, setNumberPattern] = useState<'{n}' | '{N}'>('{n}');
  const [preview, setPreview] = useState<FileItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    // Only update if user actually selected files (not cancelled)
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles);
      generatePreview(selectedFiles, pattern, parseInt(startNumber), numberPattern);
    }
    // If cancelled (null or empty), preserve existing files
  };

  const generatePreview = (fileList: FileList, pat: string, start: number, numPattern: '{n}' | '{N}') => {
    const items: FileItem[] = [];

    Array.from(fileList).forEach((file, index) => {
      const extension = file.name.split('.').pop();
      let newName = pat || 'file';

      // Apply the selected number pattern
      if (numPattern === '{n}') {
        // Simple numbering: 1, 2, 3...
        newName = newName.replace(/{n}/g, (start + index).toString());
      } else {
        // Padded numbering: 001, 002, 003...
        const paddedNumber = (start + index).toString().padStart(3, '0');
        newName = newName.replace(/{N}/g, paddedNumber);
      }

      items.push({
        original: file.name,
        renamed: `${newName}.${extension}`
      });
    });

    setPreview(items);
  };

  const handlePatternChange = (value: string) => {
    setPattern(value);
    if (files) {
      generatePreview(files, value, parseInt(startNumber), numberPattern);
    }
  };

  const handleStartNumberChange = (value: string) => {
    setStartNumber(value);
    if (files) {
      generatePreview(files, pattern, parseInt(value) || 1, numberPattern);
    }
  };

  const handleNumberPatternChange = (value: '{n}' | '{N}') => {
    setNumberPattern(value);
    if (files) {
      generatePreview(files, pattern, parseInt(startNumber), value);
    }
  };

  const handleDownloadScript = () => {
    if (!preview.length) return;

    // Windows 배치 파일 생성 (UTF-8 인코딩 설정 포함)
    const batchScript = '@echo off\nchcp 65001 > nul\n' + preview
      .map(item => `ren "${item.original}" "${item.renamed}"`)
      .join('\n');

    // UTF-8 BOM 추가하여 한글 파일명 정상 처리
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + batchScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rename.bat';
    a.click();
    URL.revokeObjectURL(url);

    alert('rename.bat 파일이 다운로드되었습니다.\n이름을 바꿀 파일들이 있는 폴더에 넣고 실행하세요.');
  };

  return (
    <UtilityLayout
      title="파일명 일괄 변경"
      description="여러 파일의 이름을 한 번에 변경합니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* 사용 안내 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">사용 방법</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>이름을 바꿀 파일들을 선택하세요</li>
            <li>원하는 파일명 형식을 입력하세요 (예: 사진_번호)</li>
            <li>아래에서 변경될 이름을 확인하세요</li>
            <li>배치 파일을 다운로드하세요</li>
            <li>다운로드한 파일을 원본 파일들과 같은 폴더에 넣고 더블클릭하세요</li>
          </ol>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            1단계: 파일 선택
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded"
          />
          <p className="text-sm text-gray-500 mt-2">
            이름을 바꿀 파일들을 모두 선택하세요 (Ctrl 키를 누른 채 클릭)
          </p>
        </div>

        {files && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2단계: 파일명 형식 입력
                </label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => handlePatternChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder={`예: 여행사진_${numberPattern}`}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {numberPattern}를 원하는 위치에 입력하세요
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  번호 형식 선택
                </label>
                <select
                  value={numberPattern}
                  onChange={(e) => handleNumberPatternChange(e.target.value as '{n}' | '{N}')}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="{n}">{'{n}'} - 1, 2, 3...</option>
                  <option value="{N}">{'{N}'} - 001, 002, 003...</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {numberPattern === '{n}' ? '일반 번호 (1, 2, 3...)' : '0으로 채운 번호 (001, 002, 003...)'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3단계: 시작 번호
                </label>
                <input
                  type="number"
                  value={startNumber}
                  onChange={(e) => handleStartNumberChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-2">
                  번호를 어디서부터 시작할지 정하세요
                </p>
              </div>
            </div>

            {preview.length > 0 && (
              <>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    4단계: 변경될 이름 확인 ({preview.length}개 파일)
                  </h3>
                  <div className="max-h-96 overflow-y-auto border border-gray-300 rounded">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                            현재 파일명
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">
                            →
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                            변경될 파일명
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {item.original}
                            </td>
                            <td className="px-4 py-2 text-center text-gray-400">
                              →
                            </td>
                            <td className="px-4 py-2 text-sm font-medium text-blue-600">
                              {item.renamed}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <button
                  onClick={handleDownloadScript}
                  className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 mb-3"
                >
                  5단계: 배치 파일 다운로드 (rename.bat)
                </button>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    다운로드 후 사용 방법:
                  </p>
                  <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                    <li>다운로드한 <strong>rename.bat</strong> 파일을 찾으세요</li>
                    <li>이름을 바꿀 파일들이 있는 폴더에 <strong>rename.bat</strong>을 넣으세요</li>
                    <li><strong>rename.bat</strong> 파일을 더블클릭하여 실행하세요</li>
                    <li>파일 이름이 자동으로 변경됩니다</li>
                  </ol>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </UtilityLayout>
  );
}
