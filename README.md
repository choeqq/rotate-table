# Table Rotation Engine

A TypeScript program that rotates square tables by shifting elements clockwise within concentric rings.

## Usage

```bash
npm run dev input.csv # prints to console
npm run dev input.csv > output.csv # writes to file
```

## Algorithm

The program processes flat arrays as square matrices and rotates each ring by 1 step clockwise:

1. **Validation**: Only perfect square arrays are valid (length = n²)
2. **Ring Processing**: Each concentric ring rotates independently
3. **Element Movement**: Last element of each ring moves to the front
4. **Center Handling**: Center element (for odd sizes) stays in place

## Input/Output Format

**Input CSV**: `id,json`
**Output CSV**: `id,json,is_valid`

Invalid tables (non-square arrays) return empty arrays with `is_valid: false`.

## Examples

- `[1,2,3,4,5,6,7,8,9]` (3×3) → `[4,1,2,7,5,3,8,9,6]`
- `[40,20,90,10]` (2×2) → `[90,40,10,20]`
- `[-5]` (1×1) → `[-5]`
- `[2,-5,-5]` (invalid) → `[]`

## Testing

Run unit tests:

```bash
npm test
```

Test with sample data:

```bash
npm run dev tests/test-data.csv
```

The implementation handles:

- Various table sizes (1×1, 2×2, 3×3, 4×4, etc.)
- Invalid inputs (non-square arrays, malformed JSON)
- Edge cases (empty arrays, single elements)
- Large datasets efficiently through streaming

## Architecture

- **CLI**: Streams CSV processing for memory efficiency
- **Parser**: Validates and converts 1D arrays to 2D matrices
- **Rotator**: Processes each ring independently
- **Output**: Converts back to 1D arrays for CSV format
