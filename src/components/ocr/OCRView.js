import React, { useState } from 'react';
import { apiOCR } from '../../services/api';
import ImageUploader from './ImageUploader';
import ResultCard from './ResultCard';
import './styles.css';

export default function OCRView() {
  const [extracting, setExtracting] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleUpload = async (uploadedFile) => {
    setError(null);

    const objectUrl = URL.createObjectURL(uploadedFile);
    setPreviewUrl(objectUrl);

    try {
      setExtracting(true);
      const data = await apiOCR.extract(uploadedFile);
      setResults(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      console.error('Failed to extract words', err);
      setError(err.message || 'OCR処理に失敗しました');
      setResults([]);
    } finally {
      setExtracting(false);
    }
  };

  const handleClear = () => {
    setResults([]);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">OCR - Extract Words from Image</h2>

      <div className="upload-section">
        <ImageUploader onUpload={handleUpload} />

        {previewUrl && (
          <div className="preview-section">
            <h3>アップロード画像</h3>
            <img src={previewUrl} alt="Preview" className="preview-image" />
            <button onClick={handleClear} className="clear-button">
              クリア
            </button>
          </div>
        )}
      </div>

      {extracting && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>処理中です...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">エラー: {error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="results-section">
          <h2>抽出結果</h2>
          <div className="results-grid">
            {results.map((result, index) => (
              <ResultCard key={index} data={result} index={index} />
            ))}
          </div>
        </div>
      )}

      {!results.length && !extracting && !error && (
        <p className="text-gray-500">
          古文単語帳の画像をアップロードして、自動的に単語を抽出します。
        </p>
      )}
    </div>
  );
}
