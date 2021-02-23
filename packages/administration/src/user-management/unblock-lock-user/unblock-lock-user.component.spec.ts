import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { UnblockLockUserComponent } from './unblock-lock-user.component';

describe('UnblockLockUserComponent', () => {
    let component: UnblockLockUserComponent;
    let fixture: ComponentFixture<UnblockLockUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmSharedTestingModule],
            declarations: [UnblockLockUserComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UnblockLockUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
