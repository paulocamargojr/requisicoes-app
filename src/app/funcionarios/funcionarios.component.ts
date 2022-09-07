import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamentos.models';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Funcionario } from './models/funcionario.model';
import { FuncionarioService } from './services/funcionario.service';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {
  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(private funcionarioService: FuncionarioService,
     private depatamentoService: DepartamentoService,
      private fb: FormBuilder, private modalService: NgbModal,
       private toastr: ToastrService,
       private authService: AuthenticationService,
       private router: Router
       ) {

  }

  get nome() : AbstractControl | null{
   return this.form.get('funcionario.nome');
 }

 get email(): AbstractControl | null{
   return this.form.get('funcionario.email');
 }

 get senha(): AbstractControl | null{
  return this.form.get('senha');
 }

 get funcao(): AbstractControl | null{
   return this.form.get('funcionario.funcao');
 }

 get departamentoId(): AbstractControl | null{
   return this.form.get('funcionario.departamentoId');
 }

 get id(): AbstractControl | null{
   return this.form.get("funcionario.id");
 }

 get departamento(): AbstractControl | null{
  return this.form.get('funcionario.departamento');
 }

 get tituloModal(): string{
   return this.id?.value ? "Atualização": "Cadastro";
 }

 ngOnInit(): void {
   this.funcionarios$ = this.funcionarioService.selecionarTodos();

   this.form = this.fb.group({
     funcionario: new FormGroup({
      id: new FormControl(''),
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      funcao: new FormControl('', [Validators.required, Validators.minLength(3)]),
      departamentoId: new FormControl('', [Validators.required]),
      departamento: new FormControl('')
     }),
     senha: new FormControl('')
   });

   this.funcionarios$ = this.funcionarioService.selecionarTodos();
   this.departamentos$ = this.depatamentoService.selecionarTodos();
 }

 public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario){
   this.form.reset();

   if(funcionario){
    const departamento = funcionario.departamento?funcionario.departamento: null;
    const funcionarioCompleto = {
      ...funcionario,
      departamento
    }

    this.form.get('funcionario')?.setValue(funcionarioCompleto);
   }
       

   try {
     await this.modalService.open(modal).result;

     if(funcionario)
       await this.funcionarioService.editar(this.form.get('funcionario')?.value);
     else{
      await this.authService.cadastrar(this.email?.value, this.senha?.value);

      await this.funcionarioService.inserir(this.form.get('funcionario')?.value);

      await this.authService.logout();

      await this.router.navigate(['/login']);
     }
       

     console.log(`O funcionario foi salvo com sucesso`);
     this.toastr.success('Funcionario foi salvo', 'Funcionarios', {
       timeOut: 1000,
       progressBar: true,
       progressAnimation: 'decreasing'
     });
   } catch (error) {
     console.log(error)
   }
 }

 public remover(funcionario: Funcionario){
   this.funcionarioService.remover(funcionario);
   this.toastr.success('Funcionaio foi excluido', 'Funcionarios', {
     timeOut: 1000,
     progressBar: true,
     progressAnimation: 'decreasing'
   });
 }

 public obterData(): string{
   const now = new Date().toLocaleDateString;

   return now.toString();
 }

}
