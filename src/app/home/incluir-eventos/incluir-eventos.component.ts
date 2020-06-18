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
  selector: 'app-incluir-eventos',
  templateUrl: './incluir-eventos.component.html',
  styleUrls: ['./incluir-eventos.component.css']
})
export class IncluirEventosComponent implements OnInit {

  @ViewChild('eventModal') eventModal: ElementRef;
  public formulario: FormGroup = new FormGroup({
    'titulo' : new FormControl(null), 
    'descricao': new FormControl(null),
    'data' : new FormControl(null),
    'local': new FormControl(null),
    'compra' : new FormControl(null) 

  })

  public email: string
  private imagem: any
  public progressoPublicacao: string = 'pendente'
  public porcentagemUpload: number
  public isArtist: boolean

  @Output() public atualizarTimeline: EventEmitter<any> = new EventEmitter<any>()

  constructor( 
    private bd: Bd,
    private progresso: Progresso) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
    })
  }

  public publicarEvento(): void {
    let descricaoVerificada
    if(this.formulario.value.descricao == null){
      descricaoVerificada = " "
    }else{
      descricaoVerificada = this.formulario.value.descricao
    }

    if(this.formulario.value.data == null || this.formulario.value.titulo == null){
       alert('Por favor, preencha todos os campos!')
    }else{ 
      this.bd.publicarEvento({    
        email: this.email,
        titulo: this.formulario.value.titulo,  
        descricao: descricaoVerificada,
        data: this.formulario.value.data,
        local: '',
        compra: '', 
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
              this.resetForm();
            }
          })

     } 

    

  }

  public resetForm(): void {
    this.formulario = new FormGroup({
    'titulo' : new FormControl(null), 
    'descricao': new FormControl(null),
    'data' : new FormControl(null),
    'local': new FormControl(null),
    'compra' : new FormControl(null) 
    })
    this.progressoPublicacao = "pendente";
  }


  public preparaImagemUpload(event: Event): void {
    this.imagem = (<HTMLInputElement>event.target).files
  }

}
