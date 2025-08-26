import mysql, { QueryResult } from 'mysql2/promise';

const config = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB
};

let connection: mysql.Connection | null = null;

async function getConnection(): Promise<mysql.Connection> {
    if (!connection) {
        connection = await mysql.createConnection(config);
    }
    return connection;
}

/**
 * Executes a SQL query using the provided SQL string and optional arguments.
 *
 * @param sql - The SQL query string to execute.
 * @param args - Optional array of arguments to be used in the SQL query.
 * @returns A Promise that resolves with the query result rows or rejects with an error.
 */
export async function query<QueryType extends QueryResult>(sql: string, args?: any[]) {
    const conn = await getConnection();
    const result = await conn.execute<QueryType>(sql, args);
    return result;
}

export async function close() {
    if (connection) {
        await connection.end();
        connection = null;
    }
}