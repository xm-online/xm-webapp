import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdpComponent } from './idp.component';
import { SessionStorageService } from 'ngx-webstorage';

describe('IdpComponent', () => {
    let component: IdpComponent;
    let fixture: ComponentFixture<IdpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: SessionStorageService, useValue: {}},
            ],
            declarations: [IdpComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IdpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
