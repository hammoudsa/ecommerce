import { Usuario } from './../usuario.model';
import { Autenticacao } from './../../autenticacao.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'

@Component({
  selector: 'app-cadastro-artista',
  templateUrl: './cadastro-artista.component.html',
  styleUrls: ['./cadastro-artista.component.css']
})
export class CadastroArtistaComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null),
    'nome_completo': new FormControl(null),
    'nome_usuario': new FormControl(null),
    'senha': new FormControl(null),
    'confirmar_senha': new FormControl(null),
    'genero': new FormControl(null)
  })

  constructor(
    private autenticacao: Autenticacao
  ) { }

  ngOnInit() {
  }

  public exibirPainelLogin(): void{
    this.exibirPainel.emit('login')
  }

  public cadastrarUsuario(): void {

    //cadastro usuario Artista
    let usuario: Usuario = new Usuario(
      this.formulario.value.email,
      this.formulario.value.nome_completo,
      this.formulario.value.nome_usuario,
      this.formulario.value.senha,
      btoa(this.formulario.value.email),
      true,
      this.formulario.value.genero
    )

    if(this.formulario.value.senha != this.formulario.value.confirmar_senha){
      window.alert('As senhas devem ser iguais!');
    }else{
      this.autenticacao.cadastrarUsuario(usuario)
      .then(() => this.exibirPainelLogin());
      window.alert('Cadastrado realizado com sucesso!');
    }
  }

}




