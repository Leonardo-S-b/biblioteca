import { PessoaService } from "../src/services/PessoaService";
import { JsonStorage } from "../src/storage/JsonStorage";
import * as path from "path";
import * as fs from "fs";
import { describe, beforeEach, afterEach, test, expect } from "@jest/globals";

describe("teste do PessoaService", () => {
    let storagePath: string;
    let storage: JsonStorage;
    let pessoaService: PessoaService;

    beforeEach(() => {
        storagePath = path.join(__dirname, "storageTest.json");
        if (fs.existsSync(storagePath)) {
            fs.unlinkSync(storagePath);
        }
        fs.writeFileSync(storagePath, JSON.stringify({}));
        storage = new JsonStorage(storagePath);
        pessoaService = new PessoaService(storage);
    });

    afterEach(() => {
        if (fs.existsSync(storagePath)) {
            fs.unlinkSync(storagePath);
        }
    });

    test("deve adicionar uma nova pessoa se não existir", async () => {
        const dto = { nome: "João Silva", endereco: "Rua A, 123" };
        const id = await pessoaService.addIfNotExists(dto);
        expect(id).toBeDefined();
    });

    test("deve retornar o id da pessoa existente usando findById", async () => {
        const dto = { nome: "Maria Souza", endereco: "Rua B, 456" };
        const idAdicionado = await pessoaService.addIfNotExists(dto);
        console.log("ID adicionado:", idAdicionado);

        const pessoaEncontrada = await pessoaService.findById(idAdicionado);
        console.log("Pessoa encontrada:", pessoaEncontrada);

        expect(pessoaEncontrada).toBeDefined();
        expect(pessoaEncontrada?.id).toBe(idAdicionado);
    });

    test("deve listar todas as pessoas", async ()=>{
        const dto1 = { nome: "Ana Lima", endereco: "Rua C, 789" };
        const dto2 = { nome: "Carlos Pereira", endereco: "Rua D, 101" };
        await pessoaService.addIfNotExists(dto1);
        await pessoaService.addIfNotExists(dto2);
        const todasPessoas = await pessoaService.listAll();
        expect(todasPessoas.length).toBe(2);
    })
});