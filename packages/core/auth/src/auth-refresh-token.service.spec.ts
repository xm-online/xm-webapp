import { TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { of, throwError } from 'rxjs';

import { AuthRefreshTokenService, EXPIRES_DATE_FIELD } from './auth-refresh-token.service';
import { XmCoreConfig } from '@xm-ngx/core';
import { REFRESH_TOKEN } from './xm-authentication-store.constants';

// Mirror the module-level constants so tests can reference them without
// reaching into the implementation's unexported symbols.
const REFRESH_LEADER_LOCK = 'xm_auth_refresh_leader';
const RETRY_BASE_MS = 5_000;
const RETRY_CAP_MS = 60_000;
const MAX_RETRY_ATTEMPTS = 3;

/** Minimal spy-able interface for the Web Locks API. */
interface MockLockManager {
    request: jasmine.Spy;
}

describe('AuthRefreshTokenService', () => {
    let service: AuthRefreshTokenService;
    let localStorageSpy: jasmine.SpyObj<LocalStorageService>;
    let sessionStorageSpy: jasmine.SpyObj<SessionStorageService>;
    let mockLockManager: MockLockManager;

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Returns a timestamp that is {@link offsetMs} milliseconds in the future. */
    function expiryFrom(offsetMs: number): number {
        return Date.now() + offsetMs;
    }

    /** 10 minutes — enough runway for any timer scheduled 60 s before expiry. */
    const TEN_MIN = 10 * 60 * 1_000;

    /**
     * Configure the mock lock manager to immediately invoke the leader callback
     * (simulates "this tab wins the election immediately").
     */
    function grantLeadership(): void {
        mockLockManager.request.and.callFake(
            (name: string, _opts: unknown, cb: () => unknown) => {
                if (name === REFRESH_LEADER_LOCK) {
                    cb(); // synchronous: isLeader = true, scheduleLeaderTimer()
                }
                return new Promise(() => { /* held indefinitely */ });
            },
        );
    }

    /**
     * Configure the mock lock manager to never invoke any callback
     * (simulates "this tab is a follower waiting behind the current leader").
     */
    function denyLeadership(): void {
        mockLockManager.request.and.returnValue(new Promise(() => { /* waiting */ }));
    }

    function enableRememberMe(): void {
        localStorageSpy.retrieve.withArgs(REFRESH_TOKEN).and.returnValue('some-refresh-token');
    }

    function setStoredExpiry(expiry: number): void {
        sessionStorageSpy.retrieve.withArgs(EXPIRES_DATE_FIELD).and.returnValue(expiry);
        localStorageSpy.retrieve.withArgs(EXPIRES_DATE_FIELD).and.returnValue(null);
    }

    // ── Setup ─────────────────────────────────────────────────────────────────

    beforeEach(() => {
        mockLockManager = { request: jasmine.createSpy('request') };
        denyLeadership();

        localStorageSpy = jasmine.createSpyObj<LocalStorageService>(
            'LocalStorageService', ['retrieve', 'store', 'clear'],
        );
        sessionStorageSpy = jasmine.createSpyObj<SessionStorageService>(
            'SessionStorageService', ['retrieve', 'store', 'clear'],
        );

        // Default: no remember-me token, no stored expiry.
        localStorageSpy.retrieve.and.returnValue(null);
        sessionStorageSpy.retrieve.and.returnValue(null);

        TestBed.configureTestingModule({
            providers: [
                { provide: LocalStorageService, useValue: localStorageSpy },
                { provide: SessionStorageService, useValue: sessionStorageSpy },
                { provide: XmCoreConfig, useValue: { SINGLE_SESSION_TAB_SYNC: true } },
                // Pass-through zone so zone.run() executes callbacks synchronously in tests.
                { provide: NgZone, useValue: { run: (fn: () => unknown) => fn() } },
                AuthRefreshTokenService,
            ],
        });

        service = TestBed.inject(AuthRefreshTokenService);

        // Route all lock-manager access through our controllable spy.
        spyOn<any>(service, 'getLockManager').and.returnValue(mockLockManager);
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    // ── Smoke test ────────────────────────────────────────────────────────────

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Fallback path: tab sync disabled / Web Locks unavailable
    // ─────────────────────────────────────────────────────────────────────────

    describe('legacy fallback path (tab sync disabled or Web Locks unavailable)', () => {

        it('uses legacy timer when SINGLE_SESSION_TAB_SYNC is false', fakeAsync(() => {
            (service as any).coreConfig = { SINGLE_SESSION_TAB_SYNC: false };
            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback);

            // No lock should have been requested
            expect(mockLockManager.request).not.toHaveBeenCalled();

            // Timer fires at expiry - 60 s
            const delay = expiry - new Date().setSeconds(0) - 60_000;
            tick(delay + 500);
            expect(callback).toHaveBeenCalledTimes(1);

            discardPeriodicTasks();
        }));

        it('uses legacy timer when Web Locks API is unavailable', fakeAsync(() => {
            enableRememberMe();
            (service as any).getLockManager.and.returnValue(null);

            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback);

            expect(mockLockManager.request).not.toHaveBeenCalled();

            const delay = expiry - new Date().setSeconds(0) - 60_000;
            tick(delay + 500);
            expect(callback).toHaveBeenCalledTimes(1);

            discardPeriodicTasks();
        }));

        it('fires callback immediately when the token is already expired (legacy)', fakeAsync(() => {
            (service as any).coreConfig = { SINGLE_SESSION_TAB_SYNC: false };
            setStoredExpiry(Date.now() - 10 * 60 * 1_000); // 10 min ago

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback);

            expect(callback).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));

        it('does not throw when the callback errors in legacy mode', fakeAsync(() => {
            (service as any).coreConfig = { SINGLE_SESSION_TAB_SYNC: false };
            setStoredExpiry(Date.now() - 1_000);

            const callback = jasmine.createSpy('callback').and.returnValue(
                throwError(() => new Error('fail')),
            );

            expect(() => {
                service.start(null, callback);
                flush();
            }).not.toThrow();

            discardPeriodicTasks();
        }));
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Leader election
    // ─────────────────────────────────────────────────────────────────────────

    describe('leader election', () => {
        beforeEach(() => enableRememberMe());

        it('requests the leader lock exactly once per tab lifetime', fakeAsync(() => {
            grantLeadership();
            setStoredExpiry(expiryFrom(TEN_MIN));

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback);
            service.start(null, callback); // second call must NOT re-request the lock

            expect(mockLockManager.request).toHaveBeenCalledTimes(1);
            expect(mockLockManager.request).toHaveBeenCalledWith(
                REFRESH_LEADER_LOCK,
                { mode: 'exclusive' },
                jasmine.any(Function),
            );

            discardPeriodicTasks();
        }));

        it('schedules a proactive timer when the tab becomes leader', fakeAsync(() => {
            grantLeadership();
            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback);

            const delay = expiry - new Date().setSeconds(0) - 60_000;

            tick(delay - 1_000);
            expect(callback).not.toHaveBeenCalled(); // not yet

            tick(2_000);
            expect(callback).toHaveBeenCalledTimes(1); // fired

            discardPeriodicTasks();
        }));

        it('does NOT schedule a timer when the tab is a follower', fakeAsync(() => {
            denyLeadership(); // lock never granted
            setStoredExpiry(expiryFrom(TEN_MIN));

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback);

            // Advance well past when a proactive timer would have fired
            tick(TEN_MIN + 5_000);
            expect(callback).not.toHaveBeenCalled();

            discardPeriodicTasks();
        }));

        it('allows a new election after clear() resets the leadership state', fakeAsync(() => {
            grantLeadership();
            setStoredExpiry(expiryFrom(TEN_MIN));

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback);
            expect(mockLockManager.request).toHaveBeenCalledTimes(1);

            service.clear(); // resets leadershipRequested

            service.start(null, callback);
            expect(mockLockManager.request).toHaveBeenCalledTimes(2); // re-elected

            discardPeriodicTasks();
        }));

        it('fires callback immediately when expiry is past on leader startup', fakeAsync(() => {
            grantLeadership();
            setStoredExpiry(Date.now() - 5_000); // already expired

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback);

            // scheduleLeaderTimer detects expiry → fires callback synchronously
            expect(callback).toHaveBeenCalledTimes(1);

            discardPeriodicTasks();
        }));
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Timer rescheduling — no duplicate / growing timers
    // ─────────────────────────────────────────────────────────────────────────

    describe('timer rescheduling (no duplicate timers)', () => {
        beforeEach(() => {
            enableRememberMe();
            grantLeadership();
        });

        it('clears the previous timer before scheduling a new one', fakeAsync(() => {
            const clearTimeoutSpy = spyOn(window, 'clearTimeout').and.callThrough();
            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback); // schedules timer #1

            // Simulating a re-schedule (e.g. after a successful refresh updates expiry)
            service.start(null, callback); // should cancel timer #1, schedule timer #2

            expect(clearTimeoutSpy).toHaveBeenCalled();

            discardPeriodicTasks();
        }));

        it('fires the callback exactly once per scheduled interval', fakeAsync(() => {
            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            const callback = jasmine.createSpy('callback').and.returnValue(of({}));
            service.start(null, callback);

            const delay = expiry - new Date().setSeconds(0) - 60_000;
            tick(delay + 500);

            expect(callback).toHaveBeenCalledTimes(1);

            discardPeriodicTasks();
        }));
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Backoff / retry on failure
    // ─────────────────────────────────────────────────────────────────────────

    describe('retry with exponential backoff', () => {
        beforeEach(() => {
            enableRememberMe();
            grantLeadership();
            // Remove jitter to make retry delays fully deterministic.
            spyOn(Math, 'random').and.returnValue(0);
        });

        it('retries after RETRY_BASE_MS on the first failure', fakeAsync(() => {
            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            let attempts = 0;
            const callback = jasmine.createSpy('callback').and.callFake(() => {
                attempts++;
                return attempts === 1
                    ? throwError(() => new Error('transient'))
                    : of(null);
            });

            service.start(null, callback);

            const delay = expiry - new Date().setSeconds(0) - 60_000;
            tick(delay + 500); // initial timer fires → attempt 1 fails
            expect(attempts).toBe(1);

            tick(RETRY_BASE_MS); // first retry fires (jitter = 0)
            expect(attempts).toBe(2); // succeeded on retry

            discardPeriodicTasks();
        }));

        it('doubles the backoff delay after each consecutive failure', fakeAsync(() => {
            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            const alwaysFail = jasmine.createSpy('callback').and.returnValue(
                throwError(() => new Error('fail')),
            );

            service.start(null, alwaysFail);

            const initial = expiry - new Date().setSeconds(0) - 60_000;
            tick(initial + 500); // attempt 1
            expect(alwaysFail).toHaveBeenCalledTimes(1);

            tick(RETRY_BASE_MS); // attempt 2 (5 s — index 0)
            expect(alwaysFail).toHaveBeenCalledTimes(2);

            tick(RETRY_BASE_MS * 2); // attempt 3 (10 s — index 1)
            expect(alwaysFail).toHaveBeenCalledTimes(3);

            // Budget exhausted (MAX_RETRY_ATTEMPTS = 3) — no more retries
            tick(RETRY_BASE_MS * 4); // would be attempt 4 if unlimited
            expect(alwaysFail).toHaveBeenCalledTimes(3);

            discardPeriodicTasks();
        }));

        it('stops after MAX_RETRY_ATTEMPTS regardless of remaining token lifetime', fakeAsync(() => {
            // Token has plenty of time left so the expiry guard wouldn't stop us
            const expiry = expiryFrom(60 * 60 * 1_000); // 1 hour
            setStoredExpiry(expiry);

            const alwaysFail = jasmine.createSpy('callback').and.returnValue(
                throwError(() => new Error('fail')),
            );

            service.start(null, alwaysFail);

            const initial = expiry - new Date().setSeconds(0) - 60_000;
            tick(initial + 500); // attempt 1

            for (let i = 0; i < MAX_RETRY_ATTEMPTS - 1; i++) {
                tick(RETRY_CAP_MS + 1_000); // wait long enough for any backoff delay
            }

            // Exactly MAX_RETRY_ATTEMPTS total attempts made
            expect(alwaysFail).toHaveBeenCalledTimes(MAX_RETRY_ATTEMPTS);

            // No further timer should fire even after a long wait
            tick(60 * 60 * 1_000);
            expect(alwaysFail).toHaveBeenCalledTimes(MAX_RETRY_ATTEMPTS);

            discardPeriodicTasks();
        }));

        it('caps the retry delay at RETRY_CAP_MS', fakeAsync(() => {
            // One hour of budget so expiry guard doesn't interfere.
            const expiry = expiryFrom(60 * 60 * 1_000);
            setStoredExpiry(expiry);

            const setTimeoutSpy = spyOn(window, 'setTimeout').and.callThrough();
            const alwaysFail = jasmine.createSpy('callback').and.returnValue(
                throwError(() => new Error('fail')),
            );

            service.start(null, alwaysFail);

            const initial = expiry - new Date().setSeconds(0) - 60_000;
            tick(initial + 500);
            tick(RETRY_BASE_MS); // attempt 2
            tick(RETRY_BASE_MS * 2); // attempt 3 — last retry

            // Every delay recorded by setTimeout must respect the cap.
            setTimeoutSpy.calls.allArgs()
                .map((args) => args[1])
                .filter((d) => Boolean(d) && Number(d) > 0)
                .forEach((d) => expect(Number(d)).toBeLessThanOrEqual(RETRY_CAP_MS));

            expect(alwaysFail).toHaveBeenCalledTimes(MAX_RETRY_ATTEMPTS);

            discardPeriodicTasks();
        }));

        it('resets the retry counter to 0 after a successful refresh', fakeAsync(() => {
            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            let failCount = 0;
            const failOnceThenSucceed = jasmine.createSpy('callback').and.callFake(() => {
                failCount++;
                return failCount === 1
                    ? throwError(() => new Error('fail'))
                    : of(null);
            });

            service.start(null, failOnceThenSucceed);

            const delay = expiry - new Date().setSeconds(0) - 60_000;
            tick(delay + 500); // attempt 1 fails → retryAttempt becomes 1
            tick(RETRY_BASE_MS); // retry succeeds → retryAttempt resets to 0

            expect((service as any).retryAttempt).toBe(0);

            discardPeriodicTasks();
        }));

        it('stops retrying once the token expiry has passed', fakeAsync(() => {
            setStoredExpiry(Date.now() - 5_000); // already expired

            const callback = jasmine.createSpy('callback').and.returnValue(
                throwError(() => new Error('fail')),
            );
            service.start(null, callback);

            // scheduleLeaderTimer fires immediately (expired) → attempt 1
            expect(callback).toHaveBeenCalledTimes(1);

            // scheduleRetry() sees Date.now() >= expiry → stops; no further timer fires
            tick(60_000);
            expect(callback).toHaveBeenCalledTimes(1);

            discardPeriodicTasks();
        }));
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Failover: follower becomes leader after the previous leader's lock releases
    // ─────────────────────────────────────────────────────────────────────────

    describe('failover / leadership handover', () => {
        it('schedules a timer from the current stored expiry when leadership is gained', fakeAsync(() => {
            enableRememberMe();
            denyLeadership(); // starts as follower

            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback);

            // Follower: no timer scheduled yet
            tick(500);
            expect(callback).not.toHaveBeenCalled();

            // Simulate the WebLocks API finally granting the lock to this tab
            // (previous leader closed/crashed → our queued callback is invoked).
            const leaderCb = mockLockManager.request.calls.mostRecent().args[2] as () => unknown;
            leaderCb(); // isLeader = true, scheduleLeaderTimer()

            // Timer should now be scheduled from the stored expiry.
            const remaining = expiry - new Date().setSeconds(0) - 60_000;
            tick(remaining + 500);
            expect(callback).toHaveBeenCalledTimes(1);

            discardPeriodicTasks();
        }));
    });

    // ─────────────────────────────────────────────────────────────────────────
    // runExclusive — single-flight cross-tab coordination
    // ─────────────────────────────────────────────────────────────────────────

    describe('runExclusive', () => {

        it('returns operation() directly when tab sync is disabled', (done) => {
            (service as any).coreConfig = { SINGLE_SESSION_TAB_SYNC: false };

            service.runExclusive(
                () => of('fresh'),
                () => of('cached'),
            ).subscribe((v) => {
                expect(v).toBe('fresh');
                done();
            });
        });

        it('runs operation() when the lock is acquired and expiry has not advanced', fakeAsync(() => {
            enableRememberMe();
            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            mockLockManager.request.and.callFake(
                (_name: string, _opts: unknown, cb: () => unknown) => {
                    cb();
                    return Promise.resolve();
                },
            );

            let executed = '';
            service.runExclusive(
                () => { executed = 'operation'; return of(null); },
                () => { executed = 'skip'; return of(null); },
            ).subscribe();

            flush();
            expect(executed).toBe('operation');
        }));

        it('runs onSkip() when expiry advanced (a peer already refreshed)', fakeAsync(() => {
            enableRememberMe();
            const oldExpiry = expiryFrom(TEN_MIN);
            const newExpiry = oldExpiry + 3_600_000;

            // First read (snapshot before lock) → old; subsequent reads (inside callback) → new.
            let readCount = 0;
            sessionStorageSpy.retrieve.withArgs(EXPIRES_DATE_FIELD).and.callFake(() => {
                readCount++;
                return readCount === 1 ? oldExpiry : newExpiry;
            });

            mockLockManager.request.and.callFake(
                (_name: string, _opts: unknown, cb: () => unknown) => {
                    cb();
                    return Promise.resolve();
                },
            );

            let executed = '';
            service.runExclusive(
                () => { executed = 'operation'; return of(null); },
                () => { executed = 'skip'; return of(null); },
            ).subscribe();

            flush();
            expect(executed).toBe('skip');
        }));
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Cleanup
    // ─────────────────────────────────────────────────────────────────────────

    describe('cleanup', () => {

        it('releases leadership and clears expiry storage on clear()', fakeAsync(() => {
            enableRememberMe();
            grantLeadership();
            setStoredExpiry(expiryFrom(TEN_MIN));

            const callback = jasmine.createSpy('callback').and.returnValue(of(null));
            service.start(null, callback);

            service.clear();

            expect((service as any).isLeader).toBe(false);
            expect((service as any).leadershipRequested).toBe(false);
            expect(sessionStorageSpy.clear).toHaveBeenCalledWith(EXPIRES_DATE_FIELD);
            expect(localStorageSpy.clear).toHaveBeenCalledWith(EXPIRES_DATE_FIELD);

            discardPeriodicTasks();
        }));

        it('resets the retry attempt counter on clear()', fakeAsync(() => {
            enableRememberMe();
            grantLeadership();
            spyOn(Math, 'random').and.returnValue(0);
            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            const alwaysFail = jasmine.createSpy('callback').and.returnValue(
                throwError(() => new Error('fail')),
            );
            service.start(null, alwaysFail);

            const initial = expiry - new Date().setSeconds(0) - 60_000;
            tick(initial + 500); // fires main timer → retryAttempt becomes 1

            service.clear();
            expect((service as any).retryAttempt).toBe(0);

            discardPeriodicTasks();
        }));

        it('clears both the main timer and the retry timer on ngOnDestroy()', fakeAsync(() => {
            enableRememberMe();
            grantLeadership();
            spyOn(Math, 'random').and.returnValue(0);

            const expiry = expiryFrom(TEN_MIN);
            setStoredExpiry(expiry);

            const alwaysFail = jasmine.createSpy('callback').and.returnValue(
                throwError(() => new Error('fail')),
            );
            service.start(null, alwaysFail);

            // Fire the main timer so that a retry is now pending.
            const initial = expiry - new Date().setSeconds(0) - 60_000;
            tick(initial + 500);

            // Install spy just before ngOnDestroy to count exactly those two clearTimeout calls.
            const clearSpy = spyOn(window, 'clearTimeout').and.callThrough();
            service.ngOnDestroy();

            expect(clearSpy).toHaveBeenCalledTimes(2);

            discardPeriodicTasks();
        }));
    });
});
