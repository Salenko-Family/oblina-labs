import type { ReactNode } from "react";
import styles from "./ArithmeticPlayground.module.css";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const ArithmeticPlayground = ({ title, description, children }: Props) => {
  return (
    <div className={styles.playground}>
      <header className={styles.header}>
        <p className={styles.label}>ІНТЕРАКТИВНИЙ ПРИКЛАД</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </header>
      {children}
    </div>
  );
};

export default ArithmeticPlayground;
