import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ListFormModal({ initial, onSave, onClose, saving }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initial) setName(initial.name || '');
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim() });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        {initial ? 'Edit List' : 'Create New List'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">List Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kobun Basics"
            required
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
