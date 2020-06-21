import { Router } from '@angular/router';
import { Bd } from './../../bd.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {

  public email: string
  public publicacoes: any
  public usuarios: any
  public artistas: any
  public usuarioAtual: any
  public publicacaoKey: string
  public userAtualId: string
  public listaCarrinho = [];
  public carrinhoTotal = 0.00;
  private qtdItens = this.listaCarrinho.length;

  constructor(private bd: Bd, private router: Router) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
      this.atualizarLista()
      //this.bd.consultaListaSeguidores(this.email)
    })
  }

  public atualizarLista(): void {
    //if usuario or artista
    this.bd.consultaUsuarios()
      .then((listaUsuarios: any) =>{
        console.log('usuario component === ', listaUsuarios)
        this.usuarios = listaUsuarios
        for(let i in this.usuarios){
          if(this.usuarios[i].usuario.email == this.email){
            this.userAtualId = this.usuarios[i].key;
          }
        }
        this.atualizarTimeLine()
      })

      this.bd.consultaArtistas()
      .then((listaArtistas: any) =>{
        console.log('artista component === ', listaArtistas)
     
      })
  }

  public atualizarTimeLine(): void {
    this.publicacoes = ['']
    for(let i=0;i<this.usuarios.length;i++){
      if(this.usuarios[i].usuario.email == this.email){
        this.usuarioAtual = this.usuarios[i].nome_usuario
      }
    }
    
    this.bd.consultaListaCarrinho(this.email)
      .then(success => {
          this.listaCarrinho = success;
          this.qtdItens = this.listaCarrinho.length;
          
          this.bd.consultaPublicacoesCarrinho(this.listaCarrinho)
          .then((listaPublicacoes: any)=>{
            this.publicacoes = listaPublicacoes
            console.log('LISTA PUBLICAÇÕES',this.publicacoes)
          })    
      })
    
    this.bd.consultarTotalCarrinho(this.email)
      .then((success: any) => {
          console.log('TOTAL CARRINHO:: ', success.totalCarrinho)
          this.carrinhoTotal = success.totalCarrinho
      })
    
  }

  public abrir(publicacaoKey: string, publicacaoUser: string){
    this.router.navigate(['p'], {queryParams: {user: publicacaoUser, id: publicacaoKey}})   
  }

  public adicionar(prodCode: string, valor: string){
    this.listaCarrinho.push(prodCode);
    this.qtdItens = this.listaCarrinho.length;
    this.carrinhoTotal += parseFloat(valor.replace(',','.'))
    this.carrinhoTotal = parseFloat(this.carrinhoTotal.toFixed(2))
    this.bd.inserirListaCarrinho(this.email, this.listaCarrinho)
    this.bd.inserirTotalCarrinho(this.email, this.carrinhoTotal)
  }

  public remover(prodCode: string, valor: string){
    this.listaCarrinho.splice(this.listaCarrinho.indexOf(prodCode),1);
    this.qtdItens = this.listaCarrinho.length;
    this.carrinhoTotal -= parseFloat(valor.replace(',','.'))
    this.carrinhoTotal = parseFloat(this.carrinhoTotal.toFixed(2))
    this.bd.inserirListaCarrinho(this.email, this.listaCarrinho)
    this.bd.inserirTotalCarrinho(this.email, this.carrinhoTotal)
  }

  public meuCarrinho(){
    this.router.navigate(['/carrinho'])
  }

}



