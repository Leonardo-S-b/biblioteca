import {describe, expect, test} from '@jest/globals';
import { CadLivros } from '../Services/Membros/ModuleCadLivros/CadLivros';

describe('testes de cadastro de Livros', () => {
    test('Deve cadastrar um Livro com sucesso',() => {
        const cadLivros = new CadLivros( "O senhor dos Anéis", "J.R.R. Tolkien", "978-0261102385", 1954, 10, 59.90, false, false, false);
        cadLivros.cadastrarLivros();
        expect(cadLivros.addLivro).toBe(true);

    })
})

describe("testes de remoção de Livros", () => {
    test("deve remover um livro cadastrado com sucesso", () =>{
        const cadLivros = new CadLivros( "O senhor dos Anéis", "J.R.R. Tolkien", "978-0261102385", 1954, 10, 59.90, false, false, false);
    cadLivros.removerLivros();
    expect(cadLivros.removerLivros).toBeDefined;    
    })


})


describe("deve editar livro com sucesso", ()=> {
    test("deve editar o preço do livro", () =>{
        const cadLivros = new CadLivros( "O senhor dos Anéis", "J.R.R. Tolkien", "978-0261102385", 1954, 10, 59.90, false, false, false);
        cadLivros.editarLivros(49.90);
        expect(cadLivros.editarLivro).toBe(true);
    })

    test("deve editar o nome do autor do Livro", ()=> {
        const cadLivros = new CadLivros( "O senhor dos Anéis", "J.R.R. Tolkien", "978-0261102385", 1954, 10, 59.90, false, false, false);
        cadLivros.Autor = "John Ronald Reuel Tolkien";
        expect(cadLivros.Autor).toBe("John Ronald Reuel Tolkien");

        test("deve listar a quantidade em estoque do livro", ()=> {
            const cadLivros = new CadLivros( "O senhor dos Anéis", "J.R.R. Tolkien", "978-0261102385", 1954, 10, 59.90, false, false, false);
            cadLivros.listarQuantidadeEstoque();
            expect(cadLivros.quantidadeEstoque).toBe(11);

        });
    })
})