import { Emprestimo, EmprestimoProps } from "../domain/Emprestimo";
import { JsonStorage } from "../storage/JsonStorage";
import { LivroService } from "./LivroService";
import { PessoaService } from "./PessoaService";
import { EmprestimoMapper } from "./mappers/EmprestimoMapper";

type EmprestimoCreate = Omit<EmprestimoProps, "id" | "devolvido">;

export class EmprestimoService {
  constructor(
    private storage: JsonStorage,
    private livroSvc: LivroService,
    private pessoaSvc: PessoaService
  ) {}

  async listAll(): Promise<Emprestimo[]> {
    const records = await this.storage.getAll("emprestimos");
    return records.map((record) => EmprestimoMapper.toEntity(record));
  }

  async findById(id: string): Promise<Emprestimo | undefined> {
    const record = await this.storage.getById("emprestimos", id);
    return record ? EmprestimoMapper.toEntity(record) : undefined;
  }

  async findByMembroId(membroId: string): Promise<Emprestimo[]> {
    const records = await this.storage.getAll("emprestimos");
    const filtered = records.filter((r) => r.pessoaId === membroId);
    return filtered.map((record) => EmprestimoMapper.toEntity(record));
  }

  async findAtivos(): Promise<Emprestimo[]> {
    const records = await this.storage.getAll("emprestimos");
    return records
      .filter((r) => !r.devolvido)
      .map((record) => EmprestimoMapper.toEntity(record));
  }

  async create(dto: EmprestimoCreate): Promise<string> {
    // Validar que o livro existe e está disponível
    const livro = await this.livroSvc.findById(dto.livroId);
    if (!livro) {
      throw new Error("Livro não encontrado.");
    }
    if (!livro.estaDisponivel) {
      throw new Error("Livro indisponível para empréstimo.");
    }

    // Validar que o membro existe e está ativo
    const membro = await this.pessoaSvc.findById(dto.membroId);
    if (!membro) {
      throw new Error("Membro não encontrado.");
    }
    if (!membro.ativo) {
      throw new Error("Membro inativo não pode realizar empréstimos.");
    }

    // Criar a entidade de domínio (valida dados)
    const emprestimo = new Emprestimo({
      ...dto,
      devolvido: false,
    });

    // Registrar empréstimo no livro (decrementa estoque)
    livro.registrarEmprestimo();
    await this.livroSvc.updateById(livro.id!, {
      quantidadeEstoque: livro.quantidadeEstoque,
    });

    // Persistir o empréstimo usando o mapper para converter os nomes dos campos
    const id = await this.storage.add("emprestimos", {
      livroId: emprestimo.livroId,
      pessoaId: emprestimo.membroId, // Converte membroId -> pessoaId
      dataEmprestimo: emprestimo.dataEmprestimo,
      dataDevolucaoPrevista: emprestimo.dataDevolucaoPrevista,
      devolvido: emprestimo.devolvido,
    } as any);
    
    // Atualizar o ID na entidade
    emprestimo.id = id;
    return id;
  }

  async devolver(emprestimoId: string, dataDevolucao?: string): Promise<Emprestimo> {
    // Buscar o empréstimo
    const record = await this.storage.getById("emprestimos", emprestimoId);
    if (!record) {
      throw new Error("Empréstimo não encontrado.");
    }

    const emprestimo = EmprestimoMapper.toEntity(record);

    // Validar se já foi devolvido
    if (emprestimo.devolvido) {
      throw new Error("Este empréstimo já foi devolvido.");
    }

    // Registrar devolução na entidade
    emprestimo.registrarDevolucao(dataDevolucao);

    // Atualizar estoque do livro
    const livro = await this.livroSvc.findById(emprestimo.livroId);
    if (livro) {
      livro.registrarDevolucao();
      await this.livroSvc.updateById(livro.id!, {
        quantidadeEstoque: livro.quantidadeEstoque,
      });
    }

    // Persistir alterações
    await this.storage.update(
      "emprestimos",
      emprestimoId,
      EmprestimoMapper.toPersistence(emprestimo)
    );

    return emprestimo;
  }

  async removeById(id: string): Promise<boolean> {
    return this.storage.remove("emprestimos", id);
  }
}
