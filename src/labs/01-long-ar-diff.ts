export const columnSubtraction = (strA: string, strB: string) => {
  let i = strA.length - 1;
  let j = strB.length - 1;
  let borrow = 0;
  let result = "";

  while (i >= 0) {
    const digitA = Number(strA[i]);
    const digitB = j >= 0 ? Number(strB[j]) : 0;

    let diff = digitA - digitB - borrow;

    if (diff < 0) {
      diff += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    result += diff;

    i--;
    j--;
  }

  const resultWithoutZero = result
    .split("")
    .reverse()
    .join("")
    .replace(/^0+/, "");

  return resultWithoutZero || "0";
};

const test2 = (name: string, actual: string, expected: string): void => {
  if (actual === expected) {
    console.log(`✅ ${name}`);
  } else {
    console.log(`❌ ${name}: очікували "${expected}", отримали "${actual}"`);
  }
};

test2("віднімає нуль", columnSubtraction("5", "0"), "5");

test2("віднімає однакові числа", columnSubtraction("5", "5"), "0");

test2("просте віднімання без позичання", columnSubtraction("95", "5"), "90");

test2("віднімання з одним позичанням", columnSubtraction("12", "5"), "7");

test2(
  "віднімання з кількома позичаннями",
  columnSubtraction("1000", "1"),
  "999",
);

test2(
  "позичання проходить через нулі",
  columnSubtraction("10000", "9"),
  "9991",
);

test2(
  "числа однакової довжини без позичання",
  columnSubtraction("98765", "12345"),
  "86420",
);

test2(
  "числа однакової довжини з позичанням",
  columnSubtraction("55555", "12349"),
  "43206",
);

test2("друге число коротше", columnSubtraction("12345", "67"), "12278");

test2(
  "результат містить нулі всередині",
  columnSubtraction("1010", "10"),
  "1000",
);

test2(
  "у результаті треба прибрати початкові нулі",
  columnSubtraction("1005", "1000"),
  "5",
);

test2(
  "дуже велике число мінус один",
  columnSubtraction("1000000000000000000000000000000", "1"),
  "999999999999999999999999999999",
);

test2(
  "віднімання дуже великих чисел",
  columnSubtraction(
    "987654321098765432109876543210",
    "123456789012345678901234567890",
  ),
  "864197532086419753208641975320",
);
