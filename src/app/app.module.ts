import { CadastroArtistaComponent } from './acesso/cadastro-artista/cadastro-artista.component';
import { ROUTES } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'


import { Autenticacao } from './autenticacao.service'
import { AutenticacaoGuard } from './autenticacao-guard.service'
import { Bd } from './bd.service';
import { Progresso } from './progresso.service'


import { AppComponent } from './app.component';
import { AcessoComponent } from './acesso/acesso.component';
import { BannerComponent } from './acesso/banner/banner.component';
import { LoginComponent } from './acesso/login/login.component';
import { CadastroComponent } from './acesso/cadastro/cadastro.component';
import { HomeComponent } from './home/home.component';
import { PublicacoesComponent } from './home/publicacoes/publicacoes.component';
import { from } from 'rxjs';
import { IncluirPublicacaoComponent } from './home/incluir-publicacao/incluir-publicacao.component';
import { ProcurarComponent } from './procurar/procurar.component';
import { UsuariosComponent } from './procurar/usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { InformacoesComponent } from './perfil/informacoes/informacoes.component';
import { TermosComponent } from './acesso/termos/termos.component';
import { PublicacoesUserComponent } from './perfil/publicacoes-user/publicacoes-user.component';
import { EditarPerfilComponent } from './perfil/editar-perfil/editar-perfil.component';


@NgModule({
  declarations: [
    AppComponent,
    AcessoComponent,
    BannerComponent,
    LoginComponent,
    CadastroComponent,
    HomeComponent,
    PublicacoesComponent,
    IncluirPublicacaoComponent,
    CadastroArtistaComponent,
    ProcurarComponent,
    UsuariosComponent,
    PerfilComponent,
    InformacoesComponent,
    TermosComponent,
    PublicacoesUserComponent,
    EditarPerfilComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule, 
    RouterModule.forRoot(ROUTES)
  ],
  providers: [Autenticacao, AutenticacaoGuard, Bd, Progresso],
  bootstrap: [AppComponent]
})
export class AppModule { }
