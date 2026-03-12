import { create } from "zustand";
import type { BaseStep } from "@algo-learn/shared";

interface VisualizationStore {
  steps: BaseStep[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number;

  setSteps: (steps: BaseStep[]) => void;
  setCurrentIndex: (index: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
}

export const useVisualizationStore = create<VisualizationStore>((set, get) => ({
  steps: [],
  currentIndex: 0,
  isPlaying: false,
  speed: 500,

  setSteps: (steps) => set({ steps, currentIndex: 0, isPlaying: false }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  stepForward: () => {
    const { currentIndex, steps } = get();
    if (currentIndex < steps.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },
  stepBackward: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setSpeed: (speed) => set({ speed }),
  reset: () => set({ currentIndex: 0, isPlaying: false }),
}));
