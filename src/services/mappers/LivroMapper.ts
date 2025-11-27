import { Livro } from "../../domain/Livro";
import type { Livro as LivroRecord } from "../../storage/Models";

export const LivroMapper = {
  toEntity(record: LivroRecord): Livro {
    return new Livro({
      id: record.id,
      titulo: record.titulo,
      autor: record.autor,
      isbn: record.isbn,
      anoPublicacao: record.anoPublicacao,
      quantidadeEstoque: record.quantidadeEstoque,
      preco: record.preco,
    });
  },

  toPersistence(entity: Livro): LivroRecord {
    const json = entity.toJSON();
    if (!json.id) {
      throw new Error("Livro precisa possuir id para ser persistido.");
    }
    return {
      id: json.id,
      titulo: json.titulo,
      autor: json.autor,
      isbn: json.isbn,
      anoPublicacao: json.anoPublicacao,
      quantidadeEstoque: json.quantidadeEstoque,
      preco: json.preco,
    };
  },
};
