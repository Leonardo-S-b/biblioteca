import { Membro, MembroProps } from "../domain/Membro";
import { JsonStorage } from "../storage/JsonStorage";
import { MembroMapper } from "./mappers/MembroMapper";

type MembroCreate = Omit<MembroProps, "id" | "ativo"> & { ativo?: boolean };
type MembroUpdate = Partial<Omit<MembroProps, "id">>;

export class PessoaService {
  constructor(private storage: JsonStorage) {}

  async listAll(): Promise<Membro[]> {
    const records = await this.storage.getAll("pessoas");
    return records.map((record) => MembroMapper.toEntity(record));
  }

  async findById(id: string): Promise<Membro | undefined> {
    const record = await this.storage.getById("pessoas", id);
    return record ? MembroMapper.toEntity(record) : undefined;
  }

  async findByMatricula(matricula: string): Promise<Membro | undefined> {
    const records = await this.storage.getAll("pessoas");
    const record = records.find((p) => p.matricula === matricula);
    return record ? MembroMapper.toEntity(record) : undefined;
  }

  async addIfNotExists(dto: MembroCreate): Promise<string> {
    const matricula = dto.matricula?.trim();
    if (!matricula) {
      throw new Error("Matrícula é obrigatória para cadastro de membro.");
    }

    const existing = await this.findByMatricula(matricula);
    if (existing?.id) return existing.id;

    const membro = new Membro({
      ...dto,
      ativo: dto.ativo ?? true,
    });

    return this.storage.add("pessoas", membro.toJSON() as any);
  }

  async updateById(id: string, updates: MembroUpdate): Promise<Membro | undefined> {
    const record = await this.storage.getById("pessoas", id);
    if (!record) return undefined;

    const membro = MembroMapper.toEntity(record);

    if (updates.nome !== undefined) membro.nome = updates.nome;
    if (updates.endereco !== undefined) membro.endereco = updates.endereco;
    if (updates.telefone !== undefined) membro.telefone = updates.telefone;
    if (updates.email !== undefined) membro.email = updates.email;
    if (updates.matricula !== undefined) membro.matricula = updates.matricula;
    if (updates.ativo !== undefined) {
      if (updates.ativo) {
        membro.reativar();
      } else {
        membro.desativar();
      }
    }

    await this.storage.update("pessoas", id, MembroMapper.toPersistence(membro));
    return membro;
  }

  async removeById(id: string): Promise<boolean> {
    return this.storage.remove("pessoas", id);
  }
}