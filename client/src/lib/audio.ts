import { useCallback } from 'react';

// Morse code timing constants (in milliseconds)
const DOT_DURATION = 100;
const DASH_DURATION = DOT_DURATION * 3;
const SYMBOL_SPACE = DOT_DURATION;
const LETTER_SPACE = DOT_DURATION * 3;
const WORD_SPACE = DOT_DURATION * 7;

let audioContext: AudioContext | null = null;

export function useAudio() {
  const playMorseCode = useCallback(async (morseCode: string) => {
    if (!audioContext) {
      audioContext = new AudioContext();
    }

    // Ensure context is running (needed due to autoplay policies)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const startTime = audioContext.currentTime;
    let currentTime = startTime;

    for (let i = 0; i < morseCode.length; i++) {
      const symbol = morseCode[i];

      if (symbol === '.' || symbol === '-') {
        const duration = symbol === '.' ? DOT_DURATION : DASH_DURATION;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.1;
        
        oscillator.start(currentTime);
        oscillator.stop(currentTime + duration / 1000);
        
        currentTime += duration / 1000;
        currentTime += SYMBOL_SPACE / 1000;
      } else if (symbol === ' ') {
        currentTime += LETTER_SPACE / 1000;
      } else if (symbol === '/') {
        currentTime += WORD_SPACE / 1000;
      }
    }
  }, []);

  return { playMorseCode };
}
