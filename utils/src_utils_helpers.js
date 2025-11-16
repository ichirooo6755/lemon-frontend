// Utility function to concatenate class names
export const cx = (...classes) => classes.filter(Boolean).join(' ');

// Extract error message from API response
export function getErrorMessage(err) {
  return (
    err?.response?.data?.detail ||
    err?.response?.data?.message ||
    err?.message ||
    'An unexpected error occurred.'
  );
}

// Text-to-speech utility for Japanese pronunciation
export function speak(text, lang = 'ja-JP') {
  try {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === lang) || 
                   voices.find(v => v.lang.startsWith(lang.split('-')[0])) || 
                   voices[0];
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('TTS error:', e);
  }
}

// Preload voices for speech synthesis
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}