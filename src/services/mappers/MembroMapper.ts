import { randomUUID } from "crypto";
import { Membro } from "../../domain/Membro";
import type { Pessoa as PessoaRecord } from "../../storage/Models";

const ensureMatricula = (record: PessoaRecord): string => {
  if (record.matricula && record.matricula.trim().length > 0) {
    return record.matricula.trim();
  }
  if (record.id && record.id.trim().length > 0) {
    return record.id.trim();
  }
  return randomUUID();
};

export const MembroMapper = {
  toEntity(record: PessoaRecord): Membro {
    const props: any = {
      id: record.id,
      nome: record.nome,
      matricula: ensureMatricula(record),
      ativo: record.ativo ?? true,
    };
    if (record.endereco) props.endereco = record.endereco;
    if (record.telefone) props.telefone = record.telefone;
    if (record.email) props.email = record.email;
    return new Membro(props);
  },

  toPersistence(entity: Membro): PessoaRecord {
    const json = entity.toJSON();
    if (!json.id) {
      throw new Error("Membro precisa possuir id para ser persistido.");
    }
    const payload: PessoaRecord = {
      id: json.id,
      nome: json.nome,
      matricula: json.matricula,
      ativo: json.ativo ?? true,
    };
    if (json.endereco) payload.endereco = json.endereco;
    if (json.telefone) payload.telefone = json.telefone;
    if (json.email) payload.email = json.email;
    return payload;
  },
};
