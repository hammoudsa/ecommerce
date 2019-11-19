import { Bd } from './../../bd.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'


@Component({
  selector: 'app-publicacoes-user',
  templateUrl: './publicacoes-user.component.html',
  styleUrls: ['./publicacoes-user.component.css']
})
export class PublicacoesUserComponent implements OnInit {
  public email: string
  public publicacoes: any
  public usuarios: any
  public artistas: any

  constructor(private bd: Bd) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email

    })
  }

  public atualizarTimeLine(): void {

    this.bd.consultaPublicacoesUser(this.email)
      .then((listaPublicacoes: any)=>{
        this.publicacoes = listaPublicacoes
      })    
  }

}
