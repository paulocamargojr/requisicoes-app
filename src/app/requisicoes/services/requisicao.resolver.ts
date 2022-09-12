import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Requisicao } from '../model/requisicoes.model';
import { RequisicaoService } from './requisicao.service';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoResolver implements Resolve<Requisicao> {

  constructor(private service: RequisicaoService){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Requisicao> {
    return this.service.selecionarPorId(route.params['id']);
  }
}
