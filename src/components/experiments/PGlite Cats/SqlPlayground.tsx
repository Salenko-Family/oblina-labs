import type { PGlite } from "@electric-sql/pglite";
import { useState } from "react";
import styles from "./SqlPlayground.module.css";

type SqlPlaygroundProps = {
  db: PGlite;
};

type QueryRow = Record<string, unknown>;

const MAX_DISPLAYED_ROWS = 100;

const DEFAULT_QUERY = `SELECT
  animal_name,
  COUNT(*) AS cats_count
FROM pets
WHERE species = 'Cat'
  AND animal_name IS NOT NULL
  AND animal_name <> ''
GROUP BY animal_name
ORDER BY cats_count DESC, animal_name ASC
LIMIT 10;`;

const SqlPlayground = ({ db }: SqlPlaygroundProps) => {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [results, setResults] = useState<QueryRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const displayedResults = results.slice(0, MAX_DISPLAYED_ROWS);

  async function runQuery() {
    setError(null);
    setResults([]);
    setColumns([]);
    setExecutionTime(null);
    setLoading(true);
    setHasRun(false);

    const startTime = performance.now();

    try {
      const ret = await db.query<QueryRow>(query);
      const endTime = performance.now();

      setResults(ret.rows);
      setColumns(ret.fields.map((field) => field.name));
      setExecutionTime(endTime - startTime);
      setHasRun(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }

  function resetQuery() {
    setQuery(DEFAULT_QUERY);
    setResults([]);
    setColumns([]);
    setError(null);
    setExecutionTime(null);
    setHasRun(false);
  }

  function formatCellValue(value: unknown): string {
    if (value === null) {
      return "NULL";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  return (
    <section className={styles.playground}>
      <header className={styles.header}>
        <p className={styles.label}>Інтерактивний приклад</p>

        <h2 className={styles.title}>SQL Playground</h2>

        <p className={styles.description}>
          Запустіть готовий запит або змініть його, щоб дослідити дані Seattle
          Pet Licenses.
        </p>
      </header>

      <div className={styles.editorPanel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelLabel}>SQL</span>
          <span className={styles.databaseBadge}>PostgreSQL</span>
        </div>

        <textarea
          className={styles.editor}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          spellCheck={false}
          aria-label="SQL запит"
        />
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.button} ${styles.primaryButton}`}
          type="button"
          onClick={runQuery}
          disabled={loading}
        >
          {loading ? "Виконується..." : "Запустити SQL"}
        </button>

        <button
          className={`${styles.button} ${styles.secondaryButton}`}
          type="button"
          onClick={resetQuery}
          disabled={loading}
        >
          Скинути SQL
        </button>
      </div>

      {error ? (
        <div className={styles.errorPanel} role="alert">
          <p className={styles.errorLabel}>SQL error</p>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      ) : null}

      {hasRun && !error ? (
        <section className={styles.resultPanel}>
          <div className={styles.resultHeader}>
            <span className={styles.panelLabel}>Result</span>

            {executionTime !== null ? (
              <span className={styles.resultMeta}>
                {results.length} rows · {executionTime.toFixed(1)} ms
              </span>
            ) : null}
          </div>

          {columns.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.resultTable}>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {displayedResults.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column) => (
                        <td key={column}>{formatCellValue(row[column])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.emptyResult}>Запит виконано успішно.</p>
          )}

          {results.length > MAX_DISPLAYED_ROWS ? (
            <p className={styles.resultHint}>
              Показано перші {MAX_DISPLAYED_ROWS} рядків із {results.length}.
            </p>
          ) : null}
        </section>
      ) : null}
    </section>
  );
};

export default SqlPlayground;
