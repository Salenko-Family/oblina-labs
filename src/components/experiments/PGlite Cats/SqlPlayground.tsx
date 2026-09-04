import type { PGlite } from "@electric-sql/pglite";
import { useState } from "react";

type SqlPlaygroundProps = {
  db: PGlite;
};

type QueryRow = Record<string, unknown>;

const SqlPlayground = ({ db }: SqlPlaygroundProps) => {
  const [query, setQuery] = useState("SELECT 2 + 2 AS result;");
  const [results, setResults] = useState<QueryRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const columns = results[0] ? Object.keys(results[0]) : [];

  async function runQuery() {
    setError(null);
    setResults([]);
    setLoading(true);

    try {
      const ret = await db.query<QueryRow>(query);
      setResults(ret.rows);
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
    <div>
      <textarea value={query} onChange={(e) => setQuery(e.target.value)} />

      <button onClick={runQuery} disabled={loading}>
        {loading ? "Running..." : "Run"}
      </button>

      {error ? <p>{error}</p> : null}

      {results.length > 0 ? (
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {results.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column}>{formatCellValue(row[column])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default SqlPlayground;
