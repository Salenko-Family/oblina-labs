import { useRef, useState } from "react";
import { PGlite } from "@electric-sql/pglite";

type QueryRow = {
  message: string;
};

const PGliteCatsDemo = () => {
  const dbRef = useRef<PGlite | null>(null);
  const [result, setResult] = useState<QueryRow[]>([]);

  async function initDatabase() {
    if (dbRef.current) {
      return;
    }
    const db = new PGlite();
    const ret = await db.query<QueryRow>(
      "SELECT 'Hello from PGlite' AS message;",
    );
    dbRef.current = db;
    setResult(ret.rows);
  }

  return (
    <div>
      <button onClick={initDatabase}>Init</button>
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
    </div>
  );
};

export default PGliteCatsDemo;
