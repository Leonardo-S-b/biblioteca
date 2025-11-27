import { describe, it, expect, beforeEach, afterAll } from "@jest/globals";
import { JsonStorage } from "../src/storage/JsonStorage";
import { LivroService } from "../src/services/LivroService";
import { PessoaService } from "../src/services/PessoaService";
import { EmprestimoService } from "../src/services/EmprestimoService";
import * as path from "path";
import * as fs from "fs";

describe("EmprestimoService", () => {
  let storage: JsonStorage;
  let livroSvc: LivroService;
  let pessoaSvc: PessoaService;
  let emprestimoSvc: EmprestimoService;
  let livroId: string;
  let membroId: string;
  const dbPath = path.resolve(process.cwd(), "data", "db-test-emprestimo.json");

  beforeEach(async () => {
    // Limpar banco de dados de teste antes de cada teste
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }

    storage = new JsonStorage(dbPath);
    livroSvc = new LivroService(storage);
    pessoaSvc = new PessoaService(storage);
    emprestimoSvc = new EmprestimoService(storage, livroSvc, pessoaSvc);

    // Criar dados base para os testes
    livroId = await livroSvc.addIfNotExists({
      titulo: "Clean Code",
      autor: "Robert C. Martin",
      isbn: "978-0132350884",
      anoPublicacao: 2008,
      quantidadeEstoque: 5,
      preco: 89.9,
    });

    membroId = await pessoaSvc.addIfNotExists({
      nome: "João Silva",
      matricula: "20231001",
      email: "joao@email.com",
      telefone: "(11) 98765-4321",
    });
  });

  afterAll(() => {
    // Limpar banco de dados após todos os testes
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  describe("create", () => {
    it("deve criar um empréstimo com sucesso", async () => {
      const dataEmprestimo = new Date().toISOString();
      const dataDevolucaoPrevista = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString();

      const emprestimoId = await emprestimoSvc.create({
        livroId,
        membroId,
        dataEmprestimo,
        dataDevolucaoPrevista,
      });

      expect(emprestimoId).toBeDefined();
      expect(typeof emprestimoId).toBe("string");

      const emprestimo = await emprestimoSvc.findById(emprestimoId);
      expect(emprestimo).toBeDefined();
      expect(emprestimo?.livroId).toBe(livroId);
      expect(emprestimo?.membroId).toBe(membroId);
      expect(emprestimo?.devolvido).toBe(false);
    });

    it("deve decrementar o estoque do livro ao criar empréstimo", async () => {
      const livroAntes = await livroSvc.findById(livroId);
      const estoqueInicial = livroAntes?.quantidadeEstoque || 0;

      await emprestimoSvc.create({
        livroId,
        membroId,
        dataEmprestimo: new Date().toISOString(),
        dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      });

      const livroDepois = await livroSvc.findById(livroId);
      expect(livroDepois?.quantidadeEstoque).toBe(estoqueInicial - 1);
    });

    it("deve lançar erro ao tentar emprestar livro inexistente", async () => {
      await expect(
        emprestimoSvc.create({
          livroId: "id-inexistente",
          membroId,
          dataEmprestimo: new Date().toISOString(),
          dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        })
      ).rejects.toThrow("Livro não encontrado");
    });

    it("deve lançar erro ao tentar emprestar para membro inexistente", async () => {
      await expect(
        emprestimoSvc.create({
          livroId,
          membroId: "id-inexistente",
          dataEmprestimo: new Date().toISOString(),
          dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        })
      ).rejects.toThrow("Membro não encontrado");
    });

    it("deve lançar erro ao tentar emprestar para membro inativo", async () => {
      await pessoaSvc.updateById(membroId, { ativo: false });

      await expect(
        emprestimoSvc.create({
          livroId,
          membroId,
          dataEmprestimo: new Date().toISOString(),
          dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        })
      ).rejects.toThrow("Membro inativo não pode realizar empréstimos");
    });

    it("deve lançar erro ao tentar emprestar livro sem estoque", async () => {
      // Zerar estoque
      await livroSvc.updateById(livroId, { quantidadeEstoque: 0 });

      await expect(
        emprestimoSvc.create({
          livroId,
          membroId,
          dataEmprestimo: new Date().toISOString(),
          dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        })
      ).rejects.toThrow("Livro indisponível para empréstimo");
    });
  });

  describe("devolver", () => {
    let emprestimoId: string;

    beforeEach(async () => {
      emprestimoId = await emprestimoSvc.create({
        livroId,
        membroId,
        dataEmprestimo: new Date().toISOString(),
        dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      });
    });

    it("deve devolver um empréstimo com sucesso", async () => {
      const emprestimoDevolvido = await emprestimoSvc.devolver(emprestimoId);

      expect(emprestimoDevolvido.devolvido).toBe(true);
      expect(emprestimoDevolvido.dataDevolucaoReal).toBeDefined();
    });

    it("deve incrementar o estoque do livro ao devolver", async () => {
      const livroAntes = await livroSvc.findById(livroId);
      const estoqueAntes = livroAntes?.quantidadeEstoque || 0;

      await emprestimoSvc.devolver(emprestimoId);

      const livroDepois = await livroSvc.findById(livroId);
      expect(livroDepois?.quantidadeEstoque).toBe(estoqueAntes + 1);
    });

    it("deve lançar erro ao tentar devolver empréstimo inexistente", async () => {
      await expect(emprestimoSvc.devolver("id-inexistente")).rejects.toThrow(
        "Empréstimo não encontrado"
      );
    });

    it("deve lançar erro ao tentar devolver empréstimo já devolvido", async () => {
      await emprestimoSvc.devolver(emprestimoId);

      await expect(emprestimoSvc.devolver(emprestimoId)).rejects.toThrow(
        "Este empréstimo já foi devolvido"
      );
    });

    it("deve aceitar data customizada de devolução", async () => {
      const dataCustomizada = new Date("2025-12-25").toISOString();
      const emprestimoDevolvido = await emprestimoSvc.devolver(emprestimoId, dataCustomizada);

      expect(emprestimoDevolvido.dataDevolucaoReal).toBe(dataCustomizada);
    });
  });

  describe("listAll", () => {
    it("deve listar todos os empréstimos", async () => {
      await emprestimoSvc.create({
        livroId,
        membroId,
        dataEmprestimo: new Date().toISOString(),
        dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      });

      await emprestimoSvc.create({
        livroId,
        membroId,
        dataEmprestimo: new Date().toISOString(),
        dataDevolucaoPrevista: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
      });

      const emprestimos = await emprestimoSvc.listAll();
      expect(emprestimos.length).toBe(2);
    });

    it("deve retornar array vazio quando não há empréstimos", async () => {
      const emprestimos = await emprestimoSvc.listAll();
      expect(emprestimos).toEqual([]);
    });
  });

  describe("findAtivos", () => {
    it("deve listar apenas empréstimos ativos", async () => {
      const emp1 = await emprestimoSvc.create({
        livroId,
        membroId,
        dataEmprestimo: new Date().toISOString(),
        dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      });

      const emp2 = await emprestimoSvc.create({
        livroId,
        membroId,
        dataEmprestimo: new Date().toISOString(),
        dataDevolucaoPrevista: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
      });

      // Devolver um empréstimo
      await emprestimoSvc.devolver(emp1);

      const ativos = await emprestimoSvc.findAtivos();
      expect(ativos.length).toBe(1);
      expect(ativos[0]?.id).toBe(emp2);
    });
  });

  describe("findByMembroId", () => {
    it("deve listar empréstimos de um membro específico", async () => {
      await emprestimoSvc.create({
        livroId,
        membroId,
        dataEmprestimo: new Date().toISOString(),
        dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      });

      const emprestimos = await emprestimoSvc.findByMembroId(membroId);
      expect(emprestimos.length).toBe(1);
      expect(emprestimos[0]?.membroId).toBe(membroId);
    });

    it("deve retornar array vazio para membro sem empréstimos", async () => {
      const emprestimos = await emprestimoSvc.findByMembroId("id-inexistente");
      expect(emprestimos).toEqual([]);
    });
  });
});
