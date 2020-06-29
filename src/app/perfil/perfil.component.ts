import { InformacoesComponent } from './informacoes/informacoes.component';
import { Router } from '@angular/router';
import { Autenticacao } from './../autenticacao.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

@ViewChild('informacoes') public informacoes: any

  constructor(private autenticacao: Autenticacao,
              private router: Router) { }

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

  public atualizarTimeLine(): void{
    this.informacoes.atualizarTimeLine()
  }


}
