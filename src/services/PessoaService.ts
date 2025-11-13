import { JsonStorage } from "../storage/JsonStorage";

export class PessoaService {
  constructor(private storage: JsonStorage) {}

  async listAll() {
    return this.storage.getAll("pessoas");
  }

  async findById(id: string) {
    const pessoas = (await this.listAll()) as any[];
    return pessoas.find((p) => p.id === id);
  }

  async addIfNotExists(dto: any): Promise<string> {
    const pessoas = (await this.listAll()) as any[];
    const existing = pessoas.find(
      (p) => p.nome === dto.nome && (p.endereco ?? "") === (dto.endereco ?? "")
    );
    if (existing?.id) return existing.id;
    return this.storage.add("pessoas", dto);
  }
}
