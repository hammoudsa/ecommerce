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
    public lista: any
    public listaPublicacoes: Array<any> = [];


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

    public consultaUsuarios(): Promise<any> {

        
        return new Promise((resolve, reject)=>{

            firebase.database().ref(`usuario_detalhe`)
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
                           
            })  
                          
        })
    }

    public consultaUsuarios2(): Promise<any> {

        
        return new Promise((resolve, reject)=>{

            firebase.database().ref(`usuario_detalhe`)
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
            })  
                          
        })
    }


    public consultaPublicacoes(): Promise<any> {
        this.listaSeguindo = ['dGVzdGUwMEBob3RtYWlsLmNvbQ==','ZGVlbm55cy5yYWZmYWVsQG91dGxvb2suY29t'] 
        
        this.consultaUsuarios2()
        .then((listaUsuarios: any) =>{
            
            this.lista = ['dGVzdGUwMEBob3RtYWlsLmNvbQ==','ZGVlbm55cy5yYWZmYWVsQG91dGxvb2suY29t']
        })

        console.log('ttteste', this.lista)  
        this.listaPublicacoes = []

        return new Promise((resolve, reject)=>{
            console.log(this.lista.length)
            for(let i=0; i<this.lista.length; i++){
                if(this.lista.includes(this.listaSeguindo[i])){
                    firebase.database().ref(`publicacoes/${this.listaSeguindo[i]}`)
                    .orderByKey()
                    .once('value')
                    .then((snapshot: any) => {
                        
                        snapshot.forEach((childSnapshot: any) => {
                            
                            let publicacao = childSnapshot.val()
                            publicacao.key = childSnapshot.key
        
                            this.listaPublicacoes.push(publicacao)
        
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
                                //consulta nome do usuario da publicação
                                firebase.database().ref(`usuario_detalhe/${this.listaSeguindo[i]}`)
                                    .once('value')
                                    .then((snapshot: any) => {
                                        publicacao.nome_usuario = snapshot.val().usuario.nome_usuario
                                    })
                            }) 
                        })
                        resolve(listaPublicacoes)
                     }) 
                     console.log('includes')
                }


            }
        }) 

         

       /*  return new Promise((resolve, reject)=>{

            firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`)
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
                        firebase.database().ref(`usuario_detalhe/${btoa(emailUsuario)}`)
                            .once('value')
                            .then((snapshot: any) => {
                                publicacao.nome_usuario = snapshot.val().usuario.nome_usuario
                            })
                    }) 
                })
                resolve(listaPublicacoes)
            })
        })  */
    }

    public consultaPublicacoes2(): Promise<any> {

        return new Promise((resolve, reject)=>{
          
                    firebase.database().ref(`publicacoes/dGVzdGUwMEBob3RtYWlsLmNvbQ==`)
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
                                firebase.database().ref(`usuario_detalhe/${btoa(this.lista[i].usuario.email)}`)
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



}


