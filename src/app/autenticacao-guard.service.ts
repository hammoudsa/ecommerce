import { Autenticacao } from './autenticacao.service';
import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'


@Injectable()
export class AutenticacaoGuard {

    constructor(private autenticacao: Autenticacao){}

    canActivate(): boolean {
        return this.autenticacao.autenticado()
    }
}