import { Component, OnInit } from '@angular/core';
import { Bd } from './../../bd.service';
import * as firebase from 'firebase'; 
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-p',
  templateUrl: './p.component.html',
  styleUrls: ['./p.component.css']
})
export class PComponent implements OnInit {
  public userPublicacao: string
  public publicacaoKey: string
  public publicacao: any
  public userAtualId: string
  public email: string

  constructor(private bd: Bd) { }

  ngOnInit() {
    let urlAtual = window.location.href
    let urlSeparada = urlAtual.split('user=')
    let listaParams = urlSeparada[1].split('&id=')
    this.userPublicacao = listaParams[0]
    this.publicacaoKey = listaParams[1]

    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
      this.userAtualId = btoa(this.email)
    })

/*     console.log('pub:: ', this.userPublicacao)
    this.bd.consultarUsuarioKey(this.userPublicacao)
    .then(success => {
      let user = Object.keys(success)
      console.log('detalhes user: ', user[0])
      this.bd.consultarPublicacaoByKey(user[0], this.publicacaoKey)
      .then(success => {
        console.log('publicacao:: ', success)
        this.publicacao = success
      }) 
    })    */

    this.bd.consultarUsuarioKey2(this.publicacaoKey)
    .then(success => {
      let user = Object.keys(success)
      let keyUser
      let lista = JSON.parse(JSON.stringify(success))
      console.log('detalhes user: ', success)
      for(let i in lista){
        console.log('i::: ', i)
        for(let j in lista[i]){
          console.log('j::: ', j)
          if(j == this.publicacaoKey){
            keyUser = i;
            console.log('keyUSER: ', keyUser)
          }
        }
      }
      //this.bd.consultarPublicacaoByKey(user[0], this.publicacaoKey
    }) 
/*       .then(success => {
        console.log('publicacao:: ', success)
        this.publicacao = success
      }) 
    })   */

  }

}
