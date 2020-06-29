import { Artista } from './acesso/artista.model';
import { LoginComponent } from './acesso/login/login.component';
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Usuario } from './acesso/usuario.model' 


import * as firebase from 'firebase'

@Injectable()
export class Autenticacao {

    public token_id: string
    public errormsg: string
    public erro: string
    

    constructor(private router: Router
                ){}

    public cadastrarUsuario(usuario: Usuario): Promise<any> {      
        return firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
        .then((resposta: any) => {
            delete usuario.senha
            firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`)
                .set({ usuario })
                let user = firebase.auth().currentUser;
                user.sendEmailVerification()

        })
        .catch((error: Error) => {
            console.log(error)
        })
    }


    public autenticar(email: string, senha: string): void {
        
        firebase.auth().signInWithEmailAndPassword(email, senha)
        .then((resposta: any) => {
            firebase.auth().currentUser.getIdToken()
            .then((idToken: string) => {
                this.token_id = idToken
                localStorage.setItem('idToken', idToken)
                console.log('Login efetuado com sucesso!')
                this.router.navigate(['/home'])
            })
        })
        .catch((error: Error) => 
            this.tratativa(error)
        )
        
    }

    public tratativa(error: Error): void {
        this.erro = String(error.message);
  
        if(this.erro == 'The email address is badly formatted.')
        {
            alert('Formato de email inválido!')
        }
        if(this.erro == 'The password is invalid or the user does not have a password.')
        {
            alert('Senha inválida!')
        }
        if(this.erro == 'There is no user record corresponding to this identifier. The user may have been deleted.')
        {
            alert('Email não cadastrado!')
        }
        if(this.erro == 'Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later.')
        {
            alert('Muitas tentativas sem sucesso, por favor tente novamente mais tarde!')
        }
        
    }

    public autenticado(): boolean {
        //verifica se já possui o tokenID armazendo no localStorage do navegador
        if(this.token_id === undefined && localStorage.getItem('idToken')!= null){
            this.token_id = localStorage.getItem('idToken')
        }
        
        //retorna para a pagina de login caso não estaja logado
        if(this.token_id === undefined){
            this.router.navigate(['/'])
        }

        //retorna true ou false 
        return this.token_id !== undefined  
    }

    public sair(){
        localStorage.removeItem('idToken')
    }


}