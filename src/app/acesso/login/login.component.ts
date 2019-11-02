import { Autenticacao } from './../../autenticacao.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 @Output() public exibirPainel: EventEmitter<string> = new EventEmitter()

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null),
    'senha': new FormControl(null)
  })


  constructor(
    private autenticacao: Autenticacao
  ) { }

  ngOnInit() {
  }

  public exibirPainelCadastro(): void{
    this.exibirPainel.emit('cadastro')
  }

  public exibirPainelCadastroArtista(): void{
    this.exibirPainel.emit('cadastro-artista')
    console.log("cadastro-artista")
  }

  public autenticar(): void {
    if(this.formulario.value.email == null || this.formulario.value.senha == null){
      let msg = "Preencha os campos de login"
      document.getElementById("txtmsg").textContent = msg
    }else{
       this.autenticacao.autenticar(
         this.formulario.value.email,
         this.formulario.value.senha 
      )
      document.getElementById("txtmsg").textContent = ""
    }   

  }

  public tratarErro(): void {
      //document.getElementById("txtmsg").textContent = "Email ou Senha inválidos" + error
      console.log('no painel login')

  }
 
  
}
