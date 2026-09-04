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
      dbRef.current = db;
      setStatus("ready");
    } catch (error) {
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
