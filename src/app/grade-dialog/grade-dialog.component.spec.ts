import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeDialogComponent } from './grade-dialog.component';

describe('GradeDialogComponent', () => {
  let component: GradeDialogComponent;
  let fixture: ComponentFixture<GradeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
