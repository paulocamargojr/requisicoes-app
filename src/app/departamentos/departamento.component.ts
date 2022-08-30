import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { stringLength } from '@firebase/util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from './models/departamentos.models';
import { DepartamentoService } from './services/departamento.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})

export class DepartamentoComponent implements OnInit {
  public departamentos$: Observable<Departamento[]>
  public form: FormGroup;

  constructor(private departamentoService: DepartamentoService, private fb: FormBuilder, private modalService: NgbModal, private toastr : ToastrService) { }

  get nome(){
    return this.form.get('nome');
  }

  get telefone(){
    return this.form.get('telefone');
  }

  get id(){
    return this.form.get("id")
  }

  get tituloModal(): string{
    return this.id?.value ? "Atualização": "Cadastro";
  }

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(''),
      nome: new FormControl(''),
      telefone: new FormControl('')
    });
  }

  public async gravar(modal: TemplateRef<any>, departamento?: Departamento){
    this.form.reset();

    if(departamento)
        this.form.setValue(departamento);

    try {
      await this.modalService.open(modal).result;

      if(departamento)
        await this.departamentoService.editar(this.form.value);
      else
        await this.departamentoService.inserir(this.form.value);

      console.log(`O departamento foi salvo com sucesso`);
      this.toastr.success('Departamento foi salvo', 'Departamentos', {
        timeOut: 1000,
        progressBar: true,
        progressAnimation: 'decreasing'
      });
    } catch (error) {
      console.log(error)
    }
  }

  public remover(departamento: Departamento){
    this.departamentoService.remover(departamento);

    this.toastr.success('Departamento foi removido', 'Departamentos', {
      timeOut: 1000,
      progressBar: true,
      progressAnimation: 'decreasing'
    });
  }
}
