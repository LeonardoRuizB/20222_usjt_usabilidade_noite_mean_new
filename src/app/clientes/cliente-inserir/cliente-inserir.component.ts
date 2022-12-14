import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';

@Component({
  selector: 'app-cliente-inserir',
  templateUrl: './cliente-inserir.component.html',
  styleUrls: ['./cliente-inserir.component.css']
})

export class ClienteInserirComponent implements OnInit {

  private modo: string = "criar";
  private idCliente: string;
  public cliente: Cliente;
  public estaCarregando: boolean = false;

  constructor(
    private clienteService: ClienteService,
    public route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idCliente")) {
        //estamos em modo de edição
        this.modo = "editar"
        this.idCliente = paramMap.get("idCliente")
        this.estaCarregando = true;

        this.clienteService.getCliente(this.idCliente)
          .subscribe((dadosCli) => {
            this.estaCarregando = false;
            this.cliente = {
              id: dadosCli._id,
              nome: dadosCli.nome,
              fone: dadosCli.fone,
              email: dadosCli.email
            };
          });
      }
      else {
        //estamos em modo de cadastro
        this.modo = "criar"
        this.idCliente = null
      }
    })
  }

  onAdicionarCliente(form: NgForm) {
    if (form.invalid) return
    this.clienteService.adicionarCliente(
      form.value.nome,
      form.value.fone,
      form.value.email
    )
    form.resetForm();
  }

  onSalvarCliente(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.estaCarregando = true;
    if (this.modo === "criar") {
      this.clienteService.adicionarCliente(
        form.value.nome,
        form.value.fone,
        form.value.email
      );
    }
    else {
      this.clienteService.atualizarCliente(
        this.idCliente,
        form.value.nome,
        form.value.fone,
        form.value.email
      )
    }
    form.resetForm();
    this.estaCarregando = false;
  }
}

