import { Component, OnInit } from '@angular/core';
import { Bd } from './../../bd.service';

@Component({
  selector: 'app-p',
  templateUrl: './p.component.html',
  styleUrls: ['./p.component.css']
})
export class PComponent implements OnInit {
  public userPublicacao: string
  public publicacaoKey: string

  constructor(private bd: Bd) { }

  ngOnInit() {
    let urlAtual = window.location.href
    let urlSeparada = urlAtual.split('user=')
    let listaParams = urlSeparada[1].split('&id=')
    this.userPublicacao = listaParams[0]
    this.publicacaoKey = listaParams[1]

    console.log('pub:: ', this.userPublicacao)
    this.bd.consultarEmailUsuario(this.userPublicacao)

    

  }

}
