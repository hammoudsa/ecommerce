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
  public usuarioAtual: any
  public publicacaoKey: string

  constructor(private bd: Bd) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
      this.atualizarLista()
      this.bd.consultaListaSeguidores(this.email)
    })
  }

  public atualizarLista(): void {
    let testeUser: string
    //if usuario or artista
    this.bd.consultaUsuarios()
      .then((listaUsuarios: any) =>{
        console.log('usuario component === ', listaUsuarios)
        this.usuarios = listaUsuarios
        this.atualizarTimeLine()
      })

      this.bd.consultaArtistas()
      .then((listaArtistas: any) =>{
        console.log('artista component === ', listaArtistas)
     
      })
  }

  public atualizarTimeLine(): void {

    for(let i=0;i<this.usuarios.length;i++){
      if(this.usuarios[i].usuario.email == this.email){
        this.usuarioAtual = this.usuarios[i].nome_usuario
      }
    }
    
    this.bd.consultaPublicacoes()
      .then((listaPublicacoes: any)=>{
        this.publicacoes = listaPublicacoes
        console.log('LISTA PUBLICAÇÕES',this.publicacoes)
      })    
  }
  public apagarPublicacao(publicacaoKey: string): void{
    this.publicacaoKey = publicacaoKey
    let confirma = confirm('Este processo irá apagar essa publicação ')
    if(confirma==true){
      this.bd.apagarPublicacao(this.publicacaoKey)
      this.atualizarTimeLine()
    }


  }


}
