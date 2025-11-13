import { Livro } from "./Livro";


export class CadLivros extends Livro {
    private _addLivro: boolean;
    private _quantidadeEstoque: number
    private _preco: number;
    private _removerLivro: boolean
    private _editarLivro: boolean;
    constructor(titulo: string, autor: string, isbn: string, anoPublicacao: number, quantidadeEstoque: number, preco: number, removerLivro: boolean, addLivro: boolean, editarLivro: boolean) {

        super(titulo, autor, isbn, anoPublicacao);
        this._quantidadeEstoque = quantidadeEstoque;
        this._preco = preco;
        this._removerLivro = removerLivro;
        this._addLivro = addLivro;
        this._editarLivro = editarLivro;
    }
    get quantidadeEstoque(): number {return this._quantidadeEstoque;}
    get preco(): number {return this._preco;}
    get addLivro(): boolean {return this._addLivro;}
    get editarLivro(): boolean {return this._editarLivro;}
    get removerLivro(): boolean {return this._removerLivro;}
    
    
    cadastrarLivros(): void{
        console.log(`Livro ${this.titulo} cadastrado com sucesso!`)
        this._addLivro = true;
     }

    removerLivros(): void{
        console.log(`Livro ${this.titulo} removido com sucesso!`)
        this._removerLivro = true;
     }
    editarLivros(novoPreco: number): void{
        this._preco = novoPreco;
        console.log(`Livro ${this.titulo} editado com sucesso! Novo preço: ${this._preco}`);
        this._editarLivro = true;
    }

    listarQuantidadeEstoque(): void {
        console.log(`O livro ${this.titulo} possui ${this._quantidadeEstoque} unidades em estoque.`);
    }




}