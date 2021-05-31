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
  public listaCarrinhoKeys = [];
  public mapKeyQtd = new Map();
  public carrinhoTotal = 0.00;
  public qtdItens = 0;

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

  }

  public atualizarTimeLine(): void {
    this.publicacoes = ['']
    for(let i=0;i<this.usuarios.length;i++){
      if(this.usuarios[i].usuario.email == this.email){
        this.usuarioAtual = this.usuarios[i].nome_usuario
      }
    }
    
    this.bd.consultaListaCarrinho(this.email)
      .then((success: any) => {
          this.listaCarrinho = success;
          this.qtdItens = 0;
          for(let i in this.listaCarrinho){
            this.listaCarrinhoKeys.push(this.listaCarrinho[i].key)
            this.mapKeyQtd.set(this.listaCarrinho[i].key, this.listaCarrinho[i].qtd)
            this.qtdItens += this.listaCarrinho[i].qtd
          }
          this.bd.consultaPublicacoesCarrinho(this.listaCarrinhoKeys)
          .then((listaPublicacoes: any)=>{
            this.publicacoes = listaPublicacoes
            for(let item of this.publicacoes){
              this.carrinhoTotal += ( parseFloat(item.data.replace(',','.')) * this.mapKeyQtd.get(item.key) )
            }

            this.carrinhoTotal = parseFloat(this.carrinhoTotal.toFixed(2))
            this.bd.inserirTotalCarrinho(this.email, this.carrinhoTotal)
          })    
      })
    
/*     this.bd.consultarTotalCarrinho(this.email)
      .then((success: any) => {
          console.log('TOTAL CARRINHO:: ', success.totalCarrinho)
          this.carrinhoTotal = success.totalCarrinho
      }) */
    
  }

  public abrir(publicacaoKey: string, publicacaoUser: string){
    this.router.navigate(['p'], {queryParams: {user: publicacaoUser, id: publicacaoKey}})   
  }

  public adicionar(prodCode: string, qtd: any, valor: string){
    this.listaCarrinho.push({key: prodCode, qtd: qtd});
    this.listaCarrinhoKeys.push(prodCode)
    this.mapKeyQtd.set(prodCode, qtd)
    this.qtdItens++;
    this.carrinhoTotal += parseFloat(valor.replace(',','.'))
    this.carrinhoTotal = parseFloat(this.carrinhoTotal.toFixed(2))
    this.bd.inserirListaCarrinho(this.email, this.listaCarrinho)
    this.bd.inserirTotalCarrinho(this.email, this.carrinhoTotal)
  }

  public adicionarMesmoItem(prodCode: string, qtd: any, valor: string){
    this.listaCarrinho[this.listaCarrinhoKeys.indexOf(prodCode)].qtd++;
    this.qtdItens++;
    this.carrinhoTotal += parseFloat(valor.replace(',','.'))
    this.carrinhoTotal = parseFloat(this.carrinhoTotal.toFixed(2))
    this.mapKeyQtd.set(prodCode, qtd+1);
    this.bd.inserirListaCarrinho(this.email, this.listaCarrinho)
    this.bd.inserirTotalCarrinho(this.email, this.carrinhoTotal)
  }

  public subtrairMesmoItem(prodCode: string, qtd: any, valor: string){
    if(this.listaCarrinho[this.listaCarrinhoKeys.indexOf(prodCode)].qtd > 1){
      this.listaCarrinho[this.listaCarrinhoKeys.indexOf(prodCode)].qtd--;
      this.qtdItens--;
      this.carrinhoTotal -= parseFloat(valor.replace(',','.'))
      this.carrinhoTotal = parseFloat(this.carrinhoTotal.toFixed(2))
      this.mapKeyQtd.set(prodCode, qtd-1);
      this.bd.inserirListaCarrinho(this.email, this.listaCarrinho)
      this.bd.inserirTotalCarrinho(this.email, this.carrinhoTotal)
    }else{
      this.remover(prodCode, valor)
    }

  }

  public remover(prodCode: string, valor: string){
    this.listaCarrinho.splice(this.listaCarrinhoKeys.indexOf(prodCode),1);
    this.listaCarrinhoKeys.splice(this.listaCarrinhoKeys.indexOf(prodCode),1);
    this.qtdItens--;
    this.carrinhoTotal -= parseFloat(valor.replace(',','.'))
    this.carrinhoTotal = parseFloat(this.carrinhoTotal.toFixed(2))
    this.bd.inserirListaCarrinho(this.email, this.listaCarrinho)
    this.bd.inserirTotalCarrinho(this.email, this.carrinhoTotal)
    this.atualizarTimeLine()
  }

  public meuCarrinho(){
    this.router.navigate(['/carrinho'])
  }

  public home(){
    this.router.navigate(['/home'])
  }

  public comprar(){
    //TODO: Consultar a key do pedido para poder dar update
    let key = '-Mb-1PiFUBuHnrY1N_hm';

/*     let pedido = {
      numeroPedido: key,
      userId: this.userAtualId,
      listaItens: this.listaCarrinho,
      valorTotal: this.carrinhoTotal
    };

    console.log(pedido);

   this.bd.cadastrarPedido(pedido); */
  }

}



