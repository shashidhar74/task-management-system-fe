import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedTasksComponent } from './unassigned-tasks.component';

describe('UnassignedTasksComponent', () => {
  let component: UnassignedTasksComponent;
  let fixture: ComponentFixture<UnassignedTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnassignedTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnassignedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
