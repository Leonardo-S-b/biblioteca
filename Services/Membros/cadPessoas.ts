import { Pessoas } from "./Pessoas";

export class cadPessoas extends Pessoas{
    private _addPessoa: boolean;
    private _removerPessoa: boolean;
    private _editarPessoa: boolean
    constructor(nome: string, numMatricula: number, endereco: string, addPessoa: boolean, removerPessoa: boolean, editarPessoa: boolean){
        super(nome, numMatricula, endereco);
        this._addPessoa = addPessoa;
        this._removerPessoa = removerPessoa;
        this._editarPessoa = editarPessoa;
    }
    get addPessoa(): boolean{
        return this._addPessoa;
    }   
    get removerPessoa(): boolean{
        return this._removerPessoa;
    }
    get editarPessoa(): boolean{
        return this._editarPessoa;
    }
 
    cadastrarPessoas(): void{
        console.log(`Pessoa ${this.nome} cadastrada com sucesso!`)
        this._addPessoa = true;
    }

    removerPessoas(): void{
        console.log(`Pessoa ${this.nome} removida com sucesso!`)
        this._removerPessoa = true;
    }

    editarPessoas(novoEndereco: string): void{
        this.endereco = novoEndereco;
        console.log(`Pessoa ${this.nome} editada com sucesso! Novo endereço: ${this.endereco}`);
        this._editarPessoa = true;
    }
    
}