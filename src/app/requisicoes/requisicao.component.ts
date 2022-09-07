import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from '../departamentos/models/departamentos.models';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamentos.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Requisicao } from './model/requisicoes.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.css']
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>
  public form: FormGroup;

  constructor(private requisicaoService: RequisicaoService,
      private depatamentoService: DepartamentoService,
      private equipamentoService: EquipamentoService,
      private fb: FormBuilder,
      private modalService: NgbModal,
      private toastr: ToastrService,
      ) {

  }

  get id(): AbstractControl | null{
    return this.form.get("requisicao.id");
  }

  get descricao(): AbstractControl | null{
    return this.form.get('requisicao.descricao');
  }

  get departamentoId(): AbstractControl | null{
    return this.form.get('requisicao.departamentoId')
  }

  get data(): AbstractControl | null{
    return this.form.get('requisicao.data')
  }

  get equipamentoId(): AbstractControl | null{
    return this.form.get('requisicao.equipamentoId')
  }

  get funcionarioId(): AbstractControl | null{
    return this.form.get('requisicao.funcionarioId');
  }

  get tituloModal(): string{
    return this.id?.value ? "Atualização": "Cadastro";
  }

  ngOnInit(): void {
    this.requisicoes$ = this.requisicaoService.selecionarTodos();

   this.form = this.fb.group({
      requisicao: new FormGroup({
        id: new FormControl(''),
        descricao: new FormControl('', [Validators.required, Validators.minLength(3)]),
        data: new FormControl(''),
        departamentoId: new FormControl('', [Validators.required]),
        departamento: new FormControl(''),
        equipamentoId: new FormControl(''),
        equipamento: new FormControl('')
      }),
        
   });

   this.equipamentos$ = this.equipamentoService.selecionarTodos();
   this.departamentos$ = this.depatamentoService.selecionarTodos();
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao){
    this.form.reset();
 
    if(requisicao){
     const departamento = requisicao.departamento?requisicao.departamento: null;
     const equipamento = requisicao.equipamento?requisicao.equipamento: null;
     const requisicaoCompleta = {
       ...requisicao,
       departamento,
       equipamento
     }
     
     this.data?.setValue(new Date());
     this.form.get('requisicao')?.setValue(requisicaoCompleta);
    }
        
 
    try {
      await this.modalService.open(modal).result;
 
      if(requisicao)
        await this.requisicaoService.editar(this.form.get('requisicao')?.value);
      else
        await this.requisicaoService.inserir(this.form.get('requisicao')?.value);

        
 
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
