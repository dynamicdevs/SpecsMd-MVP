import { TestBed } from '@angular/core/testing';
import { InitiativeFormComponent } from './initiative-form.component';

describe('InitiativeFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitiativeFormComponent]
    }).compileComponents();
  });

  it('prevents saving with missing required values and invalid reduction', () => {
    const fixture = TestBed.createComponent(InitiativeFormComponent);
    const component = fixture.componentInstance;
    const saveSpy = vi.spyOn(component.saveInitiative, 'emit');
    fixture.detectChanges();

    component.form.patchValue({
      expectedReductionPercent: 150,
      proposedSolution: '',
      title: ''
    });
    component.submit();

    expect(component.form.invalid).toBe(true);
    expect(component.form.touched).toBe(true);
    expect(saveSpy).not.toHaveBeenCalled();
  });
});
