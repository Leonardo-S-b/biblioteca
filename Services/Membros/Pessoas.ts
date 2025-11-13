export class Pessoas{
    private _nome: string;
    private _nuMatricula: number;
    private _endereco: string;
    constructor(nome: string, numMatricula: number, endereco: string){
        this._nome = nome;
        this._nuMatricula = numMatricula;
        this._endereco = endereco;
    }
    get nome(): string{
        return this._nome;

    }
    get nuMatricula(): number{
        return this._nuMatricula;

    }
    get endereco(): string{
        return this._endereco;

    }
    set endereco(novoEndereco: string){
        this._endereco = novoEndereco;
    }
    
}