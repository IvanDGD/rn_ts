import * as SQLite from "expo-sqlite";
import * as Crypto from 'expo-crypto';

export class  dbUtil {
  private static instance:  dbUtil | null = null;
  private static db: SQLite.SQLiteDatabase | null = null;
  private static initPromise: Promise<SQLite.SQLiteDatabase> | null = null;
  private static dbName: string = "library.db";

  private constructor() {}

  public static getInstance():  dbUtil {
    if (!this.instance) {
      this.instance = new dbUtil();
    }
    return this.instance;
  }

  public static async getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (this.db) {
      return this.db;
    }

    if (!this.initPromise) {
      this.initPromise = (async () => {
        const connection = await SQLite.openDatabaseAsync(this.dbName);
        this.db = connection;
        return connection;
      })();
    }

    return this.initPromise;
  }

  public static async createTable( tableName: string, columns: Record<string, string> ): Promise<void> {
    const db = await this.getDatabase();
    const columnDefs = Object.entries(columns)
      .map(([colName, colType]) => `${colName} ${colType}`)
      .join(", ");

    await db.execAsync(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs});`);
  }

  public static async addItem<T extends Record<string, any>>( tableName: string, item: T ): Promise<string> {
    const db = await this.getDatabase();
    const id = Crypto.randomUUID();
    const dataToInsert = { ...item, id };

    const keys = Object.keys(dataToInsert);
    const values = Object.values(dataToInsert);
    const placeholders = keys.map(() => "?").join(", ");

    await db.runAsync(
      `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${placeholders});`,
      values
    );
    console.log(`Item added: `, dataToInsert);

    return id;
  }

  public static async getAll<T>(tableName: string): Promise<T[]> {
    const db = await this.getDatabase();
    console.log("Get all items was successful");
    return await db.getAllAsync<T>(`SELECT * FROM ${tableName};`);
  }

  public static async getById<T>(tableName: string, id: string): Promise<T | null> {
    const db = await this.getDatabase();
    console.log("Get item by id was successful: ", id);
    return await db.getFirstAsync<T>(`SELECT * FROM ${tableName} WHERE id = ?;`, [id]);
  }

  public static async deleteById(tableName: string, id: string): Promise<void> {
    const db = await this.getDatabase();
    console.log("Delete item by id was successful: ", id);
    await db.runAsync(`DELETE FROM ${tableName} WHERE id = ?;`, [id]);
  }

  public static async deleteAll(tableName: string): Promise<void> {
    const db = await this.getDatabase();
    console.log("Delete all items was successful");
    await db.runAsync(`DELETE FROM ${tableName};`);
  }
}