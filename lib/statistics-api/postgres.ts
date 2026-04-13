import { Pool, type QueryResultRow } from 'pg';

let pool: Pool | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getStatisticsDbPool(): Pool {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    host: getRequiredEnv('STATISTICS_DB_HOST'),
    port: Number(process.env.STATISTICS_DB_PORT || 5432),
    database: getRequiredEnv('STATISTICS_DB_NAME'),
    user: getRequiredEnv('STATISTICS_DB_USER'),
    password: getRequiredEnv('STATISTICS_DB_PASSWORD'),
    ssl:
      process.env.STATISTICS_DB_SSL === 'true'
        ? {
            rejectUnauthorized: process.env.STATISTICS_DB_SSL_REJECT_UNAUTHORIZED !== 'false',
          }
        : false,
    max: 4,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  return pool;
}

export async function runStatisticsQuery<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<T[]> {
  const db = getStatisticsDbPool();
  const result = await db.query<T>(text, values);
  return result.rows;
}
