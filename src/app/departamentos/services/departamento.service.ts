import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Departamento } from '../models/departamentos.models';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  registros: AngularFirestoreCollection<Departamento>

  constructor(private firestore: AngularFirestore) { 
    this.registros = this.firestore.collection<Departamento>('departamentos');
  }

  public selecionarTodos(): Observable<Departamento[]>{
    return this.registros.valueChanges();
  }

  public async inserir(registro: Departamento): Promise<any>{
    if(!registro)
      return Promise.reject('item inválido!');
    
    const res = await this.registros.add(registro);
    registro.id = res.id;
    this.registros.doc(res.id).set(registro);
  }

  public async editar(registro: Departamento): Promise<void>{
    return this.registros.doc(registro.id).set(registro);
  }

  public remover(registro: Departamento): Promise<void>{
    return this.registros.doc(registro.id).delete();
  }
}
