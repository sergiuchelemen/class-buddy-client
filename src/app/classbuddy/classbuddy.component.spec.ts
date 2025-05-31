import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassbuddyComponent } from './classbuddy.component';

describe('ClassbuddyComponent', () => {
  let component: ClassbuddyComponent;
  let fixture: ComponentFixture<ClassbuddyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassbuddyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassbuddyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
