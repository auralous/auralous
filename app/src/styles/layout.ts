import { ArrayElement } from "utils/types";

const sizeUnitValues = [0, 1, 2, 4, 8, 10, 12, 16] as const; // x4

function buildSizes() {
  const values = {} as Record<ArrayElement<typeof sizeUnitValues>, number>;
  for (const sizeUnitValue of sizeUnitValues)
    values[sizeUnitValue] = sizeUnitValue * 4;
  return values;
}

export const Size = buildSizes();
