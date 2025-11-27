import { Emprestimo } from "../../domain/Emprestimo";
import type { Emprestimo as EmprestimoRecord } from "../../storage/Models";

export const EmprestimoMapper = {
  toEntity(record: EmprestimoRecord): Emprestimo {
    if (!record.pessoaId) {
      throw new Error("Registro de empréstimo sem pessoaId válido.");
    }
    return new Emprestimo({
      id: record.id,
      livroId: record.livroId,
      membroId: record.pessoaId,
      dataEmprestimo: record.dataEmprestimo,
      dataDevolucaoPrevista: record.dataDevolucaoPrevista || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      ...(record.dataDevolucaoReal && { dataDevolucaoReal: record.dataDevolucaoReal }),
      devolvido: record.devolvido,
    });
  },

  toPersistence(entity: Emprestimo): EmprestimoRecord {
    const json = entity.toJSON();
    if (!json.id) {
      throw new Error("Emprestimo precisa possuir id para ser persistido.");
    }
    return {
      id: json.id,
      livroId: json.livroId,
      pessoaId: json.membroId,
      dataEmprestimo: json.dataEmprestimo,
      dataDevolucaoPrevista: json.dataDevolucaoPrevista,
      ...(json.dataDevolucaoReal && { dataDevolucaoReal: json.dataDevolucaoReal }),
      devolvido: json.devolvido ?? false,
    };
  },
};
