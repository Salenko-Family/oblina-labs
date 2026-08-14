import { useState, type ChangeEvent } from "react";
import { traceSubtraction } from "../../../labs/tracers/traceSubtraction";
import ArithmeticPlayground from "../shared/ArithmeticPlayground";
import PresetButtons, { type ArithmeticPreset } from "../shared/PresetButtons";
import styles from "./SubtractionVisualizer.module.css";
import StepNavigation from "../shared/StepNavigation";

interface Props {
  strA: string;
  strB: string;
}

const SUBTRACTION_PRESETS: ArithmeticPreset[] = [
  {
    label: "12 − 5",
    firstNumber: "12",
    secondNumber: "5",
  },
  {
    label: "1000 − 1",
    firstNumber: "1000",
    secondNumber: "1",
  },
  {
    label: "55555 − 12349",
    firstNumber: "55555",
    secondNumber: "12349",
  },
  {
    label: "Дуже довгі числа",
    firstNumber: "98765432109",
    secondNumber: "12345678901",
  },
];

const normalizeNumber = (value: string): string => {
  return value.replace(/^0+/, "") || "0";
};

const isFirstNumberSmaller = (
  firstNumber: string,
  secondNumber: string,
): boolean => {
  if (firstNumber.length !== secondNumber.length) {
    return firstNumber.length < secondNumber.length;
  }

  return firstNumber < secondNumber;
};

const generateRandomNumbers = (): [string, string] => {
  const firstRandomNumber = Math.floor(Math.random() * 1_000_000);
  const secondRandomNumber = Math.floor(Math.random() * 1_000_000);
  const largerNumber = Math.max(firstRandomNumber, secondRandomNumber);
  const smallerNumber = Math.min(firstRandomNumber, secondRandomNumber);

  return [String(largerNumber), String(smallerNumber)];
};

const SubtractionVisualizer = ({ strA, strB }: Props) => {
  const [firstNumber, setFirstNumber] = useState(strA);
  const [secondNumber, setSecondNumber] = useState(strB);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<ReturnType<typeof traceSubtraction>>([]);
  const [error, setError] = useState<string | null>(null);

  const currentStep = steps[currentStepIndex];

  const columnWidth = Math.max(firstNumber.length, secondNumber.length);

  const activeColumnIndex = columnWidth - 1 - currentStepIndex;

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStepIndex(0);
    setError(null);
  };

  const reversedPartialResult = currentStep
    ? currentStep.partialResult.split("").reverse().join("")
    : "";

  const isLastStep = currentStepIndex === steps.length - 1;

  const displayedResult = isLastStep
    ? reversedPartialResult.replace(/^0+/, "") || "0"
    : reversedPartialResult;

  const visiblePartialResult = displayedResult.padStart(columnWidth, " ");

  const renderNumber = (number: string) => {
    const alignedNumber = number.padStart(columnWidth, " ");

    return alignedNumber.split("").map((digit, index) => (
      <span
        key={index}
        className={`${styles.digit} ${
          index === activeColumnIndex ? styles.activeDigit : ""
        }`}
      >
        {digit}
      </span>
    ));
  };

  const renderBorrow = () => {
    const borrowRow = Array(columnWidth).fill("");

    if (currentStep?.borrowOut > 0 && activeColumnIndex > 0) {
      borrowRow[activeColumnIndex - 1] = "−1";
    }

    return borrowRow.map((value, index) => (
      <span key={index} className={styles.borrowDigit}>
        {value && <span className={styles.borrowMark}>{value}</span>}
      </span>
    ));
  };

  const firstNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      setFirstNumber(value);
      resetVisualization();
    }
  };

  const secondNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      setSecondNumber(value);
      resetVisualization();
    }
  };

  const generateButtonHandler = () => {
    const generatedNumbers = generateRandomNumbers();

    const generatedFirstNumber = generatedNumbers[0];
    const generatedSecondNumber = generatedNumbers[1];

    setFirstNumber(generatedFirstNumber);
    setSecondNumber(generatedSecondNumber);
    resetVisualization();
  };

  const presetSelectHandler = (firstValue: string, secondValue: string) => {
    setFirstNumber(firstValue);
    setSecondNumber(secondValue);
    resetVisualization();
  };

  const runButtonHandler = () => {
    if (firstNumber === "" || secondNumber === "") {
      return;
    }

    const normalizedFirstNumber = normalizeNumber(firstNumber);
    const normalizedSecondNumber = normalizeNumber(secondNumber);

    if (isFirstNumberSmaller(normalizedFirstNumber, normalizedSecondNumber)) {
      setSteps([]);
      setCurrentStepIndex(0);
      setError("Перше число має бути не меншим за друге.");
      return;
    }

    const newSteps = traceSubtraction(
      normalizedFirstNumber,
      normalizedSecondNumber,
    );

    setFirstNumber(normalizedFirstNumber);
    setSecondNumber(normalizedSecondNumber);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setError(null);
  };

  const isRunButtonDisabled = firstNumber === "" || secondNumber === "";

  return (
    <ArithmeticPlayground
      title="Віднімання стовпчиком"
      description="Введіть два числа або виберіть готовий приклад."
    >
      <div className={styles.numberFields}>
        <label className={styles.numberLabel}>
          Перше число
          <input
            type="text"
            value={firstNumber}
            inputMode="numeric"
            onChange={firstNumberChangeHandler}
          />
        </label>

        <label className={styles.numberLabel}>
          Друге число
          <input
            type="text"
            value={secondNumber}
            inputMode="numeric"
            onChange={secondNumberChangeHandler}
          />
        </label>
      </div>

      <button
        className={styles.runButton}
        type="button"
        onClick={runButtonHandler}
        disabled={isRunButtonDisabled}
      >
        Порахувати
      </button>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <PresetButtons
        presets={SUBTRACTION_PRESETS}
        onGenerate={generateButtonHandler}
        onSelect={presetSelectHandler}
      />
      {currentStep && (
        <section className={styles.result}>
          <div className={styles.calculationPanel}>
            <div className={styles.calculation}>
              <div className={styles.borrowRow}> {renderBorrow()}</div>
              <div> {renderNumber(firstNumber)}</div>
              <div>−{renderNumber(secondNumber)}</div>
              <div>{"-".repeat(columnWidth + 1)}</div>
              <div> {visiblePartialResult}</div>
            </div>
          </div>

          <div className={styles.stepPanel}>
            <div className={styles.stepContent}>
              <p className={styles.stepBadge}>
                Крок {currentStepIndex + 1} із {steps.length}
              </p>

              <p className={styles.stepExplanation}>
                {currentStep.digitA} − {currentStep.digitB}
                {currentStep.borrowIn > 0 ? " − 1 позиченого" : ""}
                {" = "}
                {currentStep.rawDiff}.
                {currentStep.borrowOut > 0
                  ? ` Позичаємо десяток: ${currentStep.rawDiff} + 10 = ${currentStep.resultDigit}.`
                  : ` Записуємо ${currentStep.resultDigit}.`}
              </p>
            </div>

            <StepNavigation
              currentStepIndex={currentStepIndex}
              stepsCount={steps.length}
              onStepChange={setCurrentStepIndex}
            />
          </div>
        </section>
      )}
    </ArithmeticPlayground>
  );
};

export default SubtractionVisualizer;
