import { ComponentFixture, TestBed } from '@angular/core/testing';
import MenuSelectionComponent from './menu-selection.component';

describe('MenuSelectionComponent', () => {
  let component: MenuSelectionComponent;
  let fixture: ComponentFixture<MenuSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
