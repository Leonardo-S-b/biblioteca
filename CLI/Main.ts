import promptSync = require("prompt-sync");
import chalk from "chalk";
import { LivroService } from "../src/services/LivroService";
import { PessoaService } from "../src/services/PessoaService";
import { EmprestimoService } from "../src/services/EmprestimoService";
import { JsonStorage } from "../src/storage/JsonStorage";

const prompt = promptSync({ sigint: true });
const storage = new JsonStorage("./data/db.json");
const livroService = new LivroService(storage);
const pessoaService = new PessoaService(storage);
const emprestimoService = new EmprestimoService(storage, livroService, pessoaService);

// ===== Funções Helper para Formatação =====

function titulo(texto: string) {
  console.log("\n" + chalk.bold.cyan("═".repeat(60)));
  console.log(chalk.bold.cyan(`  ${texto}`));
  console.log(chalk.bold.cyan("═".repeat(60)));
}

function sucesso(mensagem: string) {
  console.log(chalk.green("✓ " + mensagem));
}

function erro(mensagem: string) {
  console.log(chalk.red("✗ " + mensagem));
}

function info(mensagem: string) {
  console.log(chalk.yellow("ℹ " + mensagem));
}

function separador() {
  console.log(chalk.gray("─".repeat(60)));
}

function readString(mensagem: string): string {
  return prompt(chalk.white(mensagem + ": ")) || "";
}

function readNumber(mensagem: string): number {
  const valor = prompt(chalk.white(mensagem + ": "));
  return parseInt(valor || "0", 10);
}

// ===== Menu Principal =====

function exibirMenu() {
  titulo("🏛️  SISTEMA DE BIBLIOTECA");
  console.log(chalk.white("\n  📚 LIVROS"));
  console.log(chalk.gray("    1. Cadastrar Livro"));
  console.log(chalk.gray("    2. Listar Livros"));
  
  console.log(chalk.white("\n  👥 MEMBROS"));
  console.log(chalk.gray("    3. Cadastrar Membro"));
  console.log(chalk.gray("    4. Listar Membros"));
  
  console.log(chalk.white("\n  📋 EMPRÉSTIMOS"));
  console.log(chalk.gray("    5. Realizar Empréstimo"));
  console.log(chalk.gray("    6. Devolver Livro"));
  console.log(chalk.gray("    7. Listar Empréstimos"));
  
  console.log(chalk.red("\n    0. Sair\n"));
  separador();
}

// ===== Funções de Livros =====

async function cadastrarLivro() {
  titulo("📚 Cadastrar Livro");
  
  const tituloLivro = readString("Título");
  const autor = readString("Autor");
  const isbn = readString("ISBN");
  const anoPublicacao = readNumber("Ano de Publicação");
  const preco = parseFloat(readString("Preço"));
  const quantidadeEstoque = readNumber("Quantidade em Estoque");

  try {
    const livroId = await livroService.addIfNotExists({ 
      titulo: tituloLivro, 
      autor, 
      isbn,
      anoPublicacao, 
      preco,
      quantidadeEstoque 
    });
    sucesso(`Livro cadastrado com ID: ${livroId}`);
  } catch (e) {
    erro("Erro ao cadastrar livro: " + (e as Error).message);
  }
}

async function listarLivros() {
  titulo("📚 Lista de Livros");
  const livros = await livroService.listAll();
  
  if (livros.length === 0) {
    info("Nenhum livro cadastrado.");
    return;
  }
  
  console.log();
  livros.forEach((livro) => {
    separador();
    console.log(chalk.cyan(`  ID: ${livro.id}`));
    console.log(chalk.white(`  Título: ${livro.titulo}`));
    console.log(chalk.white(`  Autor: ${livro.autor}`));
    console.log(chalk.white(`  ISBN: ${livro.isbn}`));
    console.log(chalk.white(`  Ano: ${livro.anoPublicacao}`));
    console.log(chalk.white(`  Preço: R$ ${livro.preco.toFixed(2)}`));
    console.log(chalk.white(`  Estoque: ${livro.quantidadeEstoque > 0 ? chalk.green(livro.quantidadeEstoque) : chalk.red("0 (indisponível)")}`));
  });
  separador();
  console.log(chalk.bold.white(`\n  Total: ${livros.length} livro(s)`));
}

// ===== Funções de Membros =====

async function cadastrarMembro() {
  titulo("👥 Cadastrar Membro");
  
  const nomeMembro = readString("Nome");
  const cpf = readString("CPF");
  const endereco = readString("Endereço");
  const telefone = readString("Telefone");
  const email = readString("Email");
  const matricula = readString("Matrícula");

  try {
    const membroDto = { nome: nomeMembro, cpf, endereco, telefone, email, matricula, ativo: true };
    const membroId = await pessoaService.addIfNotExists(membroDto);
    sucesso(`Membro cadastrado com ID: ${membroId}`);
  } catch (e) {
    erro("Erro ao cadastrar membro: " + (e as Error).message);
  }
}

async function listarMembros() {
  titulo("👥 Lista de Membros");
  const membros = await pessoaService.listAll();
  
  if (membros.length === 0) {
    info("Nenhum membro cadastrado.");
    return;
  }
  
  console.log();
  membros.forEach((membro) => {
    separador();
    console.log(chalk.cyan(`  ID: ${membro.id}`));
    console.log(chalk.white(`  Nome: ${membro.nome}`));
    console.log(chalk.white(`  Matrícula: ${membro.matricula}`));
    if (membro.email) console.log(chalk.white(`  Email: ${membro.email}`));
    if (membro.telefone) console.log(chalk.white(`  Telefone: ${membro.telefone}`));
    const statusTexto = membro.ativo ? chalk.green("✓ Ativo") : chalk.red("✗ Inativo");
    console.log(chalk.white(`  Status: ${statusTexto}`));
  });
  separador();
  console.log(chalk.bold.white(`\n  Total: ${membros.length} membro(s)`));
}

// ===== Funções de Empréstimos =====

async function realizarEmprestimo() {
  titulo("📋 Realizar Empréstimo");
  
  const livroId = readString("ID do Livro");
  const membroId = readString("ID do Membro");
  const dataEmprestimo = readString("Data do Empréstimo (YYYY-MM-DD)");
  const dataDevolucaoPrevista = readString("Data de Devolução Prevista (YYYY-MM-DD)");

  try {
    const emprestimoId = await emprestimoService.create({
      livroId,
      membroId,
      dataEmprestimo,
      dataDevolucaoPrevista,
    });
    sucesso(`Empréstimo realizado com ID: ${emprestimoId}`);
    info(`Data do empréstimo: ${new Date(dataEmprestimo).toLocaleDateString('pt-BR')}`);
  } catch (e) {
    erro("Erro ao realizar empréstimo: " + (e as Error).message);
  }
}

async function devolverLivro() {
  titulo("📋 Devolver Livro");
  
  const emprestimoId = readString("ID do Empréstimo");
  const dataDevolucao = readString("Data da Devolução (YYYY-MM-DD ou deixe vazio para hoje)");

  try {
    const emprestimo = await emprestimoService.devolver(emprestimoId, dataDevolucao || undefined);
    sucesso("Livro devolvido com sucesso!");
    if (emprestimo.dataDevolucaoReal) {
      info(`Data da devolução: ${new Date(emprestimo.dataDevolucaoReal).toLocaleDateString('pt-BR')}`);
    }
  } catch (e) {
    erro("Erro ao devolver livro: " + (e as Error).message);
  }
}

async function listarEmprestimos() {
  titulo("📋 Lista de Empréstimos");
  const emprestimos = await emprestimoService.listAll();
  
  if (emprestimos.length === 0) {
    info("Nenhum empréstimo registrado.");
    return;
  }
  
  let ativos = 0;
  let devolvidos = 0;
  
  console.log();
  emprestimos.forEach((emp) => {
    separador();
    console.log(chalk.cyan(`  ID: ${emp.id}`));
    console.log(chalk.white(`  Livro ID: ${emp.livroId}`));
    console.log(chalk.white(`  Membro ID: ${emp.membroId}`));
    console.log(chalk.white(`  Data do Empréstimo: ${new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR')}`));
    console.log(chalk.white(`  Devolução Prevista: ${new Date(emp.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}`));
    
    if (emp.dataDevolucaoReal) {
      console.log(chalk.green(`  ✓ Devolvido em: ${new Date(emp.dataDevolucaoReal).toLocaleDateString('pt-BR')}`));
      devolvidos++;
    } else {
      console.log(chalk.yellow(`  ⏳ Status: Ativo (não devolvido)`));
      ativos++;
    }
  });
  separador();
  console.log(chalk.bold.white(`\n  Total: ${emprestimos.length} empréstimo(s)`));
  console.log(chalk.yellow(`  ⏳ Ativos: ${ativos}`));
  console.log(chalk.green(`  ✓ Devolvidos: ${devolvidos}`));
}

// ===== Loop Principal =====

async function main() {
  let opcao = -1;
  
  while (opcao !== 0) {
    exibirMenu();
    opcao = readNumber("Escolha uma opção");

    switch (opcao) {
      case 1:
        await cadastrarLivro();
        break;
      case 2:
        await listarLivros();
        break;
      case 3:
        await cadastrarMembro();
        break;
      case 4:
        await listarMembros();
        break;
      case 5:
        await realizarEmprestimo();
        break;
      case 6:
        await devolverLivro();
        break;
      case 7:
        await listarEmprestimos();
        break;
      case 0:
        titulo("👋 Até logo!");
        sucesso("Sistema encerrado.");
        break;
      default:
        erro("Opção inválida! Tente novamente.");
    }
    
    if (opcao !== 0) {
      console.log(chalk.gray("\nPressione Enter para continuar..."));
      prompt("");
    }
  }
}

main();






