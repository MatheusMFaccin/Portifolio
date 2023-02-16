import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreCorpoComponent } from './sobre-corpo.component';

describe('SobreCorpoComponent', () => {
  let component: SobreCorpoComponent;
  let fixture: ComponentFixture<SobreCorpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SobreCorpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreCorpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
