import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditBookComponent } from "./edit-book";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

describe("EditBookComponent", () => {
  let component: EditBookComponent;
  let fixture: ComponentFixture<EditBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBookComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
