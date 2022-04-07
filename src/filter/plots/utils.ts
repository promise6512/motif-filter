import { bisectLeft } from 'd3-array';
import Decimal from 'decimal.js';
export const getDecimalPrecisionCount = (float: number): number => {
  const decimal = new Decimal(float);
  return decimal.e;
};

export function preciseRound(num: number, decimals: number): string {
  const t = 10 ** decimals;
  return (
    Math.round(
      num * t +
        (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / 100 ** decimals)),
    ) / t
  ).toFixed(decimals);
}

export function getRoundingDecimalFromStep(step: number) {
  const splitZero = step.toString().split('.');
  if (splitZero.length === 1) {
    return 0;
  }
  return splitZero[1].length;
}

export function roundValToStep(minValue: number, step: number, val: number) {
  if (!Number.isFinite(step) || !Number.isFinite(minValue)) {
    return val;
  }

  const decimal = getRoundingDecimalFromStep(step);
  const steps = Math.floor((val - minValue) / step);
  let remain = val - (steps * step + minValue);

  // has to round because javascript turns 0.1 into 0.9999999999999987
  remain = Number(preciseRound(remain, 8));

  let closest;
  if (remain === 0) {
    closest = val;
  } else if (remain < step / 2) {
    closest = steps * step + minValue;
  } else {
    closest = (steps + 1) * step + minValue;
  }

  // precise round return a string rounded to the defined decimal
  const rounded = preciseRound(closest, decimal);

  return Number(rounded);
}

export function snapToMarks(value: number, marks: number[]) {
  // always use bin x0
  const i = bisectLeft(marks, value);
  if (i === 0) {
    return marks[i];
  }
  if (i === marks.length) {
    return marks[i - 1];
  }
  const idx = marks[i] - value < value - marks[i - 1] ? i : i - 1;
  return marks[idx];
}

/**
 * If marks is provided, snap to marks, if not normalize to step
 * @type {typeof import('./data-utils').normalizeSliderValue}
 * @param val
 * @param minValue
 * @param step
 * @param marks
 */
 export function normalizeSliderValue(
  val: number,
  minValue: number,
  step: number,
  marks?: number[],
) {
  if (marks && marks.length) {
    return snapToMarks(val, marks);
  }

  return roundValToStep(minValue, step, val);
}