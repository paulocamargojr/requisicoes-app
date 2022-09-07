import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamentos.models';
import { Requisicao } from '../model/requisicoes.model';
import * as moment from 'moment';
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
      map((requisicoes: Requisicao[])=>{
        requisicoes.forEach(requisicao => {
          this.firestore.collection<Departamento>('departamentos')
          .doc(requisicao.departamentoId)
          .valueChanges()
          .subscribe(x => requisicao.departamento = x);
        });
        return requisicoes;
      }),
      map((requiscoes: Requisicao[])=>{
        requiscoes.forEach(requisicao =>{
          this.firestore.collection<Equipamento>('equipamentos')
        .doc(requisicao.equipamentoId)
        .valueChanges()
        .subscribe(x => requisicao.equipamento = x);
        });
        return requiscoes;
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
}
