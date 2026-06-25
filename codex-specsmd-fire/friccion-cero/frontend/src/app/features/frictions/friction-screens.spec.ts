import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FrictionFormPageComponent } from './friction-form-page.component';

describe('FrictionFormPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrictionFormPageComponent],
      providers: [MessageService, provideHttpClient(), provideRouter([])]
    }).compileComponents();
  });

  it('prevents saving with missing required values', async () => {
    const fixture = TestBed.createComponent(FrictionFormPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.form.patchValue({
      area: '',
      description: '',
      peopleAffected: 0,
      timeLostMinutes: -1,
      title: ''
    });

    await component.save();

    expect(component.form.invalid).toBe(true);
    expect(component.form.touched).toBe(true);
  });
});
