import { Router } from '@angular/router';
import { Bd } from './../../bd.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'
import { format } from 'url';

@Component({
  selector: 'app-publicacoes',
  templateUrl: './publicacoes.component.html',
  styleUrls: ['./publicacoes.component.css']
})
export class PublicacoesComponent implements OnInit {

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
  public paginaAtual = 1;
  public qtdPaginasArray = [];
  public qtdPaginas;


  constructor(private bd: Bd, private router: Router) { }

  ngOnInit() {
    var cUser = firebase.auth().currentUser;
    console.log('CURRENT USER  ', cUser);
    if(cUser != null){
      firebase.auth().onAuthStateChanged((user) => {
        this.email = user.email
        console.log('EMAIL USUARIO LOGADO:: ', this.email)
        this.bd.consultaListaSeguidores(this.email)
      })
    }
    this.atualizarLista()
    
  }

  public atualizarLista(): void {
    //if usuario or artista
    this.bd.consultaUsuarios()
      .then((listaUsuarios: any) =>{
        console.log('usuario component === ', listaUsuarios)
        this.usuarios = listaUsuarios
        if(this.email != null){
          for(let i in this.usuarios){
            if(this.usuarios[i].usuario.email == this.email){
              this.userAtualId = this.usuarios[i].key;
            }
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
    if(this.email != null){
      for(let i=0;i<this.usuarios.length;i++){
        if(this.usuarios[i].usuario.email == this.email){
          this.usuarioAtual = this.usuarios[i].nome_usuario
        }
      }
    }
    
    this.bd.consultaPublicacoes()
      .then((listaPublicacoes: any)=>{
        
        this.qtdPaginas = Math.round(listaPublicacoes.length / 3) + (listaPublicacoes.length%3)
        for(let i=1; i<this.qtdPaginas+1; i++){
          this.qtdPaginasArray.push(i);
        }
        this.publicacoes = listaPublicacoes.splice(0, 3)
      })    
    if(this.email != null){
      this.bd.consultaListaCarrinho(this.email)
      .then((success: any) => {
          this.listaCarrinho = success;
          for(let i in this.listaCarrinho){
            this.listaCarrinhoKeys.push(this.listaCarrinho[i].key)
            this.mapKeyQtd.set(this.listaCarrinho[i].key, this.listaCarrinho[i].qtd)
            this.qtdItens = this.qtdItens + this.listaCarrinho[i].qtd
            console.log('qtdItens', this.listaCarrinho[i].qtd)
          }
          
      })
    
      this.bd.consultarTotalCarrinho(this.email)
      .then((success: any) => {
          console.log('TOTAL CARRINHO:: ', success.totalCarrinho)
          this.carrinhoTotal = success.totalCarrinho
      })
    }
  }
  public apagarPublicacao(publicacaoKey: string): void{
    this.publicacaoKey = publicacaoKey
    let confirma = confirm('Este processo irá apagar essa publicação ')
    if(confirma==true){
      this.bd.apagarPublicacao(this.publicacaoKey)
      this.atualizarTimeLine()
    }
  }

  public comentar(publicacaoKey: string, publicacaoUser: string){
    console.log('publicacao key:: ', publicacaoKey)
    let comentario = (<HTMLInputElement>document.getElementById(publicacaoKey)).value;

    if(comentario != ''){
      let publicacaoEmail
      for(let i in this.usuarios){
        if(this.usuarios[i].nome_usuario == publicacaoUser){
          publicacaoEmail = this.usuarios[i].usuario.email
        }
      }
      this.bd.comentar(publicacaoEmail, publicacaoKey, this.usuarioAtual, comentario)
      this.atualizarTimeLine()
    }
  }

  public curtir(publicacaoKey: string, publicacaoUser: string){
    let publicacaoEmail
  
    for(let i in this.usuarios){
      if(this.usuarios[i].nome_usuario == publicacaoUser){
        publicacaoEmail = this.usuarios[i].usuario.email
      }
    }
    let listaCurtidas;
    for(let i in this.publicacoes){
      if(this.publicacoes[i].key == publicacaoKey){
        if(this.publicacoes[i].curtidas != null)
         listaCurtidas = this.publicacoes[i].curtidas.listaCurtidas
      }
    }
    if(listaCurtidas != null){
      if(listaCurtidas.includes(this.userAtualId)){
        listaCurtidas.splice(listaCurtidas.indexOf(this.userAtualId), 1)
      }
      else{
        listaCurtidas.push(this.userAtualId)
      }
    }else{
      listaCurtidas = []
      listaCurtidas.push(this.userAtualId)
    }

    this.bd.curtir(publicacaoKey, listaCurtidas, publicacaoEmail)
    this.atualizarTimeLine()
  }

  public abrir(publicacaoKey: string, publicacaoUser: string){
    this.router.navigate(['p'], {queryParams: {user: publicacaoUser, id: publicacaoKey}})   
  }

  public adicionar(prodCode: string, qtd: any, valor: string){
    if(this.email != null){
      this.listaCarrinho.push({key: prodCode, qtd: qtd});
      this.listaCarrinhoKeys.push(prodCode)
      this.mapKeyQtd.set(prodCode, qtd)
      this.qtdItens++;
      this.carrinhoTotal += parseFloat(valor.replace(',','.'))
      this.carrinhoTotal = parseFloat(this.carrinhoTotal.toFixed(2))
      this.bd.inserirListaCarrinho(this.email, this.listaCarrinho)
      this.bd.inserirTotalCarrinho(this.email, this.carrinhoTotal)
    }else{
      this.router.navigate([''])
    }

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
  }

  public meuCarrinho(){
    this.router.navigate(['/carrinho'])
  }

  public meuPerfil(): void {
    this.router.navigate(['/perfil'])
    
  }

  public pageChange(num: any){
    this.paginaAtual = num;
    let inicio = (num-1)*3;

    this.publicacoes = ['']

    //total paginas = divide total publicacoes por 3 e arrendonda depois soma com o resto da divisão
    //splice(3*pagina,3)
    this.bd.consultaPublicacoes()
      .then((listaPublicacoes: any)=>{
        this.publicacoes = listaPublicacoes.splice(inicio, 3)
      })    

  }

  public avancar(){
    this.paginaAtual++;
    this.pageChange(this.paginaAtual);
  }

  public voltar(){
    this.paginaAtual--;
    this.pageChange(this.paginaAtual);
  }


}
