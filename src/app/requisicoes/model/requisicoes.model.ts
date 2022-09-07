import { Departamento } from "src/app/departamentos/models/departamentos.models";
import { Equipamento } from "src/app/equipamentos/models/equipamentos.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";

export class Requisicao{
    id: string;
    solicitante: Funcionario;
    solicitanteId?: string;
    descricao: string;
    departamento?: Departamento;
    departamentoId: string;
    data: any;
    equipamento?: Equipamento;
    equipamentoId?: string
}