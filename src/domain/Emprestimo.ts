export interface EmprestimoProps {
  id?: string;
  livroId: string;
  membroId: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal?: string;
  devolvido?: boolean;
}

export class Emprestimo {
  private _id: string | undefined;
  private _livroId: string;
  private _membroId: string;
  private _dataEmprestimo: string;
  private _dataDevolucaoPrevista: string;
  private _dataDevolucaoReal: string | undefined;
  private _devolvido: boolean;

  constructor(props: EmprestimoProps) {
    this._id = props.id;
    this._livroId = Emprestimo.validarId(props.livroId, "livro");
    this._membroId = Emprestimo.validarId(props.membroId, "membro");
    this._dataEmprestimo = Emprestimo.validarData(props.dataEmprestimo, "empréstimo");
    this._dataDevolucaoPrevista = Emprestimo.validarData(props.dataDevolucaoPrevista, "devolução prevista");
    this._dataDevolucaoReal = props.dataDevolucaoReal
      ? Emprestimo.validarData(props.dataDevolucaoReal, "devolução real")
      : undefined;
    this._devolvido = props.devolvido ?? false;
  }

  private static validarId(valor: string, label: string): string {
    const trimmed = valor?.trim();
    if (!trimmed) {
      throw new Error(`Identificador de ${label} é obrigatório.`);
    }
    return trimmed;
  }

  private static validarData(valor: string, label: string): string {
    const trimmed = valor?.trim();
    if (!trimmed || Number.isNaN(Date.parse(trimmed))) {
      throw new Error(`Data de ${label} inválida.`);
    }
    return new Date(trimmed).toISOString();
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(value: string | undefined) {
    const trimmed = value?.trim();
    this._id = trimmed && trimmed.length > 0 ? trimmed : undefined;
  }

  get livroId(): string {
    return this._livroId;
  }

  get membroId(): string {
    return this._membroId;
  }

  get dataEmprestimo(): string {
    return this._dataEmprestimo;
  }

  get dataDevolucaoPrevista(): string {
    return this._dataDevolucaoPrevista;
  }

  get dataDevolucaoReal(): string | undefined {
    return this._dataDevolucaoReal;
  }

  get devolvido(): boolean {
    return this._devolvido;
  }

  get estaAtivo(): boolean {
    return !this._devolvido;
  }

  registrarDevolucao(data: string = new Date().toISOString()): void {
    this._dataDevolucaoReal = Emprestimo.validarData(data, "devolução real");
    this._devolvido = true;
  }

  toJSON(): EmprestimoProps {
    const payload: EmprestimoProps = {
      livroId: this._livroId,
      membroId: this._membroId,
      dataEmprestimo: this._dataEmprestimo,
      dataDevolucaoPrevista: this._dataDevolucaoPrevista,
      devolvido: this._devolvido,
    };
    if (this._id) payload.id = this._id;
    if (this._dataDevolucaoReal) payload.dataDevolucaoReal = this._dataDevolucaoReal;
    return payload;
  }
}
