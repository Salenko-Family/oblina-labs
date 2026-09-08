import { PGlite } from "@electric-sql/pglite";
import { useEffect, useRef, useState } from "react";
import SqlPlayground from "./SqlPlayground";

type Status = "initializing" | "ready" | "error";
const CSV_URL =
  "https://cos-data.seattle.gov/api/v3/views/jguv-t9rb/export.csv?accessType=DOWNLOAD";

const SqlLab = () => {
  const dbRef = useRef<PGlite | null>(null);
  const [status, setStatus] = useState<Status>("initializing");

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
