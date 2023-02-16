import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetosCorpoComponent } from './projetos-corpo.component';

describe('ProjetosCorpoComponent', () => {
  let component: ProjetosCorpoComponent;
  let fixture: ComponentFixture<ProjetosCorpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjetosCorpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetosCorpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
