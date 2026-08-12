import type { ChangeEvent } from "react";
import styles from "./StepNavigation.module.css";

interface Props {
  currentStepIndex: number;
  stepsCount: number;
  onStepChange: (stepIndex: number) => void;
}

const StepNavigation = ({
  currentStepIndex,
  stepsCount,
  onStepChange,
}: Props) => {
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === stepsCount - 1;

  const rangeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onStepChange(Number(event.target.value));
  };

  const backButtonHandler = () => {
    if (!isFirstStep) {
      onStepChange(currentStepIndex - 1);
    }
  };

  const nextButtonHandler = () => {
    if (!isLastStep) {
      onStepChange(currentStepIndex + 1);
    }
  };

  return (
    <div className={styles.navigation}>
      <input
        className={styles.stepRange}
        type="range"
        min={0}
        max={stepsCount - 1}
        value={currentStepIndex}
        onChange={rangeChangeHandler}
        aria-label="Поточний крок"
      />
      <button
        className={`${styles.navigationButton} ${styles.backButton}`}
        type="button"
        onClick={backButtonHandler}
        disabled={isFirstStep}
      >
        Назад
      </button>
      <button
        className={`${styles.navigationButton} ${styles.nextButton}`}
        type="button"
        onClick={nextButtonHandler}
        disabled={isLastStep}
      >
        Далі
      </button>
    </div>
  );
};

export default StepNavigation;
