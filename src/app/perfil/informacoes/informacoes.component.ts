import { Usuario } from './../../acesso/usuario.model';
import { Bd } from './../../bd.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase' 


@Component({
  selector: 'app-informacoes',
  templateUrl: './informacoes.component.html',
  styleUrls: ['./informacoes.component.css']
})
export class InformacoesComponent implements OnInit {

  public email: string
  public usuarios: any
  public artista: any
  public listaSeguindo: Array<String> = [];
  public usuario = {
    nome: '',
    seguido: 0
  }

  public thisUserName: String
  public thisUser: String

  constructor(private bd: Bd) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
      this.atualizarTimeLine()
    })
  }

  public atualizarTimeLine(): void {
    //if usuario or artista
    this.bd.consultaUsuarios()
      .then((listaUsuarios: any) =>{
        console.log('usuario component === ', listaUsuarios)
        this.usuarios = listaUsuarios
      
        for(let i=0; i<this.usuarios.length; i++){
          if(this.usuarios[i].usuario.email == this.email){
            this.thisUserName = this.usuarios[i].usuario.nome_completo
            this.thisUser = this.usuarios[i].usuario.nome_usuario
          }
        }
      })
     

      this.bd.consultaArtistas()
      .then((listaArtistas: any) =>{
        console.log('artista component === ', listaArtistas)
        this.artista = listaArtistas
      })
  }



  

}
