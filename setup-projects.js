const { Pool } = require('pg');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key.trim()] = value.trim().replace(/^'|'$/g, '');
  return acc;
}, {});

const pool = new Pool({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: env.PG_PORT,
  database: env.PG_DATABASE,
  ssl: { rejectUnauthorized: false },
});

const query = `
CREATE TABLE IF NOT EXISTS internal_projects (
  project_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold')),
  created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
  deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Note: We assume update_modified_column() exists as per schema
DROP TRIGGER IF EXISTS update_internal_projects_modtime ON internal_projects;
CREATE TRIGGER update_internal_projects_modtime 
BEFORE UPDATE ON internal_projects 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TABLE IF NOT EXISTS project_assignments (
  assignment_id SERIAL PRIMARY KEY,
  project_id INT REFERENCES internal_projects(project_id) ON DELETE CASCADE,
  developer_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT now(),
  UNIQUE(project_id, developer_id)
);

CREATE TABLE IF NOT EXISTS internal_tasks (
  task_id SERIAL PRIMARY KEY,
  project_id INT REFERENCES internal_projects(project_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to INT REFERENCES users(user_id) ON DELETE SET NULL,
  created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
  deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

DROP TRIGGER IF EXISTS update_internal_tasks_modtime ON internal_tasks;
CREATE TRIGGER update_internal_tasks_modtime 
BEFORE UPDATE ON internal_tasks 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TABLE IF NOT EXISTS task_comments (
  comment_id SERIAL PRIMARY KEY,
  task_id INT REFERENCES internal_tasks(task_id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internal_tasks_proj_id ON internal_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
`;

async function run() {
  try {
    console.log('Running migration...');
    await pool.query(query);
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

run();
