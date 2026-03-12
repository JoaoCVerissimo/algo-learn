import { useState, useEffect, useRef, useCallback } from "react";
import type { BaseStep, AlgorithmGenerator } from "@algo-learn/shared";

interface UseVisualizationReturn<S extends BaseStep> {
  steps: S[];
  currentStep: S | null;
  currentIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  goToStep: (index: number) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
  initialize: (generator: AlgorithmGenerator<S>) => void;
}

export function useVisualization<S extends BaseStep>(): UseVisualizationReturn<S> {
  const [steps, setSteps] = useState<S[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef<number>(undefined);

  const initialize = useCallback((generator: AlgorithmGenerator<S>) => {
    const allSteps: S[] = [];
    let result = generator.next();
    while (!result.done) {
      allSteps.push(result.value);
      result = generator.next();
    }
    setSteps(allSteps);
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying && currentIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex((i) => {
          if (i >= steps.length - 1) {
            setIsPlaying(false);
            return i;
          }
          return i + 1;
        });
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length, currentIndex]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const stepForward = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToStep = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  return {
    steps,
    currentStep: steps[currentIndex] ?? null,
    currentIndex,
    totalSteps: steps.length,
    isPlaying,
    speed,
    play,
    pause,
    togglePlay,
    stepForward,
    stepBackward,
    goToStep,
    setSpeed,
    reset,
    initialize,
  };
}
