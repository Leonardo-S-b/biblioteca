import promptSync = require("prompt-sync");
import { JsonStorage } from "../src/storage/JsonStorage";
import { LivroService } from "../src/services/LivroService";
import { PessoaService } from "../src/services/PessoaService";
import { EmprestimoService } from "../src/services/EmprestimoService";

const prompt = promptSync({ sigint: true });

//função para ler string e retornar nada caso seja nulo
function readString(promptText: string): string {
    const V = prompt(promptText);
    if (!V) return "";
    return V;
}

//aqui verifica e valida se o número digitado é válido
function readNumber(msg: string): number{
   while(true){
    const V = (prompt(msg)??"").trim();
    if(V.length === 0){
        console.log("o valor digitado é obrigatório, tente novamente.");
        continue;
    }
    const N = Number(V);
    if (Number.isFinite(N)) return N; //verififica se é número valido usando isFinite que verifica se é finito ou não.
    console.log("Número inválido, tente novamente.");
   }
}

async function main(){
    const storage = new JsonStorage();
    const livrosvc = new LivroService(storage);
    const pessoasvc = new PessoaService(storage);
    const emprestimosvc = new EmprestimoService(storage);

    try {
        while(true){
            console.log("\n=== Sistema de Biblioteca ===");
            console.log("1) Cadastrar livro");
            console.log("2) Listar livros");
            console.log("3) Cadastrar pessoa");
            console.log("4) Listar pessoas");
            console.log("5) Realizar empréstimo");
            console.log("6) Devolver empréstimo");
            console.log("0) Sair");
            const opt = readString("Escolha: ");

            if(opt === "0"){
                break;
            } else if(opt === "1"){
                const titulo = readString("Título: ");
                const autor = readString("Autor: ");
                const isbn = readString("ISBN: ");
                const ano = readNumber("Ano de publicação: ");
                const qtd = readNumber("Quantidade em estoque: ");
                const preco = Number(readString("Preço: ") || "0");
                const id = await livrosvc.addIfNotExists({
                    titulo,
                    autor,
                    isbn,
                    anoPublicacao: ano,
                    quantidadeEstoque: qtd,
                    preco,
                });
                console.log("Livro cadastrado/confirmado id:", id);
            } else if (opt === "2") {
                const livros = await livrosvc.listAll();
                console.table(livros);
            } else if (opt === "3") {
                const nome = readString("Nome: ");
                const endereco = readString("Endereço: ");
                const id = await pessoasvc.addIfNotExists({ nome, endereco, telefone: "", email: "" });
                console.log("Pessoa cadastrada id:", id);
            } else if (opt === "4") {
                console.table(await pessoasvc.listAll());
            } else if (opt === "5") {
                const isbn = readString("ISBN do livro: ");
                const livro = await livrosvc.findByIsbn(isbn);
                if (!livro) { console.error("Livro não encontrado"); continue; }
                if (livro.quantidadeEstoque <= 0) { console.error("Sem estoque"); continue; }
                const pessoaId = readString("Id da pessoa: "); // ou listar pessoas e pedir escolha
                const pessoa = await pessoasvc.findById(pessoaId);
                if (!pessoa) { console.error("Pessoa não encontrada"); continue; }
                const dataEmp = new Date().toISOString();
                const dataDev = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
                const empId = await emprestimosvc.create(livro.id, pessoa.id, dataEmp, dataDev);
                // decrementar estoque
                await livrosvc.updateStockById(livro.id, -1);
                console.log("Empréstimo criado id:", empId);
            } else if (opt === "6") {
                const emprestimoId = readString("Id do empréstimo: ");
                await emprestimosvc.devolver(emprestimoId);
                console.log("Devolução efetuada.");
            } else {
                console.log("Opção inválida.");
            }
        }
    } catch (err) {
        console.error("Erro:", err instanceof Error ? err.message : err);
    }
    console.log("Encerrando sistema.");
   main().catch(err => {
    console.error("Erro fatal:", err);
    process.exit(1);
   });
}






