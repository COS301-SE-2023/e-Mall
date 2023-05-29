<<<<<<<< HEAD:app/src/app/construction/construction.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionComponent } from './construction.component';

describe('ConstructionComponent', () => {
  let component: ConstructionComponent;
  let fixture: ComponentFixture<ConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
========
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>>> master:app/src/app/register/register.component.spec.ts
