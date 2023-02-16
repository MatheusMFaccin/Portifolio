import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreHabilidadesComponent } from './sobre-habilidades.component';

describe('SobreHabilidadesComponent', () => {
  let component: SobreHabilidadesComponent;
  let fixture: ComponentFixture<SobreHabilidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SobreHabilidadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreHabilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
