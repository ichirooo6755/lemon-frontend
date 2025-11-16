import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

export default function WordFormModal({ initial, onSave, onClose, saving }) {
  const [kobun, setKobun] = useState('');
  const [english, setEnglish] = useState('');
  const [readings, setReadings] = useState('');
  const [examples, setExamples] = useState('');

  useEffect(() => {
    if (initial) {
      setKobun(initial.kobun_text || '');
      setEnglish(initial.english_translation || '');
      setReadings(
        Array.isArray(initial.readings)
          ? initial.readings.join(', ')
          : initial.readings || ''
      );
      setExamples(initial.examples || '');
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      kobun_text: kobun.trim(),
      english_translation: english.trim(),
      readings: readings
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      examples: examples.trim(),
    };
    onSave(payload);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        {initial ? 'Edit Word' : 'Add Word'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Kobun (Classical Japanese)
          </label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={2}
            value={kobun}
            onChange={(e) => setKobun(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            English Translation
          </label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={2}
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Readings (comma-separated)
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={readings}
            onChange={(e) => setReadings(e.target.value)}
            placeholder="e.g. いと, かし"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Example Sentence
          </label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={2}
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded flex items-center justify-center"
            disabled={saving}
          >
            {saving ? <LoadingSpinner /> : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
