import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { XmArrayControl } from './xm-array-control.component';
import { EntityCollectionFactoryService, IEntityCollection } from '@xm-ngx/repositories';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

class StubEntityCollectionFactory {
    public create<T>(resource: string, url?: string): IEntityCollection<T> {
        return undefined;
    }
}

describe('XmArrayControlComponent', () => {
    let component: XmArrayControl;
    let fixture: ComponentFixture<XmArrayControl>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                XmTranslationTestingModule,
                MatAutocompleteModule,
                ReactiveFormsModule,
                XmArrayControl,
                NoopAnimationsModule,
                ControlErrorModule.forRoot(null),
            ],
            providers: [
                {
                    provide: NgControl,
                    useValue: {
                        control: new FormControl(),
                    },
                },
                {
                    provide: EntityCollectionFactoryService,
                    useClass: StubEntityCollectionFactory,
                },
            ],
            declarations: [],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(XmArrayControl);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('blur and option selection', () => {
        const tokenEnd = (value: string) => ({ input: { value } as HTMLInputElement, value } as any);

        beforeEach(() => {
            component.config = { ...component.config, autocomplete: ['abcdef'] };
        });

        it('should not add the partial input when an option is being selected', () => {
            component.selectingOption = true;
            component.add(tokenEnd('abc'));
            component.select({ option: { value: 'abcdef' } } as any);

            expect(component.selectedItems).toEqual(['abcdef']);
        });

        it('should add the input on blur outside option selection', () => {
            component.add(tokenEnd('abc'));

            expect(component.selectedItems).toEqual(['abc']);
        });
    });
});
