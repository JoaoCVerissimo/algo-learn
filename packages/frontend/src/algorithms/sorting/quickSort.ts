import type { SortingStep, AlgorithmGenerator } from "../types";

export function* quickSort(inputArray: number[]): AlgorithmGenerator<SortingStep> {
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

  function* sort(low: number, high: number): AlgorithmGenerator<SortingStep> {
    if (low >= high) {
      if (low === high) sorted.push(low);
      return;
    }

    const pivot = arr[high];
    yield {
      id: stepId++,
      type: "pivot",
      description: `Choose pivot = arr[${high}] = ${pivot}`,
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: [...sorted],
      pivot: high,
    };

    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield {
        id: stepId++,
        type: "compare",
        description: `Compare arr[${j}]=${arr[j]} with pivot=${pivot}`,
        array: [...arr],
        comparing: [j, high],
        swapping: null,
        sorted: [...sorted],
        pivot: high,
      };

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          yield {
            id: stepId++,
            type: "swap",
            description: `Swap arr[${i}] and arr[${j}]`,
            array: [...arr],
            comparing: null,
            swapping: [i, j],
            sorted: [...sorted],
            pivot: high,
          };
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pi = i + 1;
    sorted.push(pi);

    yield {
      id: stepId++,
      type: "partition",
      description: `Place pivot at position ${pi}`,
      array: [...arr],
      comparing: null,
      swapping: [pi, high],
      sorted: [...sorted],
      pivot: pi,
    };

    yield* sort(low, pi - 1);
    yield* sort(pi + 1, high);
  }

  yield* sort(0, arr.length - 1);

  yield {
    id: stepId++,
    type: "done",
    description: "Array is sorted!",
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: arr.map((_, i) => i),
  };
}
