import styles from "./PresetButtons.module.css";

export interface ArithmeticPreset {
  label: string;
  firstNumber: string;
  secondNumber: string;
}

interface Props {
  presets: ArithmeticPreset[];
  onGenerate: () => void;
  onSelect: (firstNumber: string, secondNumber: string) => void;
}

const PresetButtons = ({ presets, onGenerate, onSelect }: Props) => {
  return (
    <div className={styles.presets}>
      <button
        className={styles.randomButton}
        type="button"
        onClick={onGenerate}
      >
        ↻ Випадкові числа
      </button>
      <span className={styles.presetsLabel}>Готові приклади:</span>
      {presets.map((preset) => (
        <button
          className={styles.presetButton}
          type="button"
          key={preset.label}
          onClick={() => onSelect(preset.firstNumber, preset.secondNumber)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
};

export default PresetButtons;
