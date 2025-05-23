import { Router } from '@angular/router';
import { Autenticacao } from './../../autenticacao.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { Usuario } from './../usuario.model';
import * as firebase from 'firebase'

 

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

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
    private autenticacao: Autenticacao,
    private router: Router
  ){}

  ngOnInit() {
  }

  public exibirPainelLogin(): void{
    this.exibirPainel.emit('login')
  }



  public cadastrarUsuario(): void {

    //cadastro usuario comum
    let usuario: Usuario = new Usuario(
      this.formulario.value.email,
      this.formulario.value.nome_completo,
      this.formulario.value.nome_usuario,
      this.formulario.value.senha,
      btoa(this.formulario.value.email),
      false,
      ''
    )


    if(this.formulario.value.senha != this.formulario.value.confirmar_senha){
      window.alert('As senhas devem ser iguais!');
    }else{
      this.autenticacao.cadastrarUsuario(usuario)
      .then(() => this.exibirPainelLogin());
      window.alert('Cadastrado realizado com sucesso! \nVerifique sua caixa de entrada para confirmar seu email');


    }
  }

  public termosDeUso(): void {
    this.router.navigate(['/termos'])  
  }

}
