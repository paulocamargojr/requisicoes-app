import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamentos.models';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamentos.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Movimentacao } from '../model/movimentacao.model';
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
  public funcionarioLogado: Funcionario;
  public form: FormGroup;
  public processoAutenticado$: Subscription;
  public requisicaoSelecionada: Requisicao;
  public listaStatus: string[] = ['Aberta', 'Processando', 'Não autorizada', 'Fechada'];

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

  get status(): AbstractControl | null{
    return this.form.get('status');
  }

  ngOnInit(): void {
    this.authService.usuarioLogado.subscribe(usuario => {
      const email = usuario?.email!;

      this.processoAutenticado$ = this.funcionarioService.selecionarFuncionarioLogado(email)
      .subscribe(funcionario => {
        this.funcionarioLogado = funcionario
        this.requisicoes$ = this.requisicaoService.selecionarRequisicoesDepartamento(funcionario.departamentoId);
      });
    })

   this.form = this.fb.group({
        status: new FormControl('', [Validators.required]),
        descricao: new FormControl('', [Validators.required, Validators.minLength(6)]),
        funcionario: new FormControl(''),
        data: new FormControl('')
   });

   this.equipamentos$ = this.equipamentoService.selecionarTodos();
   this.departamentos$ = this.depatamentoService.selecionarTodos();
  }

  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  public async gravar(modal: TemplateRef<any>, requisicao: Requisicao){
    this.requisicaoSelecionada = requisicao;
    this.requisicaoSelecionada.movimentacoes = requisicao.movimentacoes? requisicao.movimentacoes: [];

    this.form.reset();
     
     this.form.patchValue({
      status: this.requisicaoSelecionada?.status,
      funcionario: this.funcionarioLogado,
      data: new Date()
     });
        
     try {
      await this.modalService.open(modal).result;

      this.adicionarMovimentaco(this.form.value);

      await this.requisicaoService.editar(this.requisicaoSelecionada);
 
      console.log(`A requisição foi salva com sucesso`);
      this.toastr.success('Requisição foi salva', 'Requisições', {
        timeOut: 1000,
        progressBar: true,
        progressAnimation: 'decreasing'
      });
    } catch (error) {
      console.log(error)
    }
  }

  private adicionarMovimentaco(movimentacao: Movimentacao) {
    this.requisicaoSelecionada.movimentacoes.push(movimentacao);
    this.requisicaoSelecionada.status = this.status?.value;
    this.requisicaoSelecionada.ultimaAtualizacao = new Date();
  }
}
