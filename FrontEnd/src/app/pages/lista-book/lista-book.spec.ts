import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListaBook } from "./lista-book";

describe("ListaBook", () => {
  let component: ListaBook;
  let fixture: ComponentFixture<ListaBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaBook],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaBook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
