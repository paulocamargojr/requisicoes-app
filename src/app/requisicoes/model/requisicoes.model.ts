import { Departamento } from "src/app/departamentos/models/departamentos.models";
import { Equipamento } from "src/app/equipamentos/models/equipamentos.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";
import { Movimentacao } from "./movimentacao.model";

export class Requisicao{
    id: string;
    descricao: string;
    data: Date | any;
    status: string;
    ultimaAtualizacao: Date | any;
    movimentacoes: Movimentacao[];

    equipamento?: Equipamento;
    equipamentoId?: string

    departamento?: Departamento;
    departamentoId: string;

    funcionario?: Funcionario;
    funcionarioId: string;
}