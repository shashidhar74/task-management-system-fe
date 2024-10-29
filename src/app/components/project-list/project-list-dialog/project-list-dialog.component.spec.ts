import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListDialogComponent } from './project-list-dialog.component';

describe('ProjectListDialogComponent', () => {
  let component: ProjectListDialogComponent;
  let fixture: ComponentFixture<ProjectListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
