import { cadPessoas } from "../Services/Membros/CadPessoas";
import {describe, expect, test} from '@jest/globals';

describe("teste de cadastro de pessoas", ()=> {
    test("deve cadastrar uma pessoa com sucesso", () => {
        const cadPessoa = new cadPessoas("Leonardo Bezerra", 12345, "Rua A, 123", false, false, false);
        cadPessoa.cadastrarPessoas();
        expect(cadPessoa.cadastrarPessoas).toBeDefined;
    })


    test ("deve remover uma pessoa cadastrada", () => {
        const cadPessoa = new cadPessoas("Leonardo Bezerra", 12345, "Rua A, 123", false, false, false);
        cadPessoa.removerPessoas();
        expect(cadPessoa.removerPessoas).toBeDefined;

    })

    test("deve editar o cadastro de uma pessoa", () => {
        const cadPessoa = new cadPessoas("Leonardo Bezerra", 12345, "Rua A, 123", false, false, false);
        cadPessoa.editarPessoas("Rua B, 456");
        expect(cadPessoa.editarPessoas).toBeDefined;
    })
})