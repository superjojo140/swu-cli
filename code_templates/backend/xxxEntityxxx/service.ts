import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import * as dbService from './../database/service';
import {xxxEntityxxx} from '../../model/xxxEntityxxx/model'


export async function getxxxEntityxxx(xxxentityxxxId: string) {
    const queryCmd = `SELECT * FROM xxxEntityxxx WHERE id = ?`;
    const [rows] = await dbService.query<RowDataPacket[]>(queryCmd, [xxxentityxxxId]);
    return rows[0] as xxxEntityxxx;
}

export async function getxxxEntityxxxList() {
    const queryCmd = `SELECT * FROM xxxEntityxxx`;
    const [rows] = await dbService.query<RowDataPacket[]>(queryCmd);
    return rows as xxxEntityxxx[];
}

export async function createxxxEntityxxx(title: string, description: string, notes: string) {
    const queryCmd = `xxxsqlInsertQueryxxx`;
    const [result] = await dbService.query<ResultSetHeader>(queryCmd, [title, description, notes]);
    return result.insertId;
}

export async function updatexxxEntityxxx(xxxentityxxxId: string, title: string, description: string, notes: string) {
    const queryCmd = `xxxsqlUpdateQueryxxx`;
    await dbService.query<ResultSetHeader>(queryCmd, [title, description, notes, xxxentityxxxId]);
}

export async function deletexxxEntityxxx(xxxentityxxxId: string) {
    const queryCmd = `DELETE FROM xxxEntityxxx WHERE id = ?`;
    await dbService.query<ResultSetHeader>(queryCmd, [xxxentityxxxId]);
}
