import { JsonStorage } from "../storage/JsonStorage";

export class LivroService {
  constructor(private storage: JsonStorage) {}

  async listAll() {
    return this.storage.getAll("livros");
  }

  async findByIsbn(isbn: string) {
    const livros = (await this.listAll()) as any[];
    return livros.find((l) => l.isbn === isbn);
  }

  async addIfNotExists(dto: any): Promise<string> {
    const existing = await this.findByIsbn(dto.isbn);
    if (existing?.id) return existing.id;
    return this.storage.add("livros", dto);
  }

  async updateStockById(id: string, delta: number): Promise<boolean> {
    const livros = (await this.listAll()) as any[];
    const current = livros.find((l) => l.id === id);
    if (!current) return false;
    const next = (current.quantidadeEstoque ?? 0) + delta;
    return this.storage.update("livros", id, { quantidadeEstoque: next });
  }
}
