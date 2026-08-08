import React from "react";
import { traceAddition } from "../../labs/tracers/traceAddition";
import { columnAddition } from "../../labs/01-long-ar-sum";

interface Props {
  strA: string;
  strB: string;
}

const AdditionVisualizer = ({ strA, strB }: Props) => {
  const steps = traceAddition(strA, strB);
  const result = columnAddition(strA, strB);

  return (
    <div>
      <h1>Result: {result}</h1>
      {steps.map((item, index) => {
        return (
          <ul key={index}>
            <li>digitA: {item.digitA}</li>
            <li>digitB: {item.digitB}</li>
            <li>sum: {item.sum}</li>
            <li>carryIn: {item.carryIn}</li>
            <li>carryOut: {item.carryOut}</li>
            <li>partialResult: {item.partialResult}</li>
            <li>resultDigit: {item.resultDigit}</li>
          </ul>
        );
      })}
    </div>
  );
};

export default AdditionVisualizer;
