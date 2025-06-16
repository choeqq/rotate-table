export interface TableResult {
  isValid: boolean;
  rotatedData: number[];
}

function rotateMatrixKSteps(matrix: number[][], steps: number): void {
  if (!matrix || matrix.length === 0) {
    return;
  }

  const n = matrix.length;

  if (n === 1) {
    return;
  }

  for (let ring = 0; ring < Math.floor(n / 2); ring++) {
    const first = ring;
    const last = n - 1 - ring;

    const ringElements: number[] = [];

    for (let i = first; i < last; i++) {
      ringElements.push(matrix[first][i]);
    }

    for (let i = first; i < last; i++) {
      ringElements.push(matrix[i][last]);
    }

    for (let i = last; i > first; i--) {
      ringElements.push(matrix[last][i]);
    }

    for (let i = last; i > first; i--) {
      ringElements.push(matrix[i][first]);
    }

    if (ringElements.length > 0) {
      const effectiveSteps = steps % ringElements.length;
      if (effectiveSteps > 0) {
        const elementsToMove = ringElements.splice(-effectiveSteps);
        ringElements.unshift(...elementsToMove);
      }
    }

    let idx = 0;

    for (let i = first; i < last; i++) {
      matrix[first][i] = ringElements[idx++];
    }

    for (let i = first; i < last; i++) {
      matrix[i][last] = ringElements[idx++];
    }

    for (let i = last; i > first; i--) {
      matrix[last][i] = ringElements[idx++];
    }

    for (let i = last; i > first; i--) {
      matrix[i][first] = ringElements[idx++];
    }
  }
}

export function parseTable(jsonString: string, steps: number = 1): TableResult {
  try {
    const nums: number[] = JSON.parse(jsonString);

    if (!Array.isArray(nums) || nums.length === 0) {
      return { isValid: false, rotatedData: [] };
    }

    const size = Math.sqrt(nums.length);
    if (!Number.isInteger(size)) {
      return { isValid: false, rotatedData: [] };
    }

    const matrix: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        row.push(nums[i * size + j]);
      }
      matrix.push(row);
    }

    rotateMatrixKSteps(matrix, steps);

    const rotatedData: number[] = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        rotatedData.push(matrix[i][j]);
      }
    }

    return { isValid: true, rotatedData };
  } catch (error) {
    return { isValid: false, rotatedData: [] };
  }
}
