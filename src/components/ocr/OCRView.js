import React, { useEffect, useState } from 'react';
import { apiLists, apiOCR } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

export default function OCRView() {
  const [file, setFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [results, setResults] = useState([]);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiLists.list();
        setLists(data || []);
      } catch (err) {
        console.error('Failed to load lists', err);
      }
    })();
  }, []);

  const handleExtract = async () => {
    if (!file) return;
    try {
      setExtracting(true);
      const data = await apiOCR.extract(file);
      setResults(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      console.error('Failed to extract words', err);
    } finally {
      setExtracting(false);
    }
  };

  const addToList = async (word, listId) => {
    try {
      await apiLists.addWord(listId, {
        kobun_text: word.kobun_text || word.term || '',
        english_translation:
          word.english_translation || word.definition || '',
        readings: Array.isArray(word.readings)
          ? word.readings
          : word.readings
          ? [word.readings]
          : [],
      });
    } catch (err) {
      console.error('Failed to add word', err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">OCR - Extract Words from Image</h2>
      <div className="bg-white rounded shadow p-4 border space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={handleExtract}
          className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
          disabled={!file || extracting}
        >
          {extracting ? 'Processing...' : 'Extract Words'}
        </button>
      </div>

      {!!results.length && (
        <div className="bg-white rounded shadow p-4 border">
          <h3 className="text-lg font-semibold mb-3">Extracted Words</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Kobun</th>
                  <th className="text-left px-4 py-2">English</th>
                  <th className="text-left px-4 py-2">Readings</th>
                  <th className="px-4 py-2">Add to List</th>
                </tr>
              </thead>
              <tbody>
                {results.map((w, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2 whitespace-pre-wrap">
                      {w.kobun_text || w.term}
                    </td>
                    <td className="px-4 py-2 whitespace-pre-wrap">
                      {w.english_translation || w.definition}
                    </td>
                    <td className="px-4 py-2">
                      {Array.isArray(w.readings)
                        ? w.readings.join('、')
                        : w.readings || ''}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <select
                          className="border rounded px-2 py-1"
                          id={`ocr-select-${idx}`}
                        >
                          {lists.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            const select = document.getElementById(
                              `ocr-select-${idx}`
                            );
                            addToList(w, select.value);
                          }}
                          className="px-3 py-1 rounded bg-green-600 text-white"
                        >
                          Add
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!results.length && (
        <p className="text-gray-500">
          Upload an image containing Kobun text and extract vocabulary.
        </p>
      )}
    </div>
  );
}
