'use client';

import { useState } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';
import { PDFDocument } from 'pdf-lib';

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const parsePageNumbers = (input: string, maxPage: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map(p => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (isNaN(start) || isNaN(end)) continue;

        for (let i = Math.max(1, start); i <= Math.min(maxPage, end); i++) {
          pages.add(i);
        }
      } else {
        const pageNum = parseInt(part);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPage) {
          pages.add(pageNum);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('PDF 파일만 업로드할 수 있습니다');
        return;
      }

      // 파일 크기 검사
      if (selectedFile.size > MAX_PDF_SIZE) {
        setError(`PDF 파일 크기가 너무 큽니다. 최대 ${MAX_PDF_SIZE / 1024 / 1024}MB까지 가능합니다.`);
        return;
      }

      setFile(selectedFile);
      setError('');
      setLoading(true);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const numPages = pdfDoc.getPageCount();
        setPageCount(numPages);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('memory') || err.message.includes('size')) {
            setError('PDF 파일이 너무 복잡하거나 메모리가 부족합니다. 더 작은 파일을 사용해주세요.');
          } else if (err.message.includes('password') || err.message.includes('encrypted')) {
            setError('암호화된 PDF는 지원하지 않습니다.');
          } else {
            setError('PDF 파일을 읽는 중 오류가 발생했습니다. 파일이 손상되었을 수 있습니다.');
          }
        } else {
          setError('PDF 파일을 읽는 중 오류가 발생했습니다');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSplit = async () => {
    if (!file || !selectedPages) {
      setError('파일과 페이지 번호를 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pagesToExtract = parsePageNumbers(selectedPages, pageCount);

      if (pagesToExtract.length === 0) {
        setError('올바른 페이지 번호를 입력해주세요');
        setLoading(false);
        return;
      }

      // 새 PDF 문서 생성
      const newPdfDoc = await PDFDocument.create();

      // 선택된 페이지 복사
      const copiedPages = await newPdfDoc.copyPages(
        pdfDoc,
        pagesToExtract.map(p => p - 1) // 0-based index
      );

      // 새 문서에 페이지 추가
      copiedPages.forEach(page => {
        newPdfDoc.addPage(page);
      });

      // PDF 저장
      const pdfBytes = await newPdfDoc.save();

      // 다운로드
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted_pages_${pagesToExtract.join('-')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      alert(`${pagesToExtract.length}개 페이지가 추출되었습니다!`);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('memory')) {
          setError('메모리 부족으로 PDF를 처리할 수 없습니다. 더 적은 페이지를 선택해주세요.');
        } else {
          setError(`PDF 분리 중 오류: ${err.message}`);
        }
      } else {
        setError('PDF 분리 중 오류가 발생했습니다');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UtilityLayout
      title="PDF 페이지 분리"
      description="PDF 파일에서 원하는 페이지를 추출합니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PDF 파일 선택
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded"
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-2">
            최대 파일 크기: {MAX_PDF_SIZE / 1024 / 1024}MB
          </p>
        </div>

        {pageCount > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              총 <strong>{pageCount}</strong>개의 페이지가 있습니다
            </p>
          </div>
        )}

        {file && pageCount > 0 && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                추출할 페이지 번호
              </label>
              <input
                type="text"
                value={selectedPages}
                onChange={(e) => setSelectedPages(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="예: 1,3,5-7 (쉼표와 하이픈으로 구분)"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                개별 페이지는 쉼표로, 범위는 하이픈으로 구분합니다
                <br />
                예시: <code className="bg-gray-100 px-2 py-1 rounded">1,3,5-7,10</code> → 1, 3, 5, 6, 7, 10번 페이지
              </p>
            </div>

            <button
              onClick={handleSplit}
              disabled={loading || !selectedPages}
              className={`w-full py-3 rounded font-medium ${
                loading || !selectedPages
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? '처리 중...' : '페이지 추출 및 다운로드'}
            </button>
          </>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}
      </div>
    </UtilityLayout>
  );
}
