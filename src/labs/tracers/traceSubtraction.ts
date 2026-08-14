interface SubtractionStep {
  digitA: number;
  digitB: number;
  borrowIn: number;
  rawDiff: number;
  resultDigit: number;
  borrowOut: number;
  partialResult: string;
}

export const traceSubtraction = (
  strA: string,
  strB: string,
): SubtractionStep[] => {
  const steps: SubtractionStep[] = [];

  let i = strA.length - 1;
  let j = strB.length - 1;
  let borrow = 0;
  let partialResult = "";

  while (i >= 0) {
    const digitA = Number(strA[i]);
    const digitB = j >= 0 ? Number(strB[j]) : 0;

    const borrowIn = borrow;
    const rawDiff = digitA - digitB - borrowIn;

    let resultDigit = rawDiff;
    let borrowOut = 0;

    if (resultDigit < 0) {
      resultDigit += 10;
      borrowOut = 1;
    }

    partialResult += resultDigit;

    steps.push({
      digitA,
      digitB,
      borrowIn,
      rawDiff,
      resultDigit,
      borrowOut,
      partialResult,
    });

    borrow = borrowOut;
    i--;
    j--;
  }

  return steps;
};
