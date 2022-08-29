import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Equipamento } from '../models/equipamentos.model';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {
  registros: AngularFirestoreCollection<Equipamento>

  constructor(private firestore: AngularFirestore) { 
    this.registros = this.firestore.collection<Equipamento>('equipamentos');
  }

  public selecionarTodos(): Observable<Equipamento[]>{
    return this.registros.valueChanges();
  }

  public async inserir(registro: Equipamento): Promise<any>{
    if(!registro)
      return Promise.reject('item inválido!');
    
    const res = await this.registros.add(registro);
    registro.id = res.id;
    this.registros.doc(res.id).set(registro);
  }

  public async editar(registro: Equipamento): Promise<void>{
    return this.registros.doc(registro.id).set(registro);
  }

  public remover(registro: Equipamento): Promise<void>{
    return this.registros.doc(registro.id).delete();
  }
}