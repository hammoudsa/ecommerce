import { Autenticacao } from './../autenticacao.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';



@Component({
  selector: 'app-procurar',
  templateUrl: './procurar.component.html',
  styleUrls: ['./procurar.component.css']
})
export class ProcurarComponent implements OnInit {

  @ViewChild('usuarios') public usuarios: any

  constructor(private router: Router,
              private autenticacao: Autenticacao) { }

  ngOnInit() {
  }

  public home(): void{
    this.router.navigate(['/home'])

  }

  public atualizarTimeline(): void{
    this.usuarios.atualizarTimeLine()
   }

  public sair(): void {
    this.autenticacao.sair()
  }

  public procurar(): void {
    this.router.navigate(['/procurar'])
    
  }

  public meuPerfil(): void {
    this.router.navigate(['/perfil'])
    
  }
   

}
