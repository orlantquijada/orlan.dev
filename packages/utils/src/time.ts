const SECOND = 1000;
const MINUTE = 60 * SECOND;

export interface asMillisecondsParams {
  minutes?: number;
  seconds?: number;
}

export function asMilliseconds({
  seconds = 0,
  minutes = 0,
}: asMillisecondsParams) {
  return seconds * SECOND + minutes * MINUTE;
}
