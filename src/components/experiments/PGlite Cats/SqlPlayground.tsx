import { PGlite } from "@electric-sql/pglite";
import { useEffect, useRef, useState } from "react";
import styles from "./SqlPlayground.module.css";

type Status = "initializing" | "ready" | "error";
type QueryRow = Record<string, unknown>;

const MAX_DISPLAYED_ROWS = 100;

const CSV_URL =
  "https://cos-data.seattle.gov/api/v3/views/jguv-t9rb/export.csv?accessType=DOWNLOAD";

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

const SqlPlayground = () => {
  const dbRef = useRef<PGlite | null>(null);

  const [status, setStatus] = useState<Status>("initializing");
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [results, setResults] = useState<QueryRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const displayedResults = results.slice(0, MAX_DISPLAYED_ROWS);

  async function loadCsv(db: PGlite) {
    const response = await fetch(CSV_URL);

    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status}`);
    }

    const csvBlob = await response.blob();

    await db.query(
      `
        COPY pets_raw (
          license_issue_date_raw,
          license_number,
          animal_name,
          species,
          primary_breed,
          secondary_breed,
          zip_code
        )
        FROM '/dev/blob'
        WITH (
          FORMAT csv,
          HEADER true
        );
      `,
      [],
      {
        blob: csvBlob,
      },
    );
  }

  async function initDatabase() {
    if (dbRef.current) {
      return;
    }

    setStatus("initializing");

    try {
      const db = new PGlite();

      await db.exec(`
        CREATE TABLE pets_raw (
          license_issue_date_raw TEXT,
          license_number TEXT,
          animal_name TEXT,
          species TEXT,
          primary_breed TEXT,
          secondary_breed TEXT,
          zip_code TEXT
        );
      `);

      await loadCsv(db);

      await db.exec(`
        CREATE TABLE pets (
          license_issue_date DATE,
          license_number TEXT,
          animal_name TEXT,
          species TEXT,
          primary_breed TEXT,
          secondary_breed TEXT,
          zip_code TEXT
        );
      `);

      await db.exec(`
        INSERT INTO pets (
          license_issue_date,
          license_number,
          animal_name,
          species,
          primary_breed,
          secondary_breed,
          zip_code
        )
        SELECT
          TO_DATE(license_issue_date_raw, 'Month DD, YYYY'),
          license_number,
          animal_name,
          species,
          primary_breed,
          secondary_breed,
          zip_code
        FROM pets_raw;
      `);

      dbRef.current = db;
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    initDatabase();
  }, []);

  async function runQuery() {
    const db = dbRef.current;

    if (!db) {
      return;
    }

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

      {status === "initializing" ? (
        <div className={styles.initializingPanel}>
          <span className={styles.loader} aria-hidden="true" />

          <div>
            <p className={styles.initializingTitle}>Готуємо PostgreSQL...</p>
            <p className={styles.initializingDescription}>
              Створюємо таблиці та завантажуємо дані Seattle Pet Licenses.
            </p>
          </div>
        </div>
      ) : null}

      {status === "error" ? (
        <div className={styles.errorPanel} role="alert">
          <p className={styles.errorLabel}>Initialization error</p>
          <p className={styles.errorMessage}>
            Не вдалося підготувати PostgreSQL.
          </p>
        </div>
      ) : null}

      {status === "ready" ? (
        <>
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
                  Показано перші {MAX_DISPLAYED_ROWS} рядків із {results.length}
                  .
                </p>
              ) : null}
            </section>
          ) : null}
        </>
      ) : null}
    </section>
  );
};

export default SqlPlayground;
