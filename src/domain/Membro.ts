import { Pessoa, PessoaProps } from "./Pessoa";

export interface MembroProps extends PessoaProps {
  matricula: string;
  ativo?: boolean;
}

export class Membro extends Pessoa {
  private _matricula: string;
  private _ativo: boolean;

  constructor(props: MembroProps) {
    super(props);
    const matricula = props.matricula?.trim();
    if (!matricula) {
      throw new Error("Matrícula do membro é obrigatória.");
    }
    this._matricula = matricula;
    this._ativo = props.ativo ?? true;
  }

  get matricula(): string {
    return this._matricula;
  }

  set matricula(value: string) {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new Error("Matrícula do membro é obrigatória.");
    }
    this._matricula = trimmed;
  }

  get ativo(): boolean {
    return this._ativo;
  }

  desativar(): void {
    this._ativo = false;
  }

  reativar(): void {
    this._ativo = true;
  }

  override getDescricao(): string {
    const status = this._ativo ? "Ativo" : "Inativo";
    return `${this.nome} (Matrícula ${this._matricula}) - ${status}`;
  }

  override toJSON(): MembroProps {
    const payload = super.toJSON() as MembroProps;
    payload.matricula = this._matricula;
    payload.ativo = this._ativo;
    return payload;
  }
}
