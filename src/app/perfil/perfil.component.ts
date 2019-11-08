import { Router } from '@angular/router';
import { Autenticacao } from './../autenticacao.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {


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

  

}
