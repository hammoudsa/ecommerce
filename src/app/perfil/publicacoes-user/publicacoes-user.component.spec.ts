import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacoesUserComponent } from './publicacoes-user.component';

describe('PublicacoesUserComponent', () => {
  let component: PublicacoesUserComponent;
  let fixture: ComponentFixture<PublicacoesUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicacoesUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacoesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
