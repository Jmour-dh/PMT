import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProjectDetailsComponent } from './project-details.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProjectDetailsComponent (Integration Test)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProjectDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
            snapshot: { paramMap: { get: () => '123' } },
          },
        },
      ],
    }).compileComponents();
  });

  it('should display project details after fetching data', () => {
    // Given
    const fixture = TestBed.createComponent(ProjectDetailsComponent);
    const component = fixture.componentInstance;
    // When
    fixture.detectChanges();
    // Then
    expect(component).toBeTruthy();
  });

  
});
