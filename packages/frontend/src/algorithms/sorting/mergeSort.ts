import type { SortingStep, AlgorithmGenerator } from "../types";

export function* mergeSort(inputArray: number[]): AlgorithmGenerator<SortingStep> {
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

  function* sort(left: number, right: number): AlgorithmGenerator<SortingStep> {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    yield {
      id: stepId++,
      type: "divide",
      description: `Divide: [${left}..${mid}] and [${mid + 1}..${right}]`,
      array: [...arr],
      comparing: [left, right],
      swapping: null,
      sorted: [...sorted],
      subarrays: {
        left: Array.from({ length: mid - left + 1 }, (_, i) => left + i),
        right: Array.from({ length: right - mid }, (_, i) => mid + 1 + i),
      },
    };

    yield* sort(left, mid);
    yield* sort(mid + 1, right);
    yield* merge(left, mid, right);
  }

  function* merge(left: number, mid: number, right: number): AlgorithmGenerator<SortingStep> {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      yield {
        id: stepId++,
        type: "compare",
        description: `Merge: compare ${leftArr[i]} with ${rightArr[j]}`,
        array: [...arr],
        comparing: [left + i, mid + 1 + j],
        swapping: null,
        sorted: [...sorted],
      };

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;

      yield {
        id: stepId++,
        type: "place",
        description: `Place ${arr[k - 1]} at position ${k - 1}`,
        array: [...arr],
        comparing: null,
        swapping: [k - 1, k - 1],
        sorted: [...sorted],
      };
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++; k++;
    }
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++; k++;
    }

    yield {
      id: stepId++,
      type: "merged",
      description: `Merged [${left}..${right}]`,
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: [...sorted],
    };
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
