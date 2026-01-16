import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolMealInfoComponent } from './school-meal-info.component';

describe('SchoolMealInfoComponent', () => {
  let component: SchoolMealInfoComponent;
  let fixture: ComponentFixture<SchoolMealInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolMealInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolMealInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
