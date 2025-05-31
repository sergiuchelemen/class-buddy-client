import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkDialogComponent } from './homework-dialog.component';

describe('HomeworkDialogComponent', () => {
  let component: HomeworkDialogComponent;
  let fixture: ComponentFixture<HomeworkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeworkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
