import { useCallback, useEffect, useState } from 'react';

export default function useSpeech(lang = 'ja-JP') {
  const [supported, setSupported] = useState(typeof window !== 'undefined' && 'speechSynthesis' in window);

  useEffect(() => {
    if (!supported) return;
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, [supported]);

  const speak = useCallback(
    (text) => {
      if (!supported) return;
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const voice =
          voices.find((v) => v.lang === lang) ||
          voices.find((v) => v.lang.startsWith(lang.split('-')[0])) ||
          voices[0];
        if (voice) utterance.voice = voice;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error('Speech synthesis error', e);
      }
    },
    [lang, supported]
  );

  return { speak, supported };
}
