import { Emprestimo } from "../Services/Membros/emprestimos/Emprestimo";
import { Livro } from "../Services/Membros/ModuleCadLivros/Livro";
import { Pessoas } from "../Services/Membros/Pessoas";

import {describe, expect, test} from '@jest/globals';

describe('Testes de Empréstimo de livros', () => {
    test("deve realizar um emprestimo com sucesso", () => {
        const livro = new Livro("1984", "George Orwell", "978-0451524935", 1949);
        const pessoa = new Pessoas("João Silva", 12345, "Rua A, 123");
        const emprestimo = new Emprestimo(livro, pessoa, new Date('2024-06-01'), new Date('2024-06-15'));
        
        emprestimo.realizarEmprestimo();
        expect(emprestimo.realizarEmprestimo).toBeDefined;

    });
    test("deve realizar uma devolução com sucesso", () => {
        const livro = new Livro("1984", "George Orwell", "978-0451524935", 1949);
        const pessoa = new Pessoas("João Silva", 12345, "Rua A, 123");
        const emprestimo = new Emprestimo(livro, pessoa, new Date('2024-06-01'), new Date('2024-06-15'));
        emprestimo.realizarDevolucao();
        expect(emprestimo.realizarDevolucao).toBeDefined;
    })

    test("deve Listar emprestimos ativos", () => {
        const livro = new Livro("1984", "George Orwell", "978-0451524935", 1949);
        const pessoa = new Pessoas("João Silva", 12345, "Rua A, 123");
        const emprestimo = new Emprestimo(livro, pessoa, new Date('2024-06-01'), new Date('2024-06-15'));
        emprestimo.listarEmprestimosAtivos();
        expect(emprestimo.listarEmprestimosAtivos).toBeDefined;
    })

})