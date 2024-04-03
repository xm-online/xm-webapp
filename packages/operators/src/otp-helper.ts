/**
 * TODO: Remove it when types has defined in typescript
 */
export interface OTPCredential extends Credential {
    code: string;
}

export function getBrowserOtp(): Promise<OTPCredential | null> {
    if (!('OTPCredential' in window) && !navigator.credentials) {
        return Promise.reject('Web OTP API not supported');
    }

    const ac = new AbortController();

    return navigator.credentials.get({
        otp: {
            transport: ['sms'],
        },
        signal: ac.signal,
    } as CredentialRequestOptions) as Promise<OTPCredential>;
}
