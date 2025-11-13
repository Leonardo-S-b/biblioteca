export class Livro {
    protected titulo: string;
    protected autor: string;
    protected isbn: string;
    protected anoPublicacao: number;

    constructor(titulo: string, autor: string, isbn: string, anoPublicacao: number) {
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
        this.anoPublicacao = anoPublicacao;
    }

    get tituloLivro(): string { return this.titulo; }
    get autorLivro(): string { return this.autor; }
    get isbnLivro(): string { return this.isbn; }
    get anoPublicacaoLivro(): number { return this.anoPublicacao; }
}
