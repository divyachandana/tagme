import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeytagmeComponent } from './keytagme.component';

describe('KeytagmeComponent', () => {
  let component: KeytagmeComponent;
  let fixture: ComponentFixture<KeytagmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeytagmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeytagmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
