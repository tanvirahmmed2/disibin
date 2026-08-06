import { dbQuery } from './pg';

let initialized = false;

export async function initLegalTables() {
  if (initialized) return;

  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS privacy_policies (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        is_published BOOLEAN DEFAULT true,
        created_by INT REFERENCES teams(id) ON DELETE SET NULL,
        updated_by INT REFERENCES teams(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS terms_and_conditions (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        is_published BOOLEAN DEFAULT true,
        created_by INT REFERENCES teams(id) ON DELETE SET NULL,
        updated_by INT REFERENCES teams(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS refund_conditions (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        is_published BOOLEAN DEFAULT true,
        created_by INT REFERENCES teams(id) ON DELETE SET NULL,
        updated_by INT REFERENCES teams(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        is_published BOOLEAN DEFAULT true,
        order_num INT DEFAULT 0,
        created_by INT REFERENCES teams(id) ON DELETE SET NULL,
        updated_by INT REFERENCES teams(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);
    initialized = true;
  } catch (error) {
    console.error("Failed to initialize legal tables:", error);
  }
}
