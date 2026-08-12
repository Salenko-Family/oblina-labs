import { useState, type ChangeEvent } from "react";
import { traceAddition } from "../../../labs/tracers/traceAddition";
import { columnAddition } from "../../../labs/01-long-ar-sum";
import styles from "./AdditionVisualizer.module.css";
import ArithmeticPlayground from "../shared/ArithmeticPlayground";
import PresetButtons, { type ArithmeticPreset } from "../shared/PresetButtons";
import StepNavigation from "../shared/StepNavigation";

interface Props {
  strA: string;
  strB: string;
}

const generateRandomNumber = (max: number): string => {
  return String(Math.floor(Math.random() * max));
};

const PRESETS: ArithmeticPreset[] = [
  {
    label: "95 + 5",
    firstNumber: "95",
    secondNumber: "5",
  },
  {
    label: "500 + 500",
    firstNumber: "500",
    secondNumber: "500",
  },
  {
    label: "999999 + 1",
    firstNumber: "999999",
    secondNumber: "1",
  },
  {
    label: "Дуже довгі числа",
    firstNumber: "59372051294",
    secondNumber: "94729473914",
  },
];

const AdditionVisualizer = ({ strA, strB }: Props) => {
  const [firstNumber, setFirstNumber] = useState(strA);
  const [secondNumber, setSecondNumber] = useState(strB);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<ReturnType<typeof traceAddition>>([]);
  const [result, setResult] = useState<string | null>(null);

  const currentStep = steps[currentStepIndex];

  const columnWidth = Math.max(
    firstNumber.length,
    secondNumber.length,
    result?.length ?? 0,
  );

  const resetVisualization = () => {
    setSteps([]);
    setResult(null);
    setCurrentStepIndex(0);
  };

  const visiblePartialResult = currentStep
    ? currentStep.partialResult
        .split("")
        .reverse()
        .join("")
        .padStart(columnWidth, " ")
    : "";

  const activeColumnIndex = columnWidth - 1 - currentStepIndex;

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

  const renderCarry = () => {
    const carryRow = Array(columnWidth).fill(" ");

    if (currentStep?.carryOut > 0 && activeColumnIndex > 0) {
      carryRow[activeColumnIndex - 1] = String(currentStep.carryOut);
    }

    return carryRow.map((digit, index) => (
      <span key={index} className={styles.digit}>
        {digit}
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
    setFirstNumber(generateRandomNumber(10000000000));
    setSecondNumber(generateRandomNumber(10000000000));
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

    const newSteps = traceAddition(firstNumber, secondNumber);
    const newResult = columnAddition(firstNumber, secondNumber);

    setSteps(newSteps);
    setResult(newResult);
    setCurrentStepIndex(0);
  };

  return (
    <ArithmeticPlayground
      title="Додавання стовпчиком"
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
        disabled={firstNumber === "" || secondNumber === ""}
      >
        Порахувати
      </button>
      <PresetButtons
        presets={PRESETS}
        onGenerate={generateButtonHandler}
        onSelect={presetSelectHandler}
      />
      {steps.length > 0 && currentStep && (
        <section className={styles.result}>
          <div className={styles.calculationPanel}>
            <div className={styles.calculation}>
              <div className={styles.carryRow}> {renderCarry()}</div>

              <div> {renderNumber(firstNumber)}</div>
              <div>+{renderNumber(secondNumber)}</div>
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
                {currentStep.digitA} + {currentStep.digitB}
                {currentStep.carryIn > 0
                  ? ` + ${currentStep.carryIn} переносу`
                  : ""}
                {" = "}
                {currentStep.sum}. Записуємо {currentStep.resultDigit}.
                {currentStep.carryOut > 0
                  ? ` ${currentStep.carryOut} переносимо в наступний розряд.`
                  : " Нового переносу немає."}
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

export default AdditionVisualizer;
