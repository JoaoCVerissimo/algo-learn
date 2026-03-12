import { useEffect } from "react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentIndex: number;
  totalSteps: number;
  speed: number;
  description: string;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onGoToStep: (index: number) => void;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
}

export function PlaybackControls({
  isPlaying,
  currentIndex,
  totalSteps,
  speed,
  description,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onGoToStep,
  onSetSpeed,
  onReset,
}: PlaybackControlsProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          if (isPlaying) { onPause(); } else { onPlay(); }
          break;
        case "ArrowRight":
          e.preventDefault();
          onStepForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onStepBackward();
          break;
        case "r":
          onReset();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPlaying, onPlay, onPause, onStepForward, onStepBackward, onReset]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Step description */}
      <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-700 min-h-[2rem]">
        {description || "Ready"}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentIndex}
          onChange={(e) => onGoToStep(parseInt(e.target.value, 10))}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Step {currentIndex + 1}</span>
          <span>of {totalSteps}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition"
          >
            Reset
          </button>
          <button
            onClick={onStepBackward}
            disabled={currentIndex <= 0}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded text-sm font-medium transition"
          >
            Prev
          </button>
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={onStepForward}
            disabled={currentIndex >= totalSteps - 1}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded text-sm font-medium transition"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Speed:</label>
          <select
            value={speed}
            onChange={(e) => onSetSpeed(parseInt(e.target.value, 10))}
            className="rounded border-gray-300 bg-white px-2 py-1 text-xs border"
          >
            <option value={1000}>0.5x</option>
            <option value={500}>1x</option>
            <option value={250}>2x</option>
            <option value={100}>5x</option>
            <option value={50}>10x</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Space: play/pause | Arrow keys: step | R: reset
      </p>
    </div>
  );
}
