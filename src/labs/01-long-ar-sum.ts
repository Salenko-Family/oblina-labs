const columnAddition = (strA: string, strB: string) => {
  let i = strA.length - 1;
  let j = strB.length - 1;
  let carry = 0;
  let result = "";

  while (i >= 0 || j >= 0 || carry !== 0) {
    const digitA = i >= 0 ? Number(strA[i]) : 0;
    const digitB = j >= 0 ? Number(strB[j]) : 0;

    const sum = digitA + digitB + carry;

    result += sum % 10;
    carry = Math.floor(sum / 10);

    i--;
    j--;
  }

  return result.split("").reverse().join("");
};

const test = (name: string, actual: string, expected: string): void => {
  if (actual === expected) {
    console.log(`✅ ${name}`);
  } else {
    console.log(`❌ ${name}: очікували "${expected}", отримали "${actual}"`);
  }
};

test("результат має нуль усередині", columnAddition("95", "5"), "100");

test(
  "перенос з'являється лише в останньому стовпчику",
  columnAddition("500", "500"),
  "1000",
);

test(
  "багато нулів усередині чисел",
  columnAddition("1000000001", "1000000009"),
  "2000000010",
);

test(
  "числа однакової довжини без переносу",
  columnAddition("11111", "22222"),
  "33333",
);

test(
  "числа однакової довжини з фінальним переносом",
  columnAddition("55555", "55555"),
  "111110",
);

test(
  "довжини чисел дуже відрізняються",
  columnAddition("1", "1000000000000000000000000000000"),
  "1000000000000000000000000000001",
);

test(
  "дуже велике число плюс нуль",
  columnAddition("9876543210987654321098765432109876543210", "0"),
  "9876543210987654321098765432109876543210",
);

test(
  "два дуже великі числа",
  columnAddition(
    "123456789012345678901234567890",
    "987654321098765432109876543210",
  ),
  "1111111110111111111011111111100",
);
