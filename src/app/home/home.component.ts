import { Autenticacao } from './../autenticacao.service';
import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  @ViewChild('publicacoes') public publicacoes: any

  constructor(
     private autenticacao: Autenticacao,
     private router: Router) {
   }

  ngOnInit() {
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
   this.publicacoes.atualizarTimeLine()
  }
  
}
