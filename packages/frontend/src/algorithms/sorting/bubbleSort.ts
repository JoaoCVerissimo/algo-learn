import type { SortingStep, AlgorithmGenerator } from "../types";

export function* bubbleSort(inputArray: number[]): AlgorithmGenerator<SortingStep> {
  const arr = [...inputArray];
  const sorted: number[] = [];
  let stepId = 0;

  yield {
    id: stepId++,
    type: "init",
    description: "Initial array state",
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [],
  };

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      yield {
        id: stepId++,
        type: "compare",
        description: `Compare arr[${j}]=${arr[j]} with arr[${j + 1}]=${arr[j + 1]}`,
        array: [...arr],
        comparing: [j, j + 1],
        swapping: null,
        sorted: [...sorted],
      };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield {
          id: stepId++,
          type: "swap",
          description: `Swap arr[${j}] and arr[${j + 1}]`,
          array: [...arr],
          comparing: null,
          swapping: [j, j + 1],
          sorted: [...sorted],
        };
      }
    }
    sorted.push(arr.length - 1 - i);
  }
  sorted.push(0);

  yield {
    id: stepId++,
    type: "done",
    description: "Array is sorted!",
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [...sorted],
  };
}
