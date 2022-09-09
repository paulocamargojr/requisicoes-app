import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map, take } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamentos.models';
import { Requisicao } from '../model/requisicoes.model';
import * as moment from 'moment';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamentos.model';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {
  registros: AngularFirestoreCollection<Requisicao>

  constructor(private firestore: AngularFirestore) { 
    this.registros = this.firestore.collection<Requisicao>('requisicoes');
  }

  public selecionarTodos(): Observable<Requisicao[]>{
    return this.registros.valueChanges()
    .pipe(
      map(requisicoes => {
        requisicoes.forEach(req =>{
          this.firestore.collection<Departamento>('departamentos')
          .doc(req.departamentoId)
          .valueChanges()
          .subscribe(d => req.departamento = d)

          this.firestore.collection<Funcionario>('funcionarios')
          .doc(req.funcionarioId)
          .valueChanges()
          .subscribe(f => req.funcionario = f)

          if(req.equipamentoId){
            this.firestore.collection<Equipamento>('equipamentos')
            .doc(req.equipamentoId)
            .valueChanges()
            .subscribe(e => req.equipamento = e)
          }
        })
        return requisicoes;
      })
    );
  }

  public async inserir(registro: Requisicao): Promise<any>{
    if(!registro)
      return Promise.reject('item inválido!');
    
    const res = await this.registros.add(registro);
    registro.id = res.id;
    moment.locale('pt-br');
    registro.data = moment().calendar();
    this.registros.doc(res.id).set(registro);
  }

  public async editar(registro: Requisicao): Promise<void>{
    return this.registros.doc(registro.id).set(registro);
  }

  public remover(registro: Requisicao): Promise<void>{
    return this.registros.doc(registro.id).delete();
  }

  public selecionarRequisicoesFuncionario(id: string){
    return this.selecionarTodos()
    .pipe(
      map(requisicoes => {
        return requisicoes.filter(req => req.funcionarioId === id)
      })
    )
  }
}
