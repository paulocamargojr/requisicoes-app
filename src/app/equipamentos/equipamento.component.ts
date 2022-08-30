import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamentos.model';
import { EquipamentoService } from './services/equipamento.service';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.css']
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>
  public form: FormGroup;

  constructor(private equipamentoService: EquipamentoService, private fb: FormBuilder, private modalService: NgbModal, private toastr: ToastrService) {

   }

   get nome(){
    return this.form.get('nome');
  }

  get numeroSerie(){
    return this.form.get('numeroSerie');
  }

  get preco(){
    return this.form.get('preco');
  }

  get data(){
    return this.form.get('data');
  }

  get id(){
    return this.form.get("id")
  }

  get tituloModal(): string{
    return this.id?.value ? "Atualização": "Cadastro";
  }

  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(''),
      numeroSerie: new FormControl(''),
      nome: new FormControl(''),
      preco: new FormControl(''),
      data: new FormControl('')
    });
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento){
    this.form.reset();

    if(equipamento)
        this.form.setValue(equipamento);

    try {
      await this.modalService.open(modal).result;

      if(equipamento)
        await this.equipamentoService.editar(this.form.value);
      else
        await this.equipamentoService.inserir(this.form.value);

      console.log(`O equipamento foi salvo com sucesso`);
      this.toastr.success('Equipamento foi salvo', 'Equipamentos', {
        timeOut: 1000,
        progressBar: true,
        progressAnimation: 'decreasing'
      });
    } catch (error) {
      console.log(error)
    }
  }

  public remover(equipamento: Equipamento){
    this.equipamentoService.remover(equipamento);
    this.toastr.success('Equipamento foi excluido', 'Equipamentos', {
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
