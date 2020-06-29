import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import * as firebase from 'firebase'

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null)
  })

  constructor() { }

  ngOnInit() {
  }

  public redefinirSenha(): void{
    firebase.auth().sendPasswordResetEmail(this.formulario.value.email)
    alert('Um email para redefinição de senha foi enviado para ' + this.formulario.value.email + ', caso não apareça por favor verifique na lixeira')
    
  }

  
  public exibirPainelLogin(): void{
    this.exibirPainel.emit('login')
  }


}
