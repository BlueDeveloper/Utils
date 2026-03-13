'use client';

import { useState } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';
import { PDFDocument } from 'pdf-lib';

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB per file
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total

export default function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    setError('');
    const fileArray = Array.from(selectedFiles);

    // 파일 크기 검사
    for (const file of fileArray) {
      if (file.type !== 'application/pdf') {
        setError('PDF 파일만 업로드할 수 있습니다');
        return;
      }

      if (file.size > MAX_PDF_SIZE) {
        setError(`${file.name}: 파일 크기가 너무 큽니다. 최대 ${MAX_PDF_SIZE / 1024 / 1024}MB`);
        return;
      }
    }

    const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      setError(`전체 파일 크기가 너무 큽니다. 최대 ${MAX_TOTAL_SIZE / 1024 / 1024}MB`);
      return;
    }

    setFiles(fileArray);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('최소 2개 이상의 PDF 파일이 필요합니다');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 새 PDF 문서 생성
      const mergedPdf = await PDFDocument.create();

      // 각 파일을 순서대로 병합
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        copiedPages.forEach(page => {
          mergedPdf.addPage(page);
        });
      }

      // 병합된 PDF 저장
      const pdfBytes = await mergedPdf.save();

      // 다운로드
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(url);

      alert(`${files.length}개의 PDF 파일이 병합되었습니다!`);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('memory')) {
          setError('메모리 부족으로 PDF를 병합할 수 없습니다. 파일 수를 줄여주세요.');
        } else if (err.message.includes('password') || err.message.includes('encrypted')) {
          setError('암호화된 PDF는 병합할 수 없습니다.');
        } else {
          setError(`PDF 병합 중 오류: ${err.message}`);
        }
      } else {
        setError('PDF 병합 중 오류가 발생했습니다');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UtilityLayout
      title="PDF 합치기"
      description="여러 PDF 파일을 하나로 합칩니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PDF 파일 선택
          </label>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded"
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-2">
            최대 파일 크기: 파일당 {MAX_PDF_SIZE / 1024 / 1024}MB, 전체 {MAX_TOTAL_SIZE / 1024 / 1024}MB
          </p>
        </div>

        {files.length > 0 && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                선택된 파일 ({files.length}개) - 순서 조정 가능
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveFile(index, 'up')}
                        disabled={index === 0 || loading}
                        className={`px-2 py-1 text-xs rounded ${
                          index === 0 || loading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveFile(index, 'down')}
                        disabled={index === files.length - 1 || loading}
                        className={`px-2 py-1 text-xs rounded ${
                          index === files.length - 1 || loading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        ↓
                      </button>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {index + 1}. {file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      disabled={loading}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:bg-gray-300"
                    >
                      제거
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleMerge}
              disabled={loading || files.length < 2}
              className={`w-full py-3 rounded font-medium ${
                loading || files.length < 2
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {loading ? '병합 중...' : `${files.length}개 PDF 파일 합치기`}
            </button>
          </>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">사용 방법</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>병합할 PDF 파일들을 선택하세요 (여러 개 선택 가능)</li>
            <li>↑↓ 버튼으로 파일 순서를 조정하세요</li>
            <li>"PDF 파일 합치기" 버튼을 클릭하세요</li>
            <li>병합된 PDF가 자동으로 다운로드됩니다</li>
          </ol>
        </div>
      </div>
    </UtilityLayout>
  );
}
