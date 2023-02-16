import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreProfissionalComponent } from './sobre-profissional.component';

describe('SobreProfissionalComponent', () => {
  let component: SobreProfissionalComponent;
  let fixture: ComponentFixture<SobreProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SobreProfissionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
