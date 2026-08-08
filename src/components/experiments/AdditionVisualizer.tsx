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
    <div>
      <label>
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

      <label>
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
      <h2>Result: {result}</h2>
      <p>
        Крок {currentStepIndex + 1} із {steps.length}
      </p>
      <ul>
        <li>digitA: {currentStep.digitA}</li>
        <li>digitB: {currentStep.digitB}</li>
        <li>sum: {currentStep.sum}</li>
        <li>carryIn: {currentStep.carryIn}</li>
        <li>carryOut: {currentStep.carryOut}</li>
        <li>partialResult: {currentStep.partialResult}</li>
        <li>resultDigit: {currentStep.resultDigit}</li>
      </ul>
      <button onClick={backButtonHandler} disabled={currentStepIndex === 0}>
        Назад
      </button>
      <button
        onClick={nextButtonHandler}
        disabled={currentStepIndex === steps.length - 1}
      >
        Далі
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
    </div>
  );
};

export default AdditionVisualizer;
