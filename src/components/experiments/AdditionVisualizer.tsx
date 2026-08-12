import { useState, type ChangeEvent } from "react";
import { traceAddition } from "../../labs/tracers/traceAddition";
import { columnAddition } from "../../labs/01-long-ar-sum";

interface Props {
  strA: string;
  strB: string;
}

const generateRandomNumber = (max: number): string => {
  return String(Math.floor(Math.random() * max));
};

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

        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "clamp(16px, 5vw, 32px)",
        boxSizing: "border-box",

        backgroundColor: "#fffdf5",
        border: "2px solid #171717",
        borderRadius: "24px",
        boxShadow: "8px 8px 0 #171717",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <p
          style={{
            width: "fit-content",
            margin: 0,
            padding: "6px 10px",

            backgroundColor: "#d9ff66",
            border: "1px solid #171717",
            borderRadius: "999px",

            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          ІНТЕРАКТИВНИЙ ПРИКЛАД
        </p>
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(28px, 5vw, 42px)",
            lineHeight: 1.1,
          }}
        >
          Додавання стовпчиком
        </h2>
        <p
          style={{
            margin: 0,
            color: "#555",
            fontSize: "16px",
            lineHeight: 1.5,
          }}
        >
          Введіть два числа або виберіть готовий приклад.
        </p>
      </header>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flex: "1 1 180px",
            fontWeight: 600,
          }}
        >
          Перше число
          <input
            type="text"
            value={firstNumber}
            inputMode="numeric"
            onChange={firstNumberChangeHandler}
          />
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flex: "1 1 180px",
            fontWeight: 600,
          }}
        >
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
        style={{
          minHeight: "49px",
          padding: "0 24px",
          backgroundColor: "#d9ff66",
          border: "2px solid #171717",
          borderRadius: "10px",
          boxShadow: "3px 3px 0 #171717",
          fontSize: "16px",
          fontWeight: 700,
          cursor:
            firstNumber === "" || secondNumber === ""
              ? "not-allowed"
              : "pointer",
          opacity: firstNumber === "" || secondNumber === "" ? 0.5 : 1,
        }}
        type="button"
        onClick={runButtonHandler}
        disabled={firstNumber === "" || secondNumber === ""}
      >
        Порахувати
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          paddingTop: "4px",
        }}
      >
        <button
          type="button"
          onClick={generateButtonHandler}
          style={{
            padding: "9px 14px",
            backgroundColor: "#fff",
            border: "2px solid #171717",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ↻ Випадкові числа
        </button>

        <span
          style={{
            color: "#555",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Готові приклади:
        </span>

        <button
          type="button"
          onClick={() => presetSelectHandler("95", "5")}
          style={{
            padding: "9px 14px",
            backgroundColor: "transparent",
            border: "1px solid #171717",
            borderRadius: "999px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          95 + 5
        </button>

        <button
          type="button"
          onClick={() => presetSelectHandler("500", "500")}
          style={{
            padding: "9px 14px",
            backgroundColor: "transparent",
            border: "1px solid #171717",
            borderRadius: "999px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          500 + 500
        </button>

        <button
          type="button"
          onClick={() => presetSelectHandler("999999", "1")}
          style={{
            padding: "9px 14px",
            backgroundColor: "transparent",
            border: "1px solid #171717",
            borderRadius: "999px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          999999 + 1
        </button>
        <button
          type="button"
          onClick={() => presetSelectHandler("59372051294", "94729473914")}
          style={{
            padding: "9px 14px",
            backgroundColor: "transparent",
            border: "1px solid #171717",
            borderRadius: "999px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Дуже довгі числа
        </button>
      </div>
      {steps.length > 0 && currentStep && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(16px, 4vw, 24px)",
            padding: "clamp(12px, 4vw, 24px)",
            backgroundColor: "#f4f0e5",
            border: "2px solid #171717",
            borderRadius: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "clamp(190px, 35vw, 260px)",
              padding: "20px",
              boxSizing: "border-box",
              backgroundColor: "#fffdf5",
              border: "2px solid #171717",
              borderRadius: "14px",
            }}
          >
            <div
              style={{
                width: "fit-content",
                whiteSpace: "pre",
                fontFamily: "monospace",
                fontSize: "32px",
                lineHeight: "1.4",
              }}
            >
              <div
                style={{
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
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "24px",
              padding: "4px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <p
                style={{
                  width: "fit-content",
                  margin: 0,
                  padding: "6px 10px",
                  backgroundColor: "#d9ff66",
                  border: "1px solid #171717",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Крок {currentStepIndex + 1} із {steps.length}
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "18px",
                  lineHeight: 1.6,
                }}
              >
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px",
                width: "100%",
              }}
            >
              <input
                type="range"
                min={0}
                max={steps.length - 1}
                value={currentStepIndex}
                onChange={(event) => {
                  setCurrentStepIndex(Number(event.target.value));
                }}
                aria-label="Поточний крок"
                style={{
                  gridColumn: "1 / -1",
                  width: "100%",
                  margin: 0,
                  accentColor: "#171717",
                }}
              />

              <button
                type="button"
                onClick={backButtonHandler}
                disabled={currentStepIndex === 0}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  padding: "10px 16px",

                  backgroundColor: "#fff",
                  border: "2px solid #171717",
                  borderRadius: "10px",

                  fontSize: "16px",
                  fontWeight: 600,

                  cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",

                  opacity: currentStepIndex === 0 ? 0.45 : 1,
                }}
              >
                Назад
              </button>

              <button
                type="button"
                onClick={nextButtonHandler}
                disabled={currentStepIndex === steps.length - 1}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  padding: "10px 16px",

                  backgroundColor: "#d9ff66",
                  border: "2px solid #171717",
                  borderRadius: "10px",
                  boxShadow:
                    currentStepIndex === steps.length - 1
                      ? "none"
                      : "3px 3px 0 #171717",

                  fontSize: "16px",
                  fontWeight: 700,

                  cursor:
                    currentStepIndex === steps.length - 1
                      ? "not-allowed"
                      : "pointer",

                  opacity: currentStepIndex === steps.length - 1 ? 0.45 : 1,
                }}
              >
                Далі
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdditionVisualizer;
