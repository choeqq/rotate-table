import { parseTable } from "../src/rotate-table";

describe("parseTable", () => {
  test("rotates 3x3 matrix correctly", () => {
    const input = "[1,2,3,4,5,6,7,8,9]";
    const result = parseTable(input);
    expect(result.isValid).toBe(true);
    expect(result.rotatedData).toEqual([4, 1, 2, 7, 5, 3, 8, 9, 6]);
  });

  test("rotates 2x2 matrix correctly", () => {
    const input = "[40,20,90,10]";
    const result = parseTable(input);
    expect(result.isValid).toBe(true);
    expect(result.rotatedData).toEqual([90, 40, 10, 20]);
  });

  test("handles 1x1 matrix", () => {
    const input = "[-5]";
    const result = parseTable(input);
    expect(result.isValid).toBe(true);
    expect(result.rotatedData).toEqual([-5]);
  });

  test("rejects non-square arrays", () => {
    const inputs = ["[2,-0]", "[2,-5,-5]", "[1,1,1,1,1]"];
    inputs.forEach((input) => {
      const result = parseTable(input);
      expect(result.isValid).toBe(false);
      expect(result.rotatedData).toEqual([]);
    });
  });

  test("handles 4x4 matrix", () => {
    const input = "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]";
    const result = parseTable(input);
    expect(result.isValid).toBe(true);
    expect(result.rotatedData).toEqual([
      5, 1, 2, 3, 9, 10, 6, 4, 13, 11, 7, 8, 14, 15, 16, 12,
    ]);
  });

  test("supports multi-step rotation", () => {
    const input = "[1,2,3,4,5,6,7,8,9]";
    const result = parseTable(input, 2);
    expect(result.isValid).toBe(true);
    expect(result.rotatedData).toEqual([7, 4, 1, 8, 5, 2, 9, 6, 3]);
  });

  test("handles malformed JSON", () => {
    const result = parseTable("invalid json");
    expect(result.isValid).toBe(false);
    expect(result.rotatedData).toEqual([]);
  });

  test("handles empty array", () => {
    const result = parseTable("[]");
    expect(result.isValid).toBe(false);
    expect(result.rotatedData).toEqual([]);
  });

  test("handles non-array input", () => {
    const result = parseTable("42");
    expect(result.isValid).toBe(false);
    expect(result.rotatedData).toEqual([]);
  });

  test("handles very large matrices efficiently", () => {
    const size = 100;
    const elements = Array.from({ length: size * size }, (_, i) => i + 1);
    const input = JSON.stringify(elements);

    const start = Date.now();
    const result = parseTable(input);
    const duration = Date.now() - start;

    expect(result.isValid).toBe(true);
    expect(result.rotatedData).toHaveLength(size * size);
    expect(duration).toBeLessThan(100);
  });

  test("handles multiple rotation steps correctly", () => {
    const input = "[1,2,3,4]";

    const result1 = parseTable(input, 1);
    const result2 = parseTable(input, 2);
    const result4 = parseTable(input, 4);
    const result8 = parseTable(input, 8);

    expect(result1.rotatedData).toEqual([3, 1, 4, 2]);
    expect(result2.rotatedData).toEqual([4, 3, 2, 1]);
    expect(result4.rotatedData).toEqual([1, 2, 3, 4]);
    expect(result8.rotatedData).toEqual([1, 2, 3, 4]);
  });

  test("preserves center element in odd-sized matrices", () => {
    const inputs = [
      { input: "[1]", expected: [1] },
      { input: "[1,2,3,4,5,6,7,8,9]", center: 5 },
      {
        input: JSON.stringify(Array.from({ length: 25 }, (_, i) => i + 1)),
        center: 13,
      },
    ];

    inputs.forEach(({ input, center }) => {
      const result = parseTable(input);
      expect(result.isValid).toBe(true);

      if (center !== undefined) {
        const size = Math.sqrt(result.rotatedData.length);
        const centerIndex = Math.floor(size / 2) * size + Math.floor(size / 2);
        expect(result.rotatedData[centerIndex]).toBe(center);
      }
    });
  });

  test("handles zero steps", () => {
    const input = "[1,2,3,4,5,6,7,8,9]";
    const original = parseTable(input, 0);

    expect(original.isValid).toBe(true);
    expect(original.rotatedData).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("validates ring traversal correctness", () => {
    const input = "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]";
    const result = parseTable(input);

    expect(result.isValid).toBe(true);
    expect(result.rotatedData).toHaveLength(16);

    const uniqueElements = new Set(result.rotatedData);
    expect(uniqueElements.size).toBe(16);

    const originalElements = new Set([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]);
    const resultElements = new Set(result.rotatedData);
    expect(resultElements).toEqual(originalElements);
  });
});
