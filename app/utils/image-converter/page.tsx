'use client';

import { useState, useRef } from 'react';
import UtilityLayout from '@/components/ui/UtilityLayout';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 10000; // 최대 가로/세로
const MIN_DIMENSION = 1; // 최소 가로/세로

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [format, setFormat] = useState<'png' | 'webp' | 'jpeg'>('webp');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    setResult('');

    if (selectedFile) {
      // 파일 크기 검사
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(`파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 가능합니다.`);
        return;
      }

      // 이미지 파일 확인
      if (!selectedFile.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setOriginalWidth(img.width);
          setOriginalHeight(img.height);
          setPreview(reader.result as string);
        };
        img.onerror = () => {
          setError('이미지를 불러오는 중 오류가 발생했습니다.');
        };
        img.src = reader.result as string;
      };
      reader.onerror = () => {
        setError('파일을 읽는 중 오류가 발생했습니다.');
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateDimensions = (w: number, h: number): string | null => {
    if (w < MIN_DIMENSION || h < MIN_DIMENSION) {
      return `최소 크기는 ${MIN_DIMENSION}px 이상이어야 합니다.`;
    }

    if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
      return `최대 크기는 ${MAX_DIMENSION}px를 초과할 수 없습니다.`;
    }

    // 원본 대비 10배 이상 확대 경고
    if (w > originalWidth * 10 || h > originalHeight * 10) {
      return '원본 크기의 10배를 초과하는 확대는 권장하지 않습니다. 이미지 품질이 크게 저하될 수 있습니다.';
    }

    // 메모리 사용량 예측 (대략적)
    const estimatedMemory = (w * h * 4) / 1024 / 1024; // MB
    if (estimatedMemory > 100) {
      return `이미지가 너무 커서 처리할 수 없습니다. (예상 메모리: ${estimatedMemory.toFixed(0)}MB)`;
    }

    return null;
  };

  const handleConvert = () => {
    if (!file || !preview) return;

    setError('');
    setLoading(true);

    try {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = canvasRef.current;
          if (!canvas) {
            setError('Canvas를 초기화할 수 없습니다.');
            setLoading(false);
            return;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setError('Canvas 컨텍스트를 가져올 수 없습니다.');
            setLoading(false);
            return;
          }

          const targetWidth = width ? parseInt(width) : img.width;
          const targetHeight = height ? parseInt(height) : img.height;

          // 크기 유효성 검사
          const validationError = validateDimensions(targetWidth, targetHeight);
          if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          const mimeType = format === 'png' ? 'image/png' :
                          format === 'webp' ? 'image/webp' : 'image/jpeg';

          const dataUrl = canvas.toDataURL(mimeType, 0.9);
          setResult(dataUrl);
        } catch (err) {
          setError('이미지 변환 중 오류가 발생했습니다. 크기를 줄여보세요.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      img.onerror = () => {
        setError('이미지를 로드할 수 없습니다.');
        setLoading(false);
      };

      img.src = preview;
    } catch (err) {
      setError('예상치 못한 오류가 발생했습니다.');
      console.error(err);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const link = document.createElement('a');
    link.href = result;
    link.download = `converted.${format}`;
    link.click();
  };

  return (
    <UtilityLayout
      title="이미지 변환"
      description="이미지 크기 조정 및 포맷을 변환합니다"
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 선택
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded"
          />
          <p className="text-sm text-gray-500 mt-2">
            최대 파일 크기: {MAX_FILE_SIZE / 1024 / 1024}MB
          </p>
        </div>

        {preview && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                미리보기
              </label>
              <img src={preview} alt="Preview" className="max-w-full h-auto max-h-64 rounded border" />
              <p className="text-sm text-gray-600 mt-2">
                원본 크기: {originalWidth} × {originalHeight} px
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  너비 (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder={`원본: ${originalWidth}`}
                  min={MIN_DIMENSION}
                  max={MAX_DIMENSION}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  높이 (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder={`원본: ${originalHeight}`}
                  min={MIN_DIMENSION}
                  max={MAX_DIMENSION}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  포맷
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'png' | 'webp' | 'jpeg')}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="webp">WebP</option>
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
              </div>
            </div>

            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              <strong>팁:</strong> 비워두면 원본 크기로 포맷만 변환됩니다.
              비율을 유지하려면 너비나 높이 중 하나만 입력하세요.
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
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              결과
            </label>
            <img src={result} alt="Result" className="max-w-full h-auto max-h-64 rounded border mb-4" />
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              다운로드
            </button>
          </div>
        )}
      </div>
    </UtilityLayout>
  );
}
