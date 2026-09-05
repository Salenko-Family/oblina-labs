import { PGlite } from "@electric-sql/pglite";
import { useEffect, useRef, useState } from "react";
import SqlPlayground from "./SqlPlayground";

type Status = "initializing" | "ready" | "error";

const SqlLab = () => {
  const dbRef = useRef<PGlite | null>(null);
  const [status, setStatus] = useState<Status>("initializing");

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

      dbRef.current = db;
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <div>
      {status === "initializing" ? <p>Initializing PostgreSQL...</p> : null}

      {status === "ready" ? <p>PostgreSQL initialized</p> : null}

      {status === "error" ? <p>Error initializing PostgreSQL</p> : null}

      {status === "ready" && dbRef.current ? (
        <SqlPlayground db={dbRef.current} />
      ) : null}
    </div>
  );
};

export default SqlLab;
