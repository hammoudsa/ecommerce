import { Bd } from './../bd.service';
import { Autenticacao } from './../autenticacao.service';
import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router'
import * as firebase from 'firebase' 


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public email: string
  public usuarios: string
  public isArtist: boolean

  @ViewChild('publicacoes') public publicacoes: any

  constructor(
     private autenticacao: Autenticacao,
     private router: Router,
     private bd: Bd) {
   }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
      this.atualizarTimeline()
    })
  }

  public sair(): void {
    this.autenticacao.sair()
  }

  public procurar(): void {
    this.router.navigate(['/procurar'])
    
  }

  public home(): void {
    this.router.navigate(['/home'])
    
  }

  public meuPerfil(): void {
    this.router.navigate(['/perfil'])
    
  }

  public atualizarTimeline(): void{

   this.bd.consultaUsuarios()
   .then((listaUsuarios: any) =>{
     console.log('usuario component === ', listaUsuarios)
     this.usuarios = listaUsuarios
     console.log(this.email)
     for(let i=0; i<listaUsuarios.length; i++){
       if(listaUsuarios[i].usuario.email == this.email){
         this.isArtist = listaUsuarios[i].usuario.isArtist
         
       }
      
     }
     console.log(' ', this.isArtist)
   })

   this.publicacoes.atualizarTimeLine()
  }
  
}
