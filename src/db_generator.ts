import mysql, { QueryResult } from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';


export default class DbGenerator {
    static connection: mysql.Connection | null = null;


    static async createTable(tableName: string, properties: string[]) {

        const [rows] = await DbGenerator.query(`SHOW TABLES LIKE '${tableName}'`);
        const tableExists = Array.isArray(rows) && rows.length === 1;

        if (!tableExists) {
            const columns = 'id INT AUTO_INCREMENT PRIMARY KEY, ' + properties.join(" VARCHAR(300), ") + " VARCHAR(300)";
            const sql = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columns})`;
            await DbGenerator.query(sql);
        }

        await DbGenerator.close();
        return !tableExists;
    }





    static async getConnection(): Promise<mysql.Connection> {
        if (DbGenerator.connection) { return DbGenerator.connection; }

        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            envContent.split('\n').forEach(line => {
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
                if (match) {
                    const key = match[1];
                    let value = match[2];
                    // Remove surrounding quotes if present
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        }
        else {
            console.error(chalk.red.bold('[SQl Generator] Error: .env file not found. Please create a .env file with your database credentials.'));
            throw new Error("[SQl Generator] Error: .env file not found. Please create a .env file with your database credentials.");
        }


        const config = {
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DB
        };


        return await mysql.createConnection(config);
    }

    /**
     * Executes a SQL query using the provided SQL string and optional arguments.
     *
     * @param sql - The SQL query string to execute.
     * @param args - Optional array of arguments to be used in the SQL query.
     * @returns A Promise that resolves with the query result rows or rejects with an error.
     */
    static async query<QueryType extends QueryResult>(sql: string, args?: any[]) {
        const conn = await DbGenerator.getConnection();
        const result = await conn.execute<QueryType>(sql, args);
        return result;
    }

    static async close() {
        if (DbGenerator.connection) {
            await DbGenerator.connection.end();
            DbGenerator.connection = null;
        }
    }
}