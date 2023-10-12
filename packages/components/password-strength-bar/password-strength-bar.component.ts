import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { XmTranslationModule } from '@xm-ngx/translation';
import { Subscription } from 'rxjs';
import { XmEventManager } from '@xm-ngx/core';
import { CommonModule } from '@angular/common';
import { IPasswordPolicy, EVENT_POLICY_UPDATED } from '@xm-ngx/components/password-policies';

const DEF_POINT_COUNT = 5;

interface IPassStrengthPoint {
    color?: string;
}

@Component({
    selector: 'xm-password-strength-bar',
    template: `
        <div id="strength">
            <small>{{'global.messages.validate.newpassword.strength'|translate}}</small>
            <ul id="strengthBar">
                <li class="point" *ngFor="let p of points" [style.backgroundColor]="p.color"></li>
            </ul>
        </div>`,
    styleUrls: [
        'password-strength-bar.css',
    ],
    standalone: true,
    imports: [CommonModule, XmTranslationModule]
})
export class PasswordStrengthBarComponent {

    public policiesUpdateSubscription: Subscription;

    public colors: string[] = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];
    public policies: IPasswordPolicy[];
    public points: IPassStrengthPoint[];

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private eventManager: XmEventManager,
    ) {
        this.points = [...Array(DEF_POINT_COUNT).keys()].map(() => ({color: null}));

        this.policiesUpdateSubscription =
            this.eventManager.listenTo(
                EVENT_POLICY_UPDATED,
            ).subscribe((event) => {
                const passedPolicies: number = event?.content;
                if (this.policies) {
                    this.mapPassedPolicies(passedPolicies);
                }
            });
    }

    @Input()
    public set passwordToCheck(password: string) {
        if (password && !(this.policies && this.policies.length)) {
            const c = this.getColor(this.measureStrength(password));
            const element = this.elementRef.nativeElement;
            if (element.className) {
                this.renderer.addClass(element, element.className);
            }
            const lis = element.getElementsByTagName('li');
            for (let i = 0; i < lis.length; i++) {
                if (i < c.idx) {
                    this.renderer.setStyle(lis[i], 'backgroundColor', c.col);
                } else {
                    this.renderer.setStyle(lis[i], 'backgroundColor', '#DDD');
                }
            }
        }
    }

    @Input()
    public set passwordConfig(c: string) {
        if (c) {
            const config = JSON.parse(c);
            this.policies = config && config.passwordPolicies;
            if (this.policies) {
                this.points = [...Array(this.policies.length).keys()].map(() => ({color: null}));
            }
        }
    }

    public ngOnDestroy() {
        if (this.policiesUpdateSubscription) {
            this.policiesUpdateSubscription.unsubscribe();
        }
    }

    public measureStrength(p: string): number {

        let force = 0;
        const regex = /[$-/:-?{-~!"^_`[\]]/g; // "
        const lowerLetters = (/[a-z]+/).test(p);
        const upperLetters = (/[A-Z]+/).test(p);
        const numbers = (/[0-9]+/).test(p);
        const symbols = regex.test(p);

        const flags = [lowerLetters, upperLetters, numbers, symbols];
        const passedMatches = flags.filter((isMatchedFlag: boolean) => {
            return isMatchedFlag === true;
        }).length;

        force += (2 * p.length) + ((p.length >= 10) ? 1 : 0);
        force += passedMatches * 10;

        // penality (short password)
        force = (p.length <= 6) ? Math.min(force, 10) : force;

        // penality (poor variety of characters)
        force = (passedMatches === 1) ? Math.min(force, 10) : force;
        force = (passedMatches === 2) ? Math.min(force, 20) : force;
        force = (passedMatches === 3) ? Math.min(force, 40) : force;

        return force;
    }

    public getColor(s: number): any {
        let idx = 0;
        if (s <= 10) {
            idx = 0;
        } else if (s <= 20) {
            idx = 1;
        } else if (s <= 30) {
            idx = 2;
        } else if (s <= 40) {
            idx = 3;
        } else {
            idx = 4;
        }
        return { idx: idx + 1, col: this.colors[idx] };
    }

    private mapPassedPolicies(policiesCount: number): void {
        const count = [...Array(policiesCount).keys()];

        switch (count.length) {
            case this.points.length: {
                this.points = this.points.map(() => ({color: this.colors[3]}));
                break;
            }
            case 0: {
                this.points = this.points.map(() => ({color: null}));
                break;
            }
            default: {
                count.forEach((c: number, i: number) => {
                    this.points = this.points.map((point: IPassStrengthPoint, pi: number) => {
                        point.color = pi > i ? null : this.colors[1];
                        return point;
                    });
                });
            }
        }
    }
}
