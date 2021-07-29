import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { JhiEventManager } from 'ng-jhipster';
import { XM_EVENT_LIST } from '../../xm.constants';

export interface IPasswordPolicy {
    pattern: string;
    patternMessage: { [key: string]: string };
    message?: string;
    passed?: boolean;
}

@Component({
    selector: 'xm-password-policies',
    templateUrl: './password-policies.component.html',
    styleUrls: ['./password-policies.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class PasswordPoliciesComponent implements OnChanges {

    @Input() private config: any;
    @Input() private password: any;

    public showPolicies: boolean;
    public policies: IPasswordPolicy[];
    public policiesRequired: number;
    public passedPolicies: number;
    public policyCheckRequired: boolean;

    constructor(
        private eventManager: JhiEventManager,
    ) { }


    ngOnChanges(changes: SimpleChanges): void {
        if ((typeof this.password === 'string') && this.policies) {
            this.checkPassword();
        }

        if (changes.config && changes.config.currentValue) {
            this.handleConfig();
        }
    }

    private checkPassword(): void {
        this.policies = this.policies.map(policy => {
            const pattern = new RegExp(policy.pattern, 'u');
            policy.passed = pattern.test(this.password);

            return policy;
        });

        this.passedPolicies = this.policies.filter(policy => Boolean(policy.passed)).length;
        this.eventManager.broadcast({name: XM_EVENT_LIST.XM_PASSWORD_POLICY_UPDATE, content: this.passedPolicies})
    }

    private handleConfig(): void {
        if (typeof this.config === 'string') {
            this.config = JSON.parse(this.config);
        }

        const { passwordPolicies, passwordPoliciesMinimalMatchCount } = this.config;

        if (!passwordPolicies || !passwordPoliciesMinimalMatchCount || !passwordPolicies.length) {
            return;
        }

        this.policyCheckRequired = true;
        this.policiesRequired = passwordPoliciesMinimalMatchCount;
        this.passedPolicies = 0;
        this.policies = passwordPolicies.map(policy => {
            policy.passed = false;
            return policy;
        });
        this.showPolicies = true;
    }
}
