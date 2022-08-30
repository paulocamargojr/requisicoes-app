import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public usuarioLogado: Observable<firebase.User | null>

  constructor(private auth: AngularFireAuth) { 
    this.usuarioLogado = auth.authState;
  }

  public login(email: string, password: string) : Promise<firebase.auth.UserCredential>{  
      return this.auth.signInWithEmailAndPassword(email, password);
  }

  public resetarSenha(email: string): Promise<void>{
    return this.auth.sendPasswordResetEmail(email);
  }

  public logout(): Promise<void>{
    return this.auth.signOut();
  }
}