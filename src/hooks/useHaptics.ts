import { useState, useEffect } from 'react';

interface HapticOptions {
  enabled?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

export const useHaptics = (options: HapticOptions = {}) => {
  const { enabled = true, intensity = 'medium' } = options;
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if haptic feedback is supported
    const checkSupport = () => {
      if ('vibrate' in navigator) {
        setIsSupported(true);
      } else {
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  const triggerHaptic = (pattern?: number | number[]) => {
    if (!enabled || !isSupported) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let vibrationPattern: number | number[];

    if (pattern) {
      vibrationPattern = pattern;
    } else {
      // Default patterns based on intensity
      switch (intensity) {
        case 'light':
          vibrationPattern = 10;
          break;
        case 'medium':
          vibrationPattern = 50;
          break;
        case 'heavy':
          vibrationPattern = [100, 50, 100];
          break;
        default:
          vibrationPattern = 50;
      }
    }

    try {
      navigator.vibrate(vibrationPattern);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  };

  const hapticClick = () => triggerHaptic(10);
  const hapticHover = () => triggerHaptic(5);
  const hapticSuccess = () => triggerHaptic([50, 25, 50]);
  const hapticError = () => triggerHaptic([100, 50, 100, 50, 100]);

  return {
    isSupported,
    triggerHaptic,
    hapticClick,
    hapticHover,
    hapticSuccess,
    hapticError,
  };
};

// Hook for sound effects (optional)
export const useSound = (options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if audio context is supported
    const checkSupport = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        setIsSupported(!!AudioContext);
      } catch (e) {
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  const playSound = (frequency: number, duration: number = 0.1) => {
    if (!enabled || !isSupported) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Sound effect failed:', error);
    }
  };

  const soundClick = () => playSound(800, 0.1);
  const soundHover = () => playSound(600, 0.05);
  const soundSuccess = () => playSound(1000, 0.2);
  const soundError = () => playSound(200, 0.3);

  return {
    isSupported,
    playSound,
    soundClick,
    soundHover,
    soundSuccess,
    soundError,
  };
};
