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
});
