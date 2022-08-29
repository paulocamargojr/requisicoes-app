import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscribable, Subscription } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})

export class PainelComponent implements OnInit, OnDestroy {
  emailUsuario?: string | null; 
  usuarioLogado$: Subscription;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnDestroy(): void {
    this.usuarioLogado$.unsubscribe();
  }

  ngOnInit(): void {
    this.usuarioLogado$ = this.authService.usuarioLogado
    .subscribe(usuario => this.emailUsuario = usuario?.email)
  }

  sair(){
    this.authService.logout().then(()=>console.log(this.router.navigate(['/login'])));
  } 
}
