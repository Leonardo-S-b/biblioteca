/// <reference types="node" />
import { promises as fs } from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import { Database } from "./Models";


export class JsonStorage {
    private filePath: string;

    constructor(filePath?: string) {
        this.filePath = filePath ?? path.resolve(process.cwd(), "data", "db.json");
    }

    private normalizeDatabase(data: Partial<Database>): Database {
        return {
            pessoas: Array.isArray(data.pessoas) ? data.pessoas : [],
            livros: Array.isArray(data.livros) ? data.livros : [],
            emprestimos: Array.isArray(data.emprestimos) ? data.emprestimos : [],
        };
    }

    private async readRaw(): Promise<Database> {
        try {
            const text = await fs.readFile(this.filePath, { encoding: "utf8" });
            const parsed = JSON.parse(text) as Partial<Database>;
            const normalized = this.normalizeDatabase(parsed);
            const needsRewrite = !Array.isArray(parsed.pessoas) || !Array.isArray(parsed.livros) || !Array.isArray(parsed.emprestimos);
            if (needsRewrite) {
                await this.writeRaw(normalized);
            }
            return normalized;
        } catch (err: any) {
            if (err.code === "ENOENT") {
                const initial = this.normalizeDatabase({});
                await this.writeRaw(initial);
                return initial;
            }
            throw err;
        }
    }


    private async writeRaw(data: Database): Promise<void> {
        const dir = path.dirname(this.filePath);
        await fs.mkdir(dir, { recursive: true });
        const tmp = `${this.filePath}.tmp-${Date.now()}`;
        await fs.writeFile(tmp, JSON.stringify(data, null, 2), { encoding: "utf8" });
        await fs.rename(tmp, this.filePath);
    }

    async getAll<T extends keyof Database>(collection: T): Promise<Database[T]> {
        const db = await this.readRaw();
        return db[collection];
    }

    async getById<T extends keyof Database>(
        collection: T,
        id: string
    ): Promise<Extract<Database[T][number], { id: string }> | undefined> {
        const items = await this.getAll(collection);
       
        return (items as any[]).find((i) => i.id === id);
    }

    async add<T extends keyof Database>(
        collection: T,
        item: Omit<Extract<Database[T][number], { id: string }>, "id">
    ): Promise<string> {
        const db = await this.readRaw();
        const id = randomUUID();
        
        const newItem = { ...(item as any), id } as Database[T][number];
        (db[collection] as any[]).push(newItem);
        await this.writeRaw(db);
        return id;
    }

    async update<T extends keyof Database>(
        collection: T,
        id: string,
        patch: Partial<Extract<Database[T][number], { id: string }>>
    ): Promise<boolean> {
        const db = await this.readRaw();
        
        const items: any[] = db[collection];
        const idx = items.findIndex((i) => i.id === id);
        if (idx === -1) return false;
        items[idx] = { ...items[idx], ...patch };
        await this.writeRaw(db);
        return true;
    }

    async remove<T extends keyof Database>(collection: T, id: string): Promise<boolean> {
        const db = await this.readRaw();
       
        const items: any[] = db[collection];
        const idx = items.findIndex((i) => i.id === id);
        if (idx === -1) return false;
        items.splice(idx, 1);
        await this.writeRaw(db);
        return true;
    }

    
}
