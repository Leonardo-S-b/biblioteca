import { Membro } from "../src/domain/Membro";
import {describe, expect, test} from '@jest/globals';

// Nota: Use TestPessoaService.ts para testes completos com o serviço
describe("teste de cadastro de pessoas (usando domínio atualizado)", ()=> {
    test("deve criar um membro com sucesso", () => {
        const membro = new Membro({
            nome: "Leonardo Bezerra",
            matricula: "12345",
            endereco: "Rua A, 123"
        });
        expect(membro.nome).toBe("Leonardo Bezerra");
        expect(membro.matricula).toBe("12345");
        expect(membro.ativo).toBe(true);
    });

    test("deve desativar um membro", () => {
        const membro = new Membro({
            nome: "Leonardo Bezerra",
            matricula: "12345",
            endereco: "Rua A, 123"
        });
        membro.desativar();
        expect(membro.ativo).toBe(false);
    });

    test("deve reativar um membro", () => {
        const membro = new Membro({
            nome: "Leonardo Bezerra",
            matricula: "12345",
            endereco: "Rua A, 123"
        });
        membro.desativar();
        membro.reativar();
        expect(membro.ativo).toBe(true);
    });

    test("deve atualizar o endereço de um membro", () => {
        const membro = new Membro({
            nome: "Leonardo Bezerra",
            matricula: "12345",
            endereco: "Rua A, 123"
        });
        membro.endereco = "Rua B, 456";
        expect(membro.endereco).toBe("Rua B, 456");
    });
})