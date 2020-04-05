import { Progresso } from './../../progresso.service'
import { Bd } from './../../bd.service'
import { FormGroup, FormControl } from '@angular/forms'
import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { ViewChild, ElementRef } from '@angular/core';
import * as firebase from 'firebase'
import 'rxjs/Rx'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Rx'


@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  @ViewChild('uploadModal') uploadModal: ElementRef;
  public formulario: FormGroup = new FormGroup({
    'descricao': new FormControl(null)
  })

  @Output() public atualizarTimeline: EventEmitter<any> = new EventEmitter<any>()

  public email: string
  private imagem: any
  public progressoPublicacao: string = 'pendente'
  public porcentagemUpload: number
  public isArtist: boolean

  constructor(
    private bd: Bd,
    private progresso: Progresso
  ) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
      this.consultaUsuario()
    })
  } 

  public publicar(): void {
    let descricaoVerificada
    if(this.formulario.value.descricao == null){
      descricaoVerificada = " "
    }else{
      descricaoVerificada = this.formulario.value.descricao
    }
    this.bd.publicar({    
      email: this.email,
      descricao: descricaoVerificada,
      imagem: this.imagem[0]

      }) 
      let acompanhamentoUpload = Observable.interval(1500)

      let continua = new Subject()
      continua.next(true)

      acompanhamentoUpload
        .takeUntil(continua)
        .subscribe(() => {
          console.log(this.progresso.status)
          console.log(this.progresso.estado)
          this.progressoPublicacao = 'andamento'
          this.porcentagemUpload = Math.round((this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes) * 100)
          if (this.progresso.status === 'concluido'){
            continua.next(false)
            this.progressoPublicacao = 'concluido';
            this.atualizarTimeline.emit();
            //this.resetForm();
          }
        })

  }

  public resetForm(): void {
    this.formulario = new FormGroup({
      'descricao': new FormControl(null)
    })
    this.progressoPublicacao = "pendente";
  }


  public preparaImagemUpload(event: Event): void {
    this.imagem = (<HTMLInputElement>event.target).files
  }

  public consultaUsuario(): void {
    this.bd.consultaUsuarios()
   .then((listaUsuarios: any) =>{
     console.log(this.email)
     for(let i=0; i<listaUsuarios.length; i++){
       if(listaUsuarios[i].usuario.email == this.email){
         this.isArtist = listaUsuarios[i].usuario.isArtist
         
       }
      
     }
     console.log(' ', this.isArtist)
   })
  }
  
   
}
