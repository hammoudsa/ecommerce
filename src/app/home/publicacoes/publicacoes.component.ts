import { Bd } from './../../bd.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'

@Component({
  selector: 'app-publicacoes',
  templateUrl: './publicacoes.component.html',
  styleUrls: ['./publicacoes.component.css']
})
export class PublicacoesComponent implements OnInit {

  public email: string
  public publicacoes: any
  public usuarios: any
  public artistas: any

  constructor(private bd: Bd) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
      this.atualizarLista()
      this.bd.consultaListaSeguidores(this.email)
      this.atualizarTimeLine()
    })
  }

  public atualizarLista(): void {
    //if usuario or artista
    this.bd.consultaUsuarios()
      .then((listaUsuarios: any) =>{
        console.log('usuario component === ', listaUsuarios)
        this.usuarios = listaUsuarios
    
      })

      this.bd.consultaArtistas()
      .then((listaArtistas: any) =>{
        console.log('artista component === ', listaArtistas)
     
      })
  }

  public atualizarTimeLine(): void {
    this.bd.consultaPublicacoes()
      .then((listaPublicacoes: any)=>{
        this.publicacoes = listaPublicacoes
        console.log('LISTA PUBLICAÇÕES',this.publicacoes)
      })    
/*    this.bd.consultaPublicacoesUser(this.email)
        .then((listaPublicacoes: any)=>{
          this.publicacoes = listaPublicacoes
          console.log('LISTA PUBLICAÇÕES',this.publicacoes)
        })   */
  }
}
