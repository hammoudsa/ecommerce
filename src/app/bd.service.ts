import { Usuario } from './acesso/usuario.model';
import { Progresso } from './progresso.service'
import { Injectable } from '@angular/core'
import * as firebase from 'firebase'
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes'
import { reject, resolve } from 'q';


@Injectable()
export class Bd {

    constructor(private progresso: Progresso){

    }
    public listaTodosUsuarios: Array<any>
    public listaSeguindo: Array<any>
    public lista: Array<any>
    public listaPublicacoes: Array<any> = [];
    public listaComentarios: Array<any> = [];
    public emailUsuario: any
    public listaKeys: Array<any>

    public listaNomes: Array<any>

    public listMockada: Array<any>
    public urlImagem: string



    public publicar(publicacao: any): void {
             
        firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`)
        .push( {descricao: publicacao.descricao})
        .then((resposta: any) => {
            let nomeImagem = resposta.key

            firebase.storage().ref()
            .child(`imagens/${nomeImagem}`)
            .put(publicacao.imagem)
            .on(firebase.storage.TaskEvent.STATE_CHANGED,
                //acompanhar o progresso do upload
                (snapshot: any) => {

                    this.progresso.status = 'em andamento'
                    this.progresso.estado = snapshot

                },
                (error) => { 
                    this.progresso.status = 'erro'
              
                },
                () => {
                    //finalização do progresso
                    this.progresso.status = 'concluido'

                }
            ) 
        })
      
    }

    public publicarEvento (publicacao: any): void {
             
        firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`)
        .push( {titulo: publicacao.titulo, 
                descricao: publicacao.descricao,
                data: publicacao.data,
                local: publicacao.local,
                compra: publicacao.compra  })
        .then((resposta: any) => {
            let nomeImagem = resposta.key

            firebase.storage().ref()
            .child(`imagens/${nomeImagem}`)
            .put(publicacao.imagem)
            .on(firebase.storage.TaskEvent.STATE_CHANGED,
                //acompanhar o progresso do upload
                (snapshot: any) => {

                    this.progresso.status = 'em andamento'
                    this.progresso.estado = snapshot

                },
                (error) => { 
                    this.progresso.status = 'erro'
              
                },
                () => {
                    //finalização do progresso
                    this.progresso.status = 'concluido'

                }
            ) 
        })
      
    }


    public alterarPerfil(publicacao: any): void {
             
        firebase.database().ref(`perfil/${btoa(publicacao.email)}`)
        .push( {})
        .then((resposta: any) => {

            firebase.storage().ref()
            .child(`perfil/${publicacao.email}`)
            .put(publicacao.imagem)
            .on(firebase.storage.TaskEvent.STATE_CHANGED,
                //acompanhar o progresso do upload
                (snapshot: any) => {

                    this.progresso.status = 'em andamento'
                    this.progresso.estado = snapshot

                },
                (error) => { 
                    this.progresso.status = 'erro'
              
                },
                () => {
                    //finalização do progresso
                    this.progresso.status = 'concluido'

                }
            ) 
        })  
    }

    public consultaImagemPerfil(email: string): Promise<any> {
          
        return new Promise((resolve, reject)=>{
            let urltest: Array<any>
            urltest = []
            firebase.storage().ref()
            .child(`perfil/${email}`)
            .getDownloadURL()
            .then((url: string) => {
                urltest.push(url) 
                 
            }) 
            resolve(urltest)
           
        }) 
                  
    }

    //consulta da listas de seguidores atreladas ao usuario logado
    public consultaListaSeguidores(email: any): Promise<any> {
        this.emailUsuario = email

        return new Promise((resolve, reject)=>{

            firebase.database().ref(`usuario_detalhe/${btoa(this.emailUsuario)}/usuario/listaSeguidores`)
            .once('value')
            .then((snapshot: any) => {

                let listaSeg: Array<any> = [];

                snapshot.forEach((childSnapshot: any) => {
                    
                    let usuario = childSnapshot.val()
                    listaSeg.push(usuario)

                }) 
                resolve(listaSeg)
                console.log('retorno banco de dados: ', listaSeg)  
                this.listaSeguindo = listaSeg
                           
            })  
                          
        })
    }

    //insere a lista de seguidores no firebase
    public inserirSeguidores(email: any, listaSeguindo: Array<any>): void {
        this.emailUsuario = email
        this.listMockada = listaSeguindo    
        let userRef = firebase.database().ref(`usuario_detalhe/${btoa(this.emailUsuario)}`)
        userRef.child('usuario').update({'listaSeguidores': this.listMockada})
    }

    //consulta de todos os usuarios cadastrados na aplicação
    public consultaUsuarios(): Promise<any> {

        return new Promise((resolve, reject)=>{

            firebase.database().ref('usuario_detalhe')
            .once('value')
            .then((snapshot: any) => {

                let listaUsuarios: Array<any> = [];

                snapshot.forEach((childSnapshot: any) => {
                    
                    let usuario = childSnapshot.val()
                    usuario.key = childSnapshot.key
                    usuario.nome_usuario = childSnapshot.val().usuario.nome_usuario

                    listaUsuarios.push(usuario)

                }) 
                resolve(listaUsuarios)  
                this.listaTodosUsuarios = listaUsuarios
                
                this.listaKeys = []

                for(let i=0; i<listaUsuarios.length; i++){
                    this.listaKeys.push(listaUsuarios[i].key)
                }
                console.log('LISTA BY KEYS', this.listaKeys) 
                           
            })  
                          
        })
    }

    //consulta das publicações de acordo com a lista de seguidores retornada do  firebase
    public consultaPublicacoes(): Promise<any> {
        console.log('lista keys::: ', this.listaKeys)
        this.lista = this.listaKeys //Array com os keys da listaTodosUsuarios
        this.listaPublicacoes = []

        return new Promise((resolve, reject)=>{
            //console.log(this.lista.length)
            for(let i=0; i<this.lista.length; i++){
                if(this.lista.includes(this.listaSeguindo[i])){
                    firebase.database().ref(`publicacoes/${this.listaSeguindo[i]}`)
                    .orderByKey()
                    .once('value')
                    .then((snapshot: any) => {                       
                        snapshot.forEach((childSnapshot: any) => {
                            let publicacao = childSnapshot.val()
                            publicacao.key = childSnapshot.key
                        
                             //insere nome do usuario da publicação
                            publicacao.nome_usuario = atob(this.listaSeguindo[i])
                            for(let i=0; i<this.listaTodosUsuarios.length; i++){
                                if(publicacao.nome_usuario == this.listaTodosUsuarios[i].usuario.email){
                                    publicacao.nome_usuario = this.listaTodosUsuarios[i].nome_usuario
                                    publicacao.isArtist = this.listaTodosUsuarios[i].usuario.isArtist
                                    this.listaPublicacoes.push(publicacao)
                                }
                            }    
                            childSnapshot.forEach((child: any) => {
                                let desc = child.val()
                                console.log(child.key)
                                this.listaComentarios = []
                                if(child.key == 'comentarios'){
                                    child.forEach((coment: any) => {
                                        publicacao.listaComentarios =[]
                                        let comentario = coment.val()
                                        console.log(coment.comentario)
                                                                                        
                                        this.listaComentarios.push(comentario)
                                        publicacao.listaComentarios = this.listaComentarios
                                    })
                                }
                            })

                        })                
                        return this.listaPublicacoes.reverse()  
                    })

                     .then((listaPublicacoes: any) => {
                        listaPublicacoes.forEach((publicacao) => {
                            //consulta da url da imagem
                            firebase.storage().ref()
                            .child(`imagens/${publicacao.key}`)
                            .getDownloadURL()
                            .then((url: string) => {
                                publicacao.url_imagem = url    
                            }) 
                        })
                        resolve(listaPublicacoes)
                     }) 
                }

            }
        }) 

    }

    public consultaPublicacoesUser(email: any): Promise<any>{
        this.emailUsuario = email
        return new Promise((resolve, reject)=>{

            firebase.database().ref(`publicacoes/${btoa(this.emailUsuario)}`)
            .orderByKey()
            .once('value')
            .then((snapshot: any) => {
                
                let listaPublicacoes: Array<any> = [];

                snapshot.forEach((childSnapshot: any) => {
                    
                    let publicacao = childSnapshot.val()
                    publicacao.key = childSnapshot.key

                    listaPublicacoes.push(publicacao)

                })                
 
                return listaPublicacoes.reverse()  
            })
            .then((listaPublicacoes: any) => {

                listaPublicacoes.forEach((publicacao) => {
                    //consulta da url da imagem
                    firebase.storage().ref()
                    .child(`imagens/${publicacao.key}`)
                    .getDownloadURL()
                    .then((url: string) => {

                        publicacao.url_imagem = url
                        //consulta nome do usuario da publicação
                        firebase.database().ref(`usuario_detalhe/${btoa(this.emailUsuario)}`)
                            .once('value')
                            .then((snapshot: any) => {
                                publicacao.nome_usuario = snapshot.val().usuario.nome_usuario

                            })
                    }) 
                })
                resolve(listaPublicacoes)
            })
        }) 
    
    }



    public consultaArtistas(): Promise<any> {

        return new Promise((resolve, reject)=>{

            firebase.database().ref(`artista_detalhe`)
            .once('value')
            .then((snapshot: any) => {

                let listaArtistas: Array<any> = [];

                snapshot.forEach((childSnapshot: any) => {
                    
                    let artista = childSnapshot.val()
                    artista.key = childSnapshot.key
                    artista.nome_usuario = childSnapshot.val().artista.nome_usuario
                    artista.genero = childSnapshot.val().artista.genero

                    listaArtistas.push(artista)

                }) 
                resolve(listaArtistas)
                              
            })  
                          
        })
    }

    public deletarDadosConta(): void{
        firebase.database().ref('publicacoes').child(btoa(this.emailUsuario)).remove()
    }

    public apagarPublicacao(publicacaoKey: string): void{
        firebase.database().ref('publicacoes').child(btoa(this.emailUsuario)).child(publicacaoKey).remove()
    }

    public comentar(userEmail: string, publicacaoKey: string, userAtual: string, comentario: any){
        firebase.database().ref(`publicacoes/${btoa(userEmail)}/${publicacaoKey}/comentarios`)
        .push( {usuario: userAtual, comentario: comentario})

    }

    public curtir(publicacaoKey: any, listaCurtidas: Array<any>, emailUsuario: string): void {
  
        let userRef = firebase.database().ref(`publicacoes/${btoa(emailUsuario)}/${publicacaoKey}`)
        userRef.child('curtidas').update({'listaCurtidas': listaCurtidas})
    }

    public consultarUsuarioKey(nomeUsuario: string){
        let query = firebase.database().ref('usuario_detalhe').orderByChild('usuario/nome_usuario').equalTo(nomeUsuario)
        console.log('query::: ', query)
        return new Promise((resolve, reject)=>{
            query.on('value', snap => {
                resolve(snap.val())
            })
        })
    }

    public consultarUsuarioKey2(imgKey: string){
        let query = firebase.database().ref('publicacoes').orderByKey()
        console.log('query2::: ', query)
        return new Promise((resolve, reject)=>{
            query.on('value', snap => {
                resolve(snap.val())
            })
        })
    }

    public consultarPublicacaoByKey(userKey: string, pubKey: string){
        this.consultaUsuarios()
        this.lista = this.listaKeys //Array com os keys da listaTodosUsuarios
        let publicacao
        return new Promise((resolve, reject)=>{
            firebase.database().ref(`publicacoes/${userKey}/${pubKey}`)
            .orderByKey()
            .once('value')
            .then((snapshot: any) => {                       
                
                publicacao = snapshot.val()
                publicacao.key = snapshot.key

                //insere nome do usuario da publicação
                publicacao.nome_usuario = atob(userKey)
                for(let i=0; i<this.listaTodosUsuarios.length; i++){
                    if(publicacao.nome_usuario == this.listaTodosUsuarios[i].usuario.email){
                        publicacao.nome_usuario = this.listaTodosUsuarios[i].nome_usuario
                        publicacao.isArtist = this.listaTodosUsuarios[i].usuario.isArtist
                    }
                }    

                snapshot.forEach((child: any) => {
                    let desc = child.val()
                    console.log(child.key)
                    this.listaComentarios = []
                    if(child.key == 'comentarios'){
                        child.forEach((coment: any) => {
                            publicacao.listaComentarios =[]
                            let comentario = coment.val()
                            console.log(coment.comentario)
                                                                            
                            this.listaComentarios.push(comentario)
                            publicacao.listaComentarios = this.listaComentarios
                        })
                    }
                })                
                return publicacao
            })

            .then((publicacao: any) => {
                //consulta da url da imagem
                firebase.storage().ref()
                .child(`imagens/${publicacao.key}`)
                .getDownloadURL()
                .then((url: string) => {
                    publicacao.url_imagem = url    
                }) 
                
                resolve(publicacao)
            })          
        }) 
    }
}


