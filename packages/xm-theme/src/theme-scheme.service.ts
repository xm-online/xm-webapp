import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ThemeSchemeState {
    scheme: 'dark' | 'light';
    isDark: boolean;
}

@Injectable({ providedIn: 'root' })
export class ThemeSchemeService {

    private scheme: BehaviorSubject<ThemeSchemeState> = new BehaviorSubject<ThemeSchemeState>({
        scheme: 'light',
        isDark: false,
    });

    public schemeChange$(): Observable<ThemeSchemeState> {
        return this.scheme.asObservable();
    }

    public reset(): void {
        this.scheme.next({ scheme: 'light', isDark: false });
    }

    public set(scheme: 'dark' | 'light'): void {
        this.scheme.next({ scheme, isDark: scheme === 'dark' });
    }
}
