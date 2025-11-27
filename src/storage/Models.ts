export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  anoPublicacao: number;
  quantidadeEstoque: number;
  preco: number;
}

export interface Pessoa {
  id: string;
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  matricula?: string;
  ativo?: boolean;
}

export interface Emprestimo {
  id: string;
  livroId: string;
  pessoaId: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista?: string;
  dataDevolucaoReal?: string;
  devolvido: boolean;
}

export interface Database {
  pessoas: Pessoa[];
  livros: Livro[];
  emprestimos: Emprestimo[];
}