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
    this.publicacoes = ['']
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

  public comentar(publicacaoKey: string, publicacaoUser: string){
    console.log('publicacao key:: ', publicacaoKey)
    let comentario = (<HTMLInputElement>document.getElementById(publicacaoKey)).value;

    if(comentario != ''){
      let publicacaoEmail
      for(let i in this.usuarios){
        if(this.usuarios[i].nome_usuario == publicacaoUser){
          publicacaoEmail = this.usuarios[i].usuario.email
        }
      }
      this.bd.comentar(publicacaoEmail, publicacaoKey, this.usuarioAtual, comentario)
      this.atualizarTimeLine()
    }
  }


}
