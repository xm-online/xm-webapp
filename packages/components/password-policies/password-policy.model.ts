export interface IPasswordPolicyConfig {
    passwordPolicies?: IPasswordPolicy[];
    passwordPoliciesMinimalMatchCount?: number;
}

export interface IPasswordPolicy {
    pattern: string;
    patternMessage: { [key: string]: string };
    message?: string;
    passed?: boolean;
}

export const EVENT_POLICY_UPDATED = 'xmPasswordPolicyUpdate';