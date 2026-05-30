export function range(startOrEnd: number, end?: number, step = 1) {
  const output: number[] = [];
  const start = typeof end === "undefined" ? 0 : startOrEnd;
  const stop = typeof end === "undefined" ? startOrEnd : end;

  for (let i = start; i < stop; i += step) {
    output.push(i);
  }

  return output;
}
