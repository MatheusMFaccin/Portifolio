import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioCorpoComponent } from './inicio-corpo.component';

describe('InicioCorpoComponent', () => {
  let component: InicioCorpoComponent;
  let fixture: ComponentFixture<InicioCorpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InicioCorpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioCorpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
