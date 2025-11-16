import React, { useEffect, useState, useCallback } from 'react';
import { apiLists, apiWords } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ListFormModal from './ListFormModal';
import WordFormModal from '../words/WordFormModal';
import useSpeech from '../../hooks/useSpeech';

export default function WordListsView() {
  const { speak } = useSpeech('ja-JP');
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [words, setWords] = useState([]);
  const [loadingWords, setLoadingWords] = useState(false);

  const [listModalOpen, setListModalOpen] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [savingList, setSavingList] = useState(false);

  const [wordModalOpen, setWordModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [savingWord, setSavingWord] = useState(false);

  const fetchLists = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiLists.list();
      setLists(data || []);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Failed to load lists');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWords = useCallback(
    async (listId) => {
      if (!listId) return;
      setLoadingWords(true);
      try {
        const data = await apiLists.words(listId);
        setWords(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        console.error('Failed to load words', err);
      } finally {
        setLoadingWords(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  useEffect(() => {
    if (selected) fetchWords(selected.id);
  }, [selected, fetchWords]);

  const handleSaveList = async (payload) => {
    setSavingList(true);
    try {
      if (editingList) {
        const updated = await apiLists.update(editingList.id, payload);
        setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      } else {
        const created = await apiLists.create(payload);
        setLists((prev) => [created, ...prev]);
      }
      setListModalOpen(false);
    } catch (err) {
      console.error('Failed to save list', err);
    } finally {
      setSavingList(false);
    }
  };

  const handleDeleteList = async (list) => {
    if (!window.confirm(`Delete list "${list.name}" and all its words?`)) return;
    try {
      await apiLists.remove(list.id);
      setLists((prev) => prev.filter((l) => l.id !== list.id));
      if (selected?.id === list.id) {
        setSelected(null);
        setWords([]);
      }
    } catch (err) {
      console.error('Failed to delete list', err);
    }
  };

  const handleSaveWord = async (payload) => {
    if (!selected) return;
    setSavingWord(true);
    try {
      if (editingWord) {
        const updated = await apiWords.update(editingWord.id, payload);
        setWords((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
      } else {
        const created = await apiLists.addWord(selected.id, payload);
        setWords((prev) => [created, ...prev]);
      }
      setWordModalOpen(false);
    } catch (err) {
      console.error('Failed to save word', err);
    } finally {
      setSavingWord(false);
    }
  };

  const handleDeleteWord = async (word) => {
    if (!window.confirm(`Delete word "${word.kobun_text}"?`)) return;
    try {
      await apiWords.remove(word.id);
      setWords((prev) => prev.filter((w) => w.id !== word.id));
    } catch (err) {
      console.error('Failed to delete word', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchLists}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vocabulary Lists</h2>
        <button
          onClick={() => {
            setEditingList(null);
            setListModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          New List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => (
          <div
            key={list.id}
            className={`bg-white rounded shadow p-4 border cursor-pointer ${
              selected?.id === list.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelected(list)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">{list.name}</h3>
              <div className="space-x-2 text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingList(list);
                    setListModalOpen(true);
                  }}
                  className="text-green-700 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list);
                  }}
                  className="text-red-700 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500">{list.word_count || 0} words</p>
          </div>
        ))}
        {!lists.length && (
          <div className="col-span-full text-gray-500">
            No lists yet. Create one to get started.
          </div>
        )}
      </div>

      {selected && (
        <div className="bg-white rounded shadow p-4 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">{selected.name} - Words</h3>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditingWord(null);
                  setWordModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Word
              </button>
              <button
                onClick={() => fetchWords(selected.id)}
                className="px-4 py-2 border rounded"
              >
                Refresh
              </button>
            </div>
          </div>
          {loadingWords ? (
            <LoadingSpinner />
          ) : words.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2">Kobun</th>
                    <th className="text-left px-4 py-2">English</th>
                    <th className="text-left px-4 py-2">Readings</th>
                    <th className="text-left px-4 py-2">Next Review</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((w) => (
                    <tr key={w.id} className="border-t">
                      <td className="px-4 py-2 whitespace-pre-wrap">
                        {w.kobun_text}
                      </td>
                      <td className="px-4 py-2 whitespace-pre-wrap">
                        {w.english_translation}
                      </td>
                      <td className="px-4 py-2">
                        {Array.isArray(w.readings)
                          ? w.readings.join('、')
                          : w.readings || ''}
                      </td>
                      <td className="px-4 py-2">
                        {w.next_review || '-'}
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          onClick={() => speak(w.kobun_text)}
                          className="px-2 py-1 text-blue-600 hover:underline"
                        >
                          Speak
                        </button>
                        <button
                          onClick={() => {
                            setEditingWord(w);
                            setWordModalOpen(true);
                          }}
                          className="px-2 py-1 text-green-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWord(w)}
                          className="px-2 py-1 text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No words yet.</p>
          )}
        </div>
      )}

      {listModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <ListFormModal
              initial={editingList}
              onSave={handleSaveList}
              onClose={() => setListModalOpen(false)}
              saving={savingList}
            />
          </div>
        </div>
      )}

      {wordModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white rounded shadow p-6 w-full max-w-2xl">
            <WordFormModal
              initial={editingWord}
              onSave={handleSaveWord}
              onClose={() => setWordModalOpen(false)}
              saving={savingWord}
            />
          </div>
        </div>
      )}
    </div>
  );
}
