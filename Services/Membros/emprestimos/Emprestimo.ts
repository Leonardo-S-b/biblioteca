import { Livro } from "../ModuleCadLivros/Livro";
import { Pessoas } from "../Pessoas";


export class Emprestimo {
    private _livro: Livro;
    private _pessoa: Pessoas | undefined;
    private _dataEmprestimo: Date;
    private _dataDevolucao: Date;

    constructor(livro: Livro, pessoa: Pessoas | undefined, dataEmprestimo: Date, dataDevolucao: Date) {
        this._livro = livro;
        this._pessoa = pessoa;
        this._dataEmprestimo = new Date(dataEmprestimo);
        this._dataDevolucao = new Date(dataDevolucao);
    }

    get livro(): Livro {
        return this._livro;
    }

    get pessoa(): Pessoas | undefined {
        return this._pessoa;
    }

    get dataEmprestimo(): Date {
        return this._dataEmprestimo;
    }

    get dataDevolucao(): Date {
        return this._dataDevolucao;
    }

    realizarEmprestimo(): void {
        console.log(`Empréstimo do livro ${this._livro.tituloLivro} realizado com sucesso!`);
    }

    realizarDevolucao(): void {
        console.log(`Devolução do livro ${this._livro.tituloLivro} realizada com sucesso!`);
    }

    listarEmprestimosAtivos(): void {
        console.log(`Livro emprestado: ${this._livro.tituloLivro}, Data de Empréstimo: ${this._dataEmprestimo.toDateString()}, Data de Devolução: ${this._dataDevolucao.toDateString()}`);
    }
}