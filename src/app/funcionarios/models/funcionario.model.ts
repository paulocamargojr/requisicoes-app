import { Departamento } from "src/app/departamentos/models/departamentos.models";

export class Funcionario{
    id: string;
    nome: string;
    email: string;
    funcao: string;
    departamentoId: string;
    departamento? : Departamento;
}