import { PComponent } from './home/p/p.component';
import { TermosComponent } from './acesso/termos/termos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProcurarComponent } from './procurar/procurar.component';
import { AutenticacaoGuard } from './autenticacao-guard.service';
import { Routes } from '@angular/router'
import { AcessoComponent } from './acesso/acesso.component';
import { HomeComponent } from './home/home.component';

export const ROUTES: Routes = [
    {path: '', component: AcessoComponent},
    {path: 'home', component: HomeComponent, canActivate: [ AutenticacaoGuard ] },
    {path: 'procurar', component: ProcurarComponent, canActivate: [ AutenticacaoGuard ] },
    {path: 'perfil', component: PerfilComponent, canActivate: [ AutenticacaoGuard ] },
    {path: 'p', component: PComponent },
    {path: 'termos', component: TermosComponent }
]