import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroArtistaComponent } from './cadastro-artista.component';

describe('CadastroArtistaComponent', () => {
  let component: CadastroArtistaComponent;
  let fixture: ComponentFixture<CadastroArtistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroArtistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroArtistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
