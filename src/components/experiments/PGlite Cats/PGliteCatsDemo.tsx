import { useRef, useState } from "react";
import { PGlite } from "@electric-sql/pglite";

type QueryRow = {
  message: string;
};

const PGliteCatsDemo = () => {
  const dbRef = useRef<PGlite | null>(null);
  const [result, setResult] = useState<QueryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function initDatabase() {
    if (dbRef.current) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const db = new PGlite();
      const ret = await db.query<QueryRow>(
        "SELECT 'Hello from PGlite' AS message;",
      );
      dbRef.current = db;
      setResult(ret.rows);
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

  return (
    <div>
      <button onClick={initDatabase} disabled={loading}>
        {loading ? "Initializing..." : "Init"}
      </button>
      {result.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>message</th>
            </tr>
          </thead>

          <tbody>
            {result.map((row) => (
              <tr key={row.message}>
                <td>{row.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {error ? <p>{error}</p> : null}
    </div>
  );
};

export default PGliteCatsDemo;
