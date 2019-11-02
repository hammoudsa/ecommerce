import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent implements OnInit {

  public cadastro: boolean = false;
  public cadastroArtista: boolean = false;
  public valor=0;

  constructor() { }

  ngOnInit() {
  }

  public exibirPainel(event:string): void{

    this.valor=0;
    if(event === 'cadastro'){
      this.valor=1;
    }
    if(event === 'cadastro-artista'){
      this.valor=2;
    }
      

  }


}
