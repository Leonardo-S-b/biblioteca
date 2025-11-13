import { JsonStorage } from "../storage/JsonStorage";

export class EmprestimoService {
  constructor(
    private storage: JsonStorage,
    // Serviços podem ser usados para validação de existência/estoque
    private livroSvc?: any,
    private pessoaSvc?: any
  ) {}

  async listAll() {
    return this.storage.getAll("emprestimos");
  }

  async create(
    livroId: string,
    pessoaId: string,
    dataEmprestimo: string,
    dataDevolucao: string
  ): Promise<string> {
    return this.storage.add("emprestimos", {
      livroId,
      pessoaId,
      dataEmprestimo,
      dataDevolucao,
      devolvido: false,
    } as any);
  }

  async devolver(emprestimoId: string): Promise<void> {
    await this.storage.update("emprestimos", emprestimoId, {
      devolvido: true,
      dataDevolucaoReal: new Date().toISOString(),
    } as any);
  }
}
