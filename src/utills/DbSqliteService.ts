import * as SQLite from "expo-sqlite";

export class DbSqliteService {
  private static instance: DbSqliteService | null = null;
  private static initPromise: Promise<DbSqliteService> | null = null;
  private db!: SQLite.SQLiteDatabase;

  private constructor() {}

  public static async getInstance(): Promise<DbSqliteService> {
    if (DbSqliteService.instance) return DbSqliteService.instance;
    if (!DbSqliteService.initPromise) {
      DbSqliteService.initPromise = (async () => {
        const service = new DbSqliteService();
        service.db = await SQLite.openDatabaseAsync("library.db");
        console.log("База даних відкрита");
        DbSqliteService.instance = service;
        return service;
      })();
    }
    return DbSqliteService.initPromise;
  }

  public async createTable(tableName: string, columns: string): Promise<void> {
    await this.db.execAsync(
      `CREATE TABLE IF NOT EXISTS ${tableName} (${columns});`,
    );
    console.log(`Таблиця ${tableName} створена або вже існує`);
  }

  public async execute(
    query: string,
    params: SQLite.SQLiteBindParams = [],
  ): Promise<SQLite.SQLiteRunResult> {
    console.log("Виконання запиту:", query, "з параметрами:", params);
    return await this.db.runAsync(query, params);
  }

  public async getOne<T>(
    query: string,
    params: SQLite.SQLiteBindParams = [],
  ): Promise<T | null> {
    return await this.db.getFirstAsync<T>(query, params);
  }

  public async getAll<T>(
    query: string,
    params: SQLite.SQLiteBindParams = [],
  ): Promise<T[]> {
    return await this.db.getAllAsync<T>(query, params);
  }
}
