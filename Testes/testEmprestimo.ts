import { Livro } from "../src/domain/Livro";
import { Pessoa } from "../src/domain/Pessoa";
import {describe, expect, test} from '@jest/globals';

// Nota: Este teste está desatualizado. A classe Emprestimo agora usa uma arquitetura diferente.
// Consulte TestEmprestimoService.ts para testes atualizados.

describe('Testes de Empréstimo de livros (LEGADO - usar TestEmprestimoService.ts)', () => {
    test("deve criar um livro e pessoa", () => {
        const livro = new Livro({
            titulo: "1984",
            autor: "George Orwell",
            isbn: "978-0451524935",
            anoPublicacao: 1949,
            quantidadeEstoque: 5,
            preco: 29.90
        });
        const pessoa = new Pessoa({
            nome: "João Silva"
        });
        
        expect(livro.titulo).toBe("1984");
        expect(pessoa.nome).toBe("João Silva");
    });
})