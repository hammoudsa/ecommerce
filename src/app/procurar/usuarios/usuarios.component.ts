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
  public listaSeguindo: Array<String> = []
  public listaRetornoBD: Array<String> = []
  

  constructor(private bd: Bd) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
      this.atualizarTimeLine()
      this.carregarListaSeguidores()
         
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

  public carregarListaSeguidores(): void{
    this.bd.consultaListaSeguidores(this.email)
    .then((listaSeg: Array<any>) => {
      this.listaSeguindo = listaSeg
      console.log('carregarListaSeguidores(): ', this.listaSeguindo)
    }) 
  }


  public seguir(nomeUsuario: string, key: string ): void{

    let element = <HTMLInputElement> document.getElementById(nomeUsuario);  
    console.log(element.id)

    if(this.listaSeguindo.includes(key)){
      this.listaSeguindo.splice(this.listaSeguindo.indexOf(key), 1)
      console.log(this.listaSeguindo)
      //this.bd.inserirSeguidores(this.email, this.listaSeguindo)
      
    }else{
      this.listaSeguindo.push(key)
      console.log(this.listaSeguindo)
      //this.bd.inserirSeguidores(this.email, this.listaSeguindo)
          
    }

  }

}