import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncluirEventosComponent } from './incluir-eventos.component';

describe('IncluirEventosComponent', () => {
  let component: IncluirEventosComponent;
  let fixture: ComponentFixture<IncluirEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncluirEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncluirEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
