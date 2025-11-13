import { JsonStorage } from "../storage/JsonStorage";

async function main() {
  const store = new JsonStorage();

  // criar um livro
  const novoLivro = {
    titulo: "O Guia do Desenvolvedor",
    autor: "Maria Silva",
    isbn: "978-0-0000-0000-1",
    anoPublicacao: 2025,
    quantidadeEstoque: 3,
    preco: 59.9,
  };

  const livroId = await store.add("livros", novoLivro as any);
  console.log("Livro criado com id:", livroId);

  // criar uma pessoa
  const novaPessoa = {
    nome: "João Pereira",
    endereco: "Rua Exemplo, 123",
    telefone: "",
    email: "",
  };

  const pessoaId = await store.add("pessoas", novaPessoa as any);
  console.log("Pessoa criada com id:", pessoaId);

  // criar um emprestimo
  const agora = new Date();
  const devolucao = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const novoEmprestimo = {
    livroId,
    pessoaId,
    dataEmprestimo: agora.toISOString(),
    dataDevolucao: devolucao.toISOString(),
    devolvido: false,
  };

  const emprestimoId = await store.add("emprestimos", novoEmprestimo as any);
  console.log("Emprestimo criado com id:", emprestimoId);

  // mostrar conteúdo atual
  const livros = await store.getAll("livros");
  const pessoas = await store.getAll("pessoas");
  const emprestimos = await store.getAll("emprestimos");

  console.log("\n=== DB Preview ===");
  console.log("Livros:", livros);
  console.log("Pessoas:", pessoas);
  console.log("Emprestimos:", emprestimos);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
