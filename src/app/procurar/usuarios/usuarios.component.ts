import { Usuario } from './../../acesso/usuario.model';
import { Bd } from './../../bd.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase' 

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public email: string
  public usuarios: any
  public artistas: any
  public listaSeguindo: Array<String> = [];
  public usuario = {
    nome: '',
    seguido: 0
  }


  constructor(private bd: Bd) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
      this.atualizarTimeLine()
    })
  }

  public atualizarTimeLine(): void {
    this.bd.consultaUsuarios()
      .then((listaUsuarios: any) =>{
        console.log('usuario component === ', listaUsuarios)
        this.usuarios = listaUsuarios
      })

      this.bd.consultaArtistas()
      .then((listaArtistas: any) =>{
        console.log('usuario component === ', listaArtistas)
        this.artistas = listaArtistas
      })
  }

  public seguir(nomeUsuario: string, key: string ): void{
    
    let element = <HTMLInputElement> document.getElementById("artista.nome_usuario");  
    console.log(nomeUsuario, " ", key)

  
    this.usuario.nome = nomeUsuario;


/*     if(this.usuario.nome == nomeUsuario && this.usuario.seguido == 1){
      this.listaSeguindo.splice(this.listaSeguindo.indexOf(key)) 

    }
    if(this.usuario.nome == nomeUsuario && this.usuario.seguido == 0){
      alert('seguindo')
      this.listaSeguindo.push(key)
      console.log(this.listaSeguindo)
      this.usuario.seguido = 1;

    } */

    if (element.checked) { 
      this.listaSeguindo.push(key)
      console.log(this.listaSeguindo)

    }
    else{
      /* this.listaSeguindo.splice(this.listaSeguindo.indexOf(key)) */
      console.log(this.listaSeguindo.indexOf(key))
    }
  }

}