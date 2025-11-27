export interface LivroProps {
  id?: string;
  titulo: string;
  autor: string;
  isbn: string;
  anoPublicacao: number;
  quantidadeEstoque: number;
  preco: number;
}

export class Livro {
  private _id: string | undefined;
  private _titulo: string;
  private _autor: string;
  private _isbn: string;
  private _anoPublicacao: number;
  private _quantidadeEstoque: number;
  private _preco: number;

  constructor(props: LivroProps) {
    this._id = props.id;
    this._titulo = Livro.validarTexto(props.titulo, "Título");
    this._autor = Livro.validarTexto(props.autor, "Autor");
    this._isbn = Livro.validarTexto(props.isbn, "ISBN");
    this._anoPublicacao = Livro.validarAno(props.anoPublicacao);
    this._quantidadeEstoque = Livro.validarEstoque(props.quantidadeEstoque);
    this._preco = Livro.validarPreco(props.preco);
  }

  private static validarTexto(valor: string, label: string): string {
    const trimmed = valor?.trim();
    if (!trimmed) {
      throw new Error(`${label} é obrigatório.`);
    }
    return trimmed;
  }

  private static validarAno(valor: number): number {
    if (!Number.isInteger(valor) || valor <= 0) {
      throw new Error("Ano de publicação inválido.");
    }
    return valor;
  }

  private static validarEstoque(valor: number): number {
    if (!Number.isInteger(valor) || valor < 0) {
      throw new Error("Quantidade de estoque inválida.");
    }
    return valor;
  }

  private static validarPreco(valor: number): number {
    if (!Number.isFinite(valor) || valor < 0) {
      throw new Error("Preço inválido.");
    }
    return Number(valor.toFixed(2));
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(value: string | undefined) {
    const trimmed = value?.trim();
    this._id = trimmed && trimmed.length > 0 ? trimmed : undefined;
  }

  get titulo(): string {
    return this._titulo;
  }

  set titulo(value: string) {
    this._titulo = Livro.validarTexto(value, "Título");
  }

  get autor(): string {
    return this._autor;
  }

  set autor(value: string) {
    this._autor = Livro.validarTexto(value, "Autor");
  }

  get isbn(): string {
    return this._isbn;
  }

  set isbn(value: string) {
    this._isbn = Livro.validarTexto(value, "ISBN");
  }

  get anoPublicacao(): number {
    return this._anoPublicacao;
  }

  set anoPublicacao(value: number) {
    this._anoPublicacao = Livro.validarAno(value);
  }

  get quantidadeEstoque(): number {
    return this._quantidadeEstoque;
  }

  get preco(): number {
    return this._preco;
  }

  set preco(value: number) {
    this._preco = Livro.validarPreco(value);
  }

  get estaDisponivel(): boolean {
    return this._quantidadeEstoque > 0;
  }

  atualizarEstoque(delta: number): void {
    if (!Number.isInteger(delta)) {
      throw new Error("Variação de estoque deve ser um número inteiro.");
    }
    const proximo = this._quantidadeEstoque + delta;
    if (proximo < 0) {
      throw new Error("Estoque insuficiente para a operação.");
    }
    this._quantidadeEstoque = proximo;
  }

  registrarEmprestimo(): void {
    this.atualizarEstoque(-1);
  }

  registrarDevolucao(): void {
    this.atualizarEstoque(1);
  }

  toJSON(): LivroProps {
    const payload: LivroProps = {
      titulo: this._titulo,
      autor: this._autor,
      isbn: this._isbn,
      anoPublicacao: this._anoPublicacao,
      quantidadeEstoque: this._quantidadeEstoque,
      preco: this._preco,
    };
    if (this._id) payload.id = this._id;
    return payload;
  }
}
