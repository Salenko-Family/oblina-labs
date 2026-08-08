interface AdditionStep {
  digitA: number;
  digitB: number;
  carryIn: number;
  sum: number;
  resultDigit: number;
  carryOut: number;
  partialResult: string;
}

export const traceAddition = (strA: string, strB: string): AdditionStep[] => {
  const steps: AdditionStep[] = [];

  let i = strA.length - 1;
  let j = strB.length - 1;
  let carry = 0;
  let result = "";

  while (i >= 0 || j >= 0 || carry !== 0) {
    const digitA = i >= 0 ? Number(strA[i]) : 0;
    const digitB = j >= 0 ? Number(strB[j]) : 0;

    const carryIn = carry;
    const sum = digitA + digitB + carryIn;
    const resultDigit = sum % 10;
    const carryOut = Math.floor(sum / 10);

    result += resultDigit;

    steps.push({
      digitA,
      digitB,
      carryIn,
      sum,
      resultDigit,
      carryOut,
      partialResult: result,
    });

    carry = carryOut;

    i--;
    j--;
  }

  return steps;
};

// console.log(traceAddition("95", "5"));
console.log(traceAddition("35", "68"));
