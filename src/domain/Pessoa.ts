export interface PessoaProps {
  id?: string;
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
}

export class Pessoa {
  protected _id: string | undefined;
  protected _nome: string;
  protected _endereco: string | undefined;
  protected _telefone: string | undefined;
  protected _email: string | undefined;

  constructor(props: PessoaProps) {
    const nome = props.nome?.trim();
    if (!nome) {
      throw new Error("Nome da pessoa é obrigatório.");
    }
    this._id = props.id;
    this._nome = nome;
    this._endereco = props.endereco?.trim() || undefined;
    this._telefone = props.telefone?.trim() || undefined;
    this._email = props.email?.trim() || undefined;
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(value: string | undefined) {
    const trimmed = value?.trim();
    this._id = trimmed && trimmed.length > 0 ? trimmed : undefined;
  }

  get nome(): string {
    return this._nome;
  }

  set nome(value: string) {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new Error("Nome da pessoa é obrigatório.");
    }
    this._nome = trimmed;
  }

  get endereco(): string | undefined {
    return this._endereco;
  }

  set endereco(value: string | undefined) {
    const trimmed = value?.trim();
    this._endereco = trimmed && trimmed.length > 0 ? trimmed : undefined;
  }

  get telefone(): string | undefined {
    return this._telefone;
  }

  set telefone(value: string | undefined) {
    const trimmed = value?.trim();
    this._telefone = trimmed && trimmed.length > 0 ? trimmed : undefined;
  }

  get email(): string | undefined {
    return this._email;
  }

  set email(value: string | undefined) {
    const trimmed = value?.trim();
    this._email = trimmed && trimmed.length > 0 ? trimmed : undefined;
  }

  getDescricao(): string {
    return `${this._nome}${this._email ? ` <${this._email}>` : ""}`;
  }

  toJSON(): PessoaProps {
    const payload: PessoaProps = {
      nome: this._nome,
    };
    if (this._id) payload.id = this._id;
    if (this._endereco) payload.endereco = this._endereco;
    if (this._telefone) payload.telefone = this._telefone;
    if (this._email) payload.email = this._email;
    return payload;
  }
}
