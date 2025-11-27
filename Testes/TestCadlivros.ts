import {describe, expect, test} from '@jest/globals';
import { Livro } from '../src/domain/Livro';

// Nota: Para testes completos com persistência, veja os testes de LivroService
describe('testes de domínio de Livros', () => {
    test('Deve criar um Livro com sucesso', () => {
        const livro = new Livro({
            titulo: "O senhor dos Anéis",
            autor: "J.R.R. Tolkien",
            isbn: "978-0261102385",
            anoPublicacao: 1954,
            quantidadeEstoque: 10,
            preco: 59.90
        });
        
        expect(livro.titulo).toBe("O senhor dos Anéis");
        expect(livro.autor).toBe("J.R.R. Tolkien");
        expect(livro.estaDisponivel).toBe(true);
    });

    test("deve atualizar o estoque do livro", () => {
        const livro = new Livro({
            titulo: "O senhor dos Anéis",
            autor: "J.R.R. Tolkien",
            isbn: "978-0261102385",
            anoPublicacao: 1954,
            quantidadeEstoque: 10,
            preco: 59.90
        });
        
        livro.atualizarEstoque(-3);
        expect(livro.quantidadeEstoque).toBe(7);
    });

    test("deve editar o preço do livro", () => {
        const livro = new Livro({
            titulo: "O senhor dos Anéis",
            autor: "J.R.R. Tolkien",
            isbn: "978-0261102385",
            anoPublicacao: 1954,
            quantidadeEstoque: 10,
            preco: 59.90
        });
        
        livro.preco = 49.90;
        expect(livro.preco).toBe(49.90);
    });

    test("deve editar o nome do autor do Livro", () => {
        const livro = new Livro({
            titulo: "O senhor dos Anéis",
            autor: "J.R.R. Tolkien",
            isbn: "978-0261102385",
            anoPublicacao: 1954,
            quantidadeEstoque: 10,
            preco: 59.90
        });
        
        livro.autor = "John Ronald Reuel Tolkien";
        expect(livro.autor).toBe("John Ronald Reuel Tolkien");
    });

    test("deve verificar disponibilidade do livro", () => {
        const livro = new Livro({
            titulo: "O senhor dos Anéis",
            autor: "J.R.R. Tolkien",
            isbn: "978-0261102385",
            anoPublicacao: 1954,
            quantidadeEstoque: 0,
            preco: 59.90
        });
        
        expect(livro.estaDisponivel).toBe(false);
    });

    test("deve registrar empréstimo e devolução", () => {
        const livro = new Livro({
            titulo: "O senhor dos Anéis",
            autor: "J.R.R. Tolkien",
            isbn: "978-0261102385",
            anoPublicacao: 1954,
            quantidadeEstoque: 10,
            preco: 59.90
        });
        
        livro.registrarEmprestimo();
        expect(livro.quantidadeEstoque).toBe(9);
        
        livro.registrarDevolucao();
        expect(livro.quantidadeEstoque).toBe(10);
    });
});