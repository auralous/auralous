import type { ArrayElement } from "./types";

const sizeUnitValues = [
  0, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 12, 14, 16, 20, 24, 27, 32, 36, 40, 44, 48,
] as const; // x4

function buildSizes() {
  const values = {} as Record<ArrayElement<typeof sizeUnitValues>, number>;
  for (const sizeUnitValue of sizeUnitValues)
    values[sizeUnitValue] = sizeUnitValue * 4;
  return values;
}

export const LayoutSize = {
  sm: 640,
  md: 768,
  lg: 1024,
};

export const Size = buildSizes();
