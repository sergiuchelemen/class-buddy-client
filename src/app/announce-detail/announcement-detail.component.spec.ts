import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceDetailComponent } from './announcement-detail.component';

describe('AnnounceDetailComponent', () => {
  let component: AnnounceDetailComponent;
  let fixture: ComponentFixture<AnnounceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnounceDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnounceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
