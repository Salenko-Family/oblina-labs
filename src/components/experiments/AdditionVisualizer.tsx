import { useState } from "react";
import { traceAddition } from "../../labs/tracers/traceAddition";
import { columnAddition } from "../../labs/01-long-ar-sum";

interface Props {
  strA: string;
  strB: string;
}

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
        style={{
          display: "inline-block",
          width: "1ch",
          backgroundColor:
            index === activeColumnIndex ? "#d9ff66" : "transparent",
        }}
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
      <span
        key={index}
        style={{
          display: "inline-block",
          width: "1ch",
        }}
      >
        {digit}
      </span>
    ));
  };

  const generateButtonHandler = () => {
    const generatedFirstNumber = String(Math.floor(Math.random() * 10000));
    const generatedSecondNumber = String(Math.floor(Math.random() * 10000));

    setFirstNumber(generatedFirstNumber);
    setSecondNumber(generatedSecondNumber);
    setSteps([]);
    setResult(null);
    setCurrentStepIndex(0);
  };

  const inputExampleButtonHandler = (firstNum: string, secondNum: string) => {
    setFirstNumber(firstNum);
    setSecondNumber(secondNum);
    setSteps([]);
    setResult(null);
    setCurrentStepIndex(0);
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

  const nextButtonHandler = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const backButtonHandler = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          Перше число
          <input
            type="text"
            value={firstNumber}
            inputMode="numeric"
            onChange={(event) => {
              const value = event.target.value;

              if (/^\d*$/.test(value)) {
                setFirstNumber(value);
                setCurrentStepIndex(0);
                setSteps([]);
                setResult(null);
              }
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          Друге число
          <input
            type="text"
            value={secondNumber}
            inputMode="numeric"
            onChange={(event) => {
              const value = event.target.value;

              if (/^\d*$/.test(value)) {
                setSecondNumber(value);
                setCurrentStepIndex(0);
                setSteps([]);
                setResult(null);
              }
            }}
          />
        </label>
      </div>
      <button
        type="button"
        onClick={runButtonHandler}
        disabled={firstNumber === "" || secondNumber === ""}
      >
        Виконати
      </button>
      <button type="button" onClick={generateButtonHandler}>
        Згенерувати
      </button>
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          flexDirection: "column",
        }}
      >
        <p>Приклади</p>
        <button onClick={() => inputExampleButtonHandler("95", "5")}>
          95 + 5
        </button>
        <button onClick={() => inputExampleButtonHandler("500", "500")}>
          500 + 500
        </button>
        <button onClick={() => inputExampleButtonHandler("999999", "1")}>
          999999 + 1
        </button>
      </div>
      {steps.length > 0 && currentStep && (
        <>
          <p>
            Крок {currentStepIndex + 1} із {steps.length}
          </p>
          <div
            style={{
              whiteSpace: "pre",
              fontFamily: "monospace",
              fontSize: "28px",
              lineHeight: "1.4",
              width: "fit-content",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                lineHeight: "1.4",
                color: "#666",
                minHeight: "1.4em",
              }}
            >
              {" "}
              {renderCarry()}
            </div>
            <div> {renderNumber(firstNumber)}</div>
            <div>+{renderNumber(secondNumber)}</div>
            <div>{"-".repeat(columnWidth + 1)}</div>
            <div> {visiblePartialResult}</div>
          </div>
          <p>
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={backButtonHandler}
              disabled={currentStepIndex === 0}
            >
              Назад
            </button>
            <input
              type="range"
              min={0}
              max={steps.length - 1}
              value={currentStepIndex}
              onChange={(event) => {
                setCurrentStepIndex(Number(event.target.value));
              }}
            />
            <button
              onClick={nextButtonHandler}
              disabled={currentStepIndex === steps.length - 1}
            >
              Далі
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdditionVisualizer;
