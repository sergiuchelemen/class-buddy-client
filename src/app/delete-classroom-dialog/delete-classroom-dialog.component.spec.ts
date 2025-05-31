import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClassroomDialogComponent } from './delete-classroom-dialog.component';

describe('DeleteClassroomDialogComponent', () => {
  let component: DeleteClassroomDialogComponent;
  let fixture: ComponentFixture<DeleteClassroomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteClassroomDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteClassroomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
