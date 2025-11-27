import { Livro, LivroProps } from "../domain/Livro";
import { JsonStorage } from "../storage/JsonStorage";
import { LivroMapper } from "./mappers/LivroMapper";

type LivroUpdate = Partial<Omit<LivroProps, "id" | "quantidadeEstoque">> & {
  quantidadeEstoque?: number;

};

export class LivroService {
  constructor(private storage: JsonStorage) {}

  async listAll(): Promise<Livro[]> {
    const records = await this.storage.getAll("livros");
    return records.map((record) => LivroMapper.toEntity(record));
  }

  async findById(id: string): Promise<Livro | undefined> {
    const record = await this.storage.getById("livros", id);
    return record ? LivroMapper.toEntity(record) : undefined;
  }

  async findByIsbn(isbn: string): Promise<Livro | undefined> {
    const records = await this.storage.getAll("livros");
    const record = records.find((l) => l.isbn === isbn);
    return record ? LivroMapper.toEntity(record) : undefined;
  }

  async addIfNotExists(dto: Omit<LivroProps, "id">): Promise<string> {
    const existing = await this.findByIsbn(dto.isbn);
    if (existing?.id) return existing.id;
    const livro = new Livro(dto);
    return this.storage.add("livros", livro.toJSON() as any);
  }

  async updateById(id: string, updates: LivroUpdate): Promise<Livro | undefined> {
    const record = await this.storage.getById("livros", id);
    if (!record) return undefined;
    const livro = LivroMapper.toEntity(record);

    if (updates.titulo !== undefined) livro.titulo = updates.titulo;
    if (updates.autor !== undefined) livro.autor = updates.autor;
    if (updates.isbn !== undefined) livro.isbn = updates.isbn;
    if (updates.anoPublicacao !== undefined) livro.anoPublicacao = updates.anoPublicacao;
    if (updates.preco !== undefined) livro.preco = updates.preco;
    if (updates.quantidadeEstoque !== undefined) {
      const delta = updates.quantidadeEstoque - livro.quantidadeEstoque;
      livro.atualizarEstoque(delta);
    }

    await this.storage.update("livros", id, LivroMapper.toPersistence(livro));
    return livro;
  }

  async updateStockById(id: string, delta: number): Promise<boolean> {
    const record = await this.storage.getById("livros", id);
    if (!record) return false;
    const livro = LivroMapper.toEntity(record);
    livro.atualizarEstoque(delta);
    await this.storage.update("livros", id, LivroMapper.toPersistence(livro));
    return true;
  }

  async removeById(id: string): Promise<boolean> {
    return this.storage.remove("livros", id);
  }
}
