import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export function dataFuturaValidar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const dataInserida = moment(control.value);
        const hoje = moment();

        const dataInseridaEhMaiorDoQueHoje: boolean = dataInserida.isAfter(hoje);

        return dataInseridaEhMaiorDoQueHoje? { datafutura : true }: null;
    }
}