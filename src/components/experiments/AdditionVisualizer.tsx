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

  const safeFirstNumber = firstNumber || "0";
  const safeSecondNumber = secondNumber || "0";

  const steps = traceAddition(safeFirstNumber, safeSecondNumber);
  const result = columnAddition(safeFirstNumber, safeSecondNumber);
  const currentStep = steps[currentStepIndex];

  const columnWidth = Math.max(
    safeFirstNumber.length,
    safeSecondNumber.length,
    result.length,
  );

  const alignedFirstNumber = safeFirstNumber.padStart(columnWidth, " ");
  const alignedSecondNumber = safeSecondNumber.padStart(columnWidth, " ");

  const visiblePartialResult = currentStep.partialResult
    .split("")
    .reverse()
    .join("")
    .padStart(columnWidth, " ");

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
              }
            }}
          />
        </label>
      </div>
      {/* <h2>Result: {result}</h2> */}
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
        <div> {alignedFirstNumber}</div>
        <div>+{alignedSecondNumber}</div>
        <div>{"-".repeat(columnWidth + 1)}</div>
        <div> {visiblePartialResult}</div>
      </div>
      {/* <ul>
        <li>digitA: {currentStep.digitA}</li>
        <li>digitB: {currentStep.digitB}</li>
        <li>sum: {currentStep.sum}</li>
        <li>carryIn: {currentStep.carryIn}</li>
        <li>carryOut: {currentStep.carryOut}</li>
        <li>partialResult: {currentStep.partialResult}</li>
        <li>resultDigit: {currentStep.resultDigit}</li>
      </ul> */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button onClick={backButtonHandler} disabled={currentStepIndex === 0}>
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
    </div>
  );
};

export default AdditionVisualizer;
