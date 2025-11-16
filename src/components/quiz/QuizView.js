import React, { useEffect, useMemo, useState } from 'react';
import { apiLists, apiQuiz } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import useSpeech from '../../hooks/useSpeech';

export default function QuizView() {
  const { speak } = useSpeech('ja-JP');
  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [selectedListId, setSelectedListId] = useState('');
  const [mode, setMode] = useState('flashcards');
  const [words, setWords] = useState([]);
  const [loadingWords, setLoadingWords] = useState(false);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    const loadLists = async () => {
      try {
        setLoadingLists(true);
        const data = await apiLists.list();
        setLists(data || []);
      } catch (err) {
        console.error('Failed to load lists for quiz', err);
      } finally {
        setLoadingLists(false);
      }
    };
    loadLists();
  }, []);

  const startQuiz = async () => {
    if (!selectedListId) return;
    try {
      setLoadingWords(true);
      const data = await apiLists.words(selectedListId);
      const ws = Array.isArray(data) ? data : data?.items || [];
      setWords(ws);
      setIndex(0);
      setScore(0);
      setShowAnswer(false);
      setCompleted(false);
      setUserAnswer('');
    } catch (err) {
      console.error('Failed to load words for quiz', err);
    } finally {
      setLoadingWords(false);
    }
  };

  const current = words[index];

  const handleAnswer = async (isCorrect) => {
    if (!current) return;
    try {
      await apiQuiz.submit({
        word_id: current.id,
        correct: !!isCorrect,
        mode,
        difficulty: isCorrect ? 'easy' : 'hard',
      });
    } catch (err) {
      console.error('Failed to submit review', err);
    }
    if (isCorrect) setScore((s) => s + 1);
    if (index + 1 < words.length) {
      setIndex((i) => i + 1);
      setShowAnswer(false);
      setUserAnswer('');
    } else {
      setCompleted(true);
    }
  };

  const options = useMemo(() => {
    if (!current) return [];
    const others = words.filter((w) => w.id !== current.id);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffled, current].sort(() => Math.random() - 0.5);
  }, [current, words]);

  const renderFlashcards = () => (
    <div className="border rounded p-6 bg-white shadow text-center">
      {!showAnswer ? (
        <>
          <p className="text-gray-600">Definition</p>
          <h3 className="text-xl font-semibold mb-4">
            {current.english_translation}
          </h3>
          <button
            onClick={() => setShowAnswer(true)}
            className="px-4 py-2 border rounded"
          >
            Show Answer
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600">Kobun</p>
          <h3 className="text-2xl font-bold">{current.kobun_text}</h3>
          <p className="text-gray-600 mt-2">
            Readings:{' '}
            {Array.isArray(current.readings)
              ? current.readings.join('、')
              : current.readings || '-'}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <button
              onClick={() => speak(current.kobun_text)}
              className="px-3 py-2 border rounded"
            >
              Speak
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              I was right
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="px-4 py-2 rounded bg-red-600 text-white"
            >
              I was wrong
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderMC = () => (
    <div className="space-y-4">
      <div>
        <p className="text-gray-600">Definition</p>
        <h3 className="text-xl font-semibold">
          {current.english_translation}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => handleAnswer(o.id === current.id)}
            className="px-4 py-3 rounded border hover:bg-blue-50 text-left"
          >
            {o.kobun_text}
          </button>
        ))}
      </div>
    </div>
  );

  const renderTyping = () => {
    const submit = () => {
      const isCorrect = userAnswer.trim() === current.kobun_text.trim();
      handleAnswer(isCorrect);
    };
    return (
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Definition</p>
          <h3 className="text-xl font-semibold">
            {current.english_translation}
          </h3>
        </div>
        <input
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Type the Kobun term"
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />
        <button
          onClick={submit}
          className="px-4 py-2 rounded bg-green-600 text-white"
        >
          Submit
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quiz</h2>
      <div className="bg-white rounded shadow p-4 border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium">Vocabulary List</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
            >
              <option value="">Select list</option>
              {lists.map((l) => (
                <option value={l.id} key={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Mode</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="flashcards">Flashcards</option>
              <option value="mc">Multiple Choice</option>
              <option value="typing">Typing</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={startQuiz}
              className="px-4 py-2 rounded bg-blue-600 text-white w-full md:w-auto"
              disabled={loadingLists || loadingWords}
            >
              {loadingWords ? 'Loading...' : 'Start Quiz'}
            </button>
          </div>
        </div>
      </div>

      {loadingLists && <LoadingSpinner />}

      {!!words.length && !completed && current && (
        <div className="bg-white rounded shadow p-6 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              Question {index + 1} / {words.length}
            </div>
            <div>Score: {score}</div>
          </div>
          {mode === 'flashcards' && renderFlashcards()}
          {mode === 'mc' && renderMC()}
          {mode === 'typing' && renderTyping()}
        </div>
      )}

      {completed && (
        <div className="bg-white rounded shadow p-6 border text-center">
          <h3 className="text-2xl font-bold mb-2">Quiz Complete</h3>
          <p className="text-lg mb-4">
            Score: {score} / {words.length} (
            {((score / words.length) * 100).toFixed(1)}%)
          </p>
          <div className="space-x-2">
            <button
              onClick={startQuiz}
              className="px-4 py-2 rounded border"
            >
              Retry
            </button>
            <button
              onClick={() => {
                setWords([]);
                setCompleted(false);
              }}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {!loadingLists && !lists.length && (
        <div className="text-gray-500">
          No lists available. Create a list in the Lists tab first.
        </div>
      )}
    </div>
  );
}
