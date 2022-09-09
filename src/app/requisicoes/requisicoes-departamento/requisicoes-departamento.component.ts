import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamentos.models';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamentos.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../model/requisicoes.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html',
  styleUrls: ['./requisicoes-departamento.component.css']
})
export class RequisicoesDepartamentoComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public funcionarioIdLogado: string;
  public form: FormGroup;
  public processoAutenticado$: Subscription;

  constructor(private requisicaoService: RequisicaoService,
      private depatamentoService: DepartamentoService,
      private equipamentoService: EquipamentoService,
      private fb: FormBuilder,
      private modalService: NgbModal,
      private toastr: ToastrService,
      private authService: AuthenticationService,
      private funcionarioService: FuncionarioService
      ) {

  }

  get id(): AbstractControl | null{
    return this.form.get("id");
  }

  get descricao(): AbstractControl | null{
    return this.form.get('descricao');
  }

  get departamentoId(): AbstractControl | null{
    return this.form.get('departamentoId')
  }

  get data(): AbstractControl | null{
    return this.form.get('data')
  }

  get equipamentoId(): AbstractControl | null{
    return this.form.get('equipamentoId')
  }

  get funcionarioId(): AbstractControl | null{
    return this.form.get('funcionarioId');
  }

  get tituloModal(): string{
    return this.id?.value ? "Atualização": "Cadastro";
  }

  ngOnInit(): void {
    this.authService.usuarioLogado.subscribe(usuario => {
      const email = usuario?.email!;

      this.processoAutenticado$ = this.funcionarioService.selecionarFuncionarioLogado(email)
      .subscribe(funcionario => {
        this.funcionarioIdLogado = funcionario.id
        this.requisicoes$ = this.requisicaoService.selecionarRequisicoesFuncionario(this.funcionarioIdLogado);
      });
    })

   this.form = this.fb.group({
        id: new FormControl(''),
        descricao: new FormControl('', [Validators.required, Validators.minLength(3)]),
        data: new FormControl(''),
        departamentoId: new FormControl('', [Validators.required]),
        departamento: new FormControl(''),
        equipamentoId: new FormControl(''),
        equipamento: new FormControl(''),
        funcionarioId: new FormControl('') ,
        funcionario: new FormControl('')
   });

   this.equipamentos$ = this.equipamentoService.selecionarTodos();
   this.departamentos$ = this.depatamentoService.selecionarTodos();
  }

  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

}
