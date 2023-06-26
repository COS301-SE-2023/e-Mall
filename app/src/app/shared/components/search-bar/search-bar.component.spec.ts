import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the search bar component', () => {
    expect(component).toBeTruthy();
  });
  

it('should initialize searchInputController with an empty string', () => {
  expect(component.searchInputController.value).toEqual('');
});

it('should set placeHolder value correctly', () => {
  expect(component.placeHolder).toEqual('What are you looking for?');
});

it('should initialize searchHistories array with mock data', () => {
  expect(component.searchHistories).toEqual(['one', 'two', 'three']);
});

it('should call search method when Enter key is pressed', () => {
  spyOn(component, 'search');
  const event = { code: 'Enter' };
  component.keyDownFunction(event);
  expect(component.search).toHaveBeenCalled();
});

it('should call search method when search icon is clicked', () => {
  spyOn(component, 'search');
  component.searchInputController.setValue('example');
  component.searchIconFunction();
  expect(component.search).toHaveBeenCalled();
});

// Add more test cases...


  

});
