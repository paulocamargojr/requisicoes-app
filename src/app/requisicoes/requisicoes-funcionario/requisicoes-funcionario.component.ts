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
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../model/requisicoes.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html',
  styleUrls: ['./requisicoes-funcionario.component.css']
})
export class RequisicoesFuncionarioComponent implements OnInit, OnDestroy {
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
        funcionario: new FormControl(''),

        status: new FormControl(''),
        ultimaAtualizacao: new FormControl(''),
        movimentacoes: new FormControl('')
   });

   this.equipamentos$ = this.equipamentoService.selecionarTodos();
   this.departamentos$ = this.depatamentoService.selecionarTodos();
  }

  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao){
    this.form.reset();
     
     this.form.get('data')?.setValue(new Date());
     this.form.get('equipamentoId')?.setValue(null);
     this.form.get('funcionarioId')?.setValue(this.funcionarioIdLogado);

     this.form.get('ultimaAtualizacao')?.setValue(new Date());
     this.form.get('status')?.setValue('Aberta');

     if(requisicao){
      const departamento = requisicao.departamento?requisicao.departamento: null;
      const equipamento = requisicao.equipamento?requisicao.equipamento: null;
      const funcionario = requisicao.funcionario?requisicao.funcionario: null;
      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento,
        funcionario
      }

     this.form.setValue(requisicaoCompleta);
    }
        
 
    try {
      await this.modalService.open(modal).result;
 
      if(requisicao)
        await this.requisicaoService.editar(this.form.value);
      else
        await this.requisicaoService.inserir(this.form.value);

        
 
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

  public remover(requisicao: Requisicao){
    this.requisicaoService.remover(requisicao);
    this.toastr.success('Requisição foi excluida', 'Requisições', {
      timeOut: 1000,
      progressBar: true,
      progressAnimation: 'decreasing'
    });
  }

}
